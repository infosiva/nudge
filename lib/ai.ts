/**
 * lib/ai.ts — Universal AI fallback chain with multi-key rotation
 *
 * Priority order (free first, paid last resort):
 *   1. Groq      — llama-4-scout → llama-3.3-70b → qwen3-32b → llama-3.1-8b
 *   2. Gemini    — gemini-2.5-flash → gemini-2.0-flash → gemini-2.0-flash-lite
 *   3. Cerebras  — qwen-3-235b → gpt-oss-120b → llama3.1-8b
 *   4. Anthropic — claude-haiku-4-5 (paid, absolute last resort)
 *
 * Multi-key rotation: add extra keys as GROQ_API_KEY_1, GROQ_API_KEY_2, etc.
 * When a key hits rate-limits or quota, the next key is tried automatically.
 *
 * To add capacity:
 *   GROQ_API_KEY_1=gsk_...    (free at console.groq.com)
 *   GROQ_API_KEY_2=gsk_...
 *   GEMINI_API_KEY_1=AIza...  (free at aistudio.google.com)
 *   CEREBRAS_API_KEY=csk_...  (free at cloud.cerebras.ai)
 */
import config from '@/vertical.config'

// ── Key rotation helper ───────────────────────────────────────────────────────
// Reads GROQ_API_KEY + GROQ_API_KEY_1 … GROQ_API_KEY_10 etc.
function getKeys(service: string): string[] {
  const keys: string[] = []
  const plain = process.env[`${service}_API_KEY`] || process.env[`${service}_TOKEN`]
  if (plain) keys.push(plain)
  for (let i = 1; i <= 10; i++) {
    const k = process.env[`${service}_API_KEY_${i}`] || process.env[`${service}_TOKEN_${i}`]
    if (k) keys.push(k)
    else break
  }
  return [...new Set(keys)]
}

// Errors that mean "this key is done" — rotate to next, don't retry same key
function isQuotaError(msg: string): boolean {
  const m = msg.toLowerCase()
  return (
    m.includes('exhausted') || m.includes('rate_limit') || m.includes('rate limit') ||
    m.includes('quota') || m.includes('exceeded') || m.includes('billing') ||
    m.includes('credit') || m.includes('limit reached') || m.includes('timed out') ||
    m.includes('401') || m.includes('403') || m.includes('invalid_api_key') ||
    m.includes('unauthorized') || m.includes('not configured') ||
    m.includes('model_not_active') || m.includes('model not found') ||
    m.includes('not supported') || m.includes('overloaded') ||
    m.includes('service unavailable') || m.includes('529') ||
    m.includes('no keys')
  )
}

// Hard timeout — prevents a hung HTTP request from blocking the response
const TIMEOUT_MS = 30_000

function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out after ${TIMEOUT_MS / 1000}s`)), TIMEOUT_MS)
    promise.then(v => { clearTimeout(t); resolve(v) }, e => { clearTimeout(t); reject(e) })
  })
}

// ── Generic OpenAI-compatible fetch (Groq, Gemini, Cerebras all use it) ───────
async function callOpenAICompat(
  baseUrl: string,
  providerName: string,
  key: string,
  model: string,
  system: string,
  messages: Msg[],
  maxTokens: number,
): Promise<string> {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
  })
  if (!res.ok) {
    const e = await res.text()
    throw new Error(`${providerName}/${model} ${res.status}: ${e.slice(0, 200)}`)
  }
  const data = await res.json() as any
  return data.choices?.[0]?.message?.content || ''
}

// ── Provider callers with key rotation ────────────────────────────────────────

const GROQ_MODELS = [
  'meta-llama/llama-4-scout-17b-16e-instruct',
  'llama-3.3-70b-versatile',
  'qwen/qwen3-32b',
  'llama-3.1-8b-instant',
]

const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
]

const CEREBRAS_MODELS = [
  'qwen-3-235b-a22b-instruct-2507',
  'gpt-oss-120b',
  'llama3.1-8b',
]

async function callProvider(
  baseUrl: string,
  providerName: string,
  service: string,
  models: string[],
  system: string,
  messages: Msg[],
  maxTokens: number,
): Promise<string> {
  const keys = getKeys(service)
  if (keys.length === 0) throw new Error(`No keys configured for ${service}`)

  for (const model of models) {
    for (const key of keys) {
      try {
        const result = await withTimeout(
          callOpenAICompat(baseUrl, providerName, key, model, system, messages, maxTokens),
          `${providerName}/${model}`,
        )
        if (result) return result
      } catch (e: any) {
        const msg = e.message?.slice(0, 150) || ''
        if (isQuotaError(msg)) {
          console.warn(`[AI] ${providerName}/${model} quota/auth: ${msg.slice(0, 80)} — trying next`)
          continue
        }
        throw e
      }
    }
  }
  throw new Error(`All ${providerName} models and keys exhausted`)
}

// ── Claude (paid, last resort) ────────────────────────────────────────────────
async function callAnthropic(system: string, messages: Msg[], maxTokens: number): Promise<string> {
  const key = getKeys('ANTHROPIC')[0]
  if (!key) throw new Error('No ANTHROPIC_API_KEY configured')

  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic({ apiKey: key })
  const res = await withTimeout(
    client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      system,
      messages,
    }),
    'Anthropic',
  )
  return (res.content[0] as { text: string }).text
}

// ── Types ─────────────────────────────────────────────────────────────────────
type Msg = { role: 'user' | 'assistant'; content: string }

// ── Public API ────────────────────────────────────────────────────────────────
export async function aiChat(messages: Msg[], systemPrompt?: string): Promise<string> {
  const system  = systemPrompt ?? config.aiSystemPrompt
  const maxToks = 700

  const providers = [
    () => callProvider('https://api.groq.com/openai/v1',                                    'Groq',     'GROQ',      GROQ_MODELS,     system, messages, maxToks),
    () => callProvider('https://generativelanguage.googleapis.com/v1beta/openai',           'Gemini',   'GEMINI',    GEMINI_MODELS,   system, messages, maxToks),
    () => callProvider('https://api.cerebras.ai/v1',                                        'Cerebras', 'CEREBRAS',  CEREBRAS_MODELS, system, messages, maxToks),
    () => callAnthropic(system, messages, maxToks),
  ]

  const tried: string[] = []
  for (const fn of providers) {
    try {
      const text = await fn()
      if (text) return text
    } catch (e: any) {
      const msg = e.message?.slice(0, 120) || ''
      tried.push(msg)
      console.warn(`[AI] provider failed — trying next. Reason: ${msg}`)
    }
  }

  throw new Error(`All AI providers exhausted. Errors: ${tried.join(' | ')}`)
}

// ── In-memory response cache (per-process, 1h TTL) ───────────────────────────
const cache = new Map<string, { text: string; ts: number }>()
const TTL   = 60 * 60 * 1000

export async function aiCached(key: string, fn: () => Promise<string>): Promise<string> {
  const hit = cache.get(key)
  if (hit && Date.now() - hit.ts < TTL) return hit.text
  const text = await fn()
  cache.set(key, { text, ts: Date.now() })
  return text
}
