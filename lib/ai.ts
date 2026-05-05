/**
 * lib/ai.ts — Universal AI client (canonical template)
 *
 * Features:
 *   - Quality tiers: 'fast' | 'balanced' | 'best' — caller picks the right
 *     model class for the task; each provider routes to the appropriate model.
 *   - Multi-key rotation: add GROQ_API_KEY_1, GROQ_API_KEY_2 etc. to multiply
 *     free-tier capacity. Keys are rotated on quota/rate-limit errors.
 *   - Fallback chain: Groq → Gemini → Cerebras → Anthropic (paid last resort)
 *   - In-memory response cache (1h TTL) via aiCached()
 *
 * Quality routing:
 *   'fast'     → small/instant models  (8b class)   — simple formatting, classification
 *   'balanced' → mid-tier              (70b class)  — default; most tasks
 *   'best'     → largest available     (scout/235b) — complex reasoning, strategy
 *
 * Usage:
 *   import { aiChat, aiCached } from '@/lib/ai'
 *   const reply = await aiChat(messages)                        // balanced
 *   const plan  = await aiChat(messages, system, 2048, 'best')  // best models
 *
 * Capacity scaling (add to .env):
 *   GROQ_API_KEY_1=gsk_...     (free at console.groq.com)
 *   GROQ_API_KEY_2=gsk_...
 *   GEMINI_API_KEY_1=AIza...   (free at aistudio.google.com)
 *   CEREBRAS_API_KEY=csk_...   (free at cloud.cerebras.ai)
 */
import config from '@/vertical.config'

// ── Types ─────────────────────────────────────────────────────────────────────
export type Quality = 'fast' | 'balanced' | 'best'
type Msg = { role: 'user' | 'assistant'; content: string }
export interface AIResponse { text: string; provider: string; model: string }

// ── Model tiers per provider ──────────────────────────────────────────────────
const GROQ_TIERS: Record<Quality, string[]> = {
  fast:     ['llama-3.1-8b-instant'],
  balanced: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
  best:     ['meta-llama/llama-4-scout-17b-16e-instruct', 'qwen/qwen3-32b', 'llama-3.3-70b-versatile'],
}

const GEMINI_TIERS: Record<Quality, string[]> = {
  fast:     ['gemini-2.0-flash-lite'],
  balanced: ['gemini-2.0-flash', 'gemini-2.0-flash-lite'],
  best:     ['gemini-2.5-flash', 'gemini-2.0-flash'],
}

const CEREBRAS_TIERS: Record<Quality, string[]> = {
  fast:     ['llama3.1-8b'],
  balanced: ['gpt-oss-120b', 'llama3.1-8b'],
  best:     ['qwen-3-235b-a22b-instruct-2507', 'gpt-oss-120b'],
}

const CLAUDE_TIERS: Record<Quality, string> = {
  fast:     'claude-haiku-4-5-20251001',
  balanced: 'claude-haiku-4-5-20251001',
  best:     'claude-sonnet-4-6',
}

// ── Key rotation helper ───────────────────────────────────────────────────────
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

// ── Error classification ──────────────────────────────────────────────────────
function isQuotaError(msg: string): boolean {
  const m = msg.toLowerCase()
  return (
    m.includes('exhausted') || m.includes('rate_limit') || m.includes('rate limit') ||
    m.includes('quota') || m.includes('exceeded') || m.includes('billing') ||
    m.includes('credit') || m.includes('limit reached') || m.includes('timed out') ||
    m.includes('401') || m.includes('403') || m.includes('invalid_api_key') ||
    m.includes('unauthorized') || m.includes('not configured') || m.includes('no keys') ||
    m.includes('model_not_active') || m.includes('model not found') ||
    m.includes('not supported') || m.includes('overloaded') ||
    m.includes('service unavailable') || m.includes('529')
  )
}

const TIMEOUT_MS = 30_000

function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out after ${TIMEOUT_MS / 1000}s`)), TIMEOUT_MS)
    promise.then(v => { clearTimeout(t); resolve(v) }, e => { clearTimeout(t); reject(e) })
  })
}

// ── Generic OpenAI-compatible fetch ──────────────────────────────────────────
async function callOpenAICompat(
  baseUrl: string, providerName: string, key: string, model: string,
  system: string, messages: Msg[], maxTokens: number,
): Promise<string> {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model, max_tokens: maxTokens,
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

// ── Provider callers (model tier + key rotation) ──────────────────────────────
async function callProvider(
  baseUrl: string, providerName: string, service: string,
  models: string[], system: string, messages: Msg[], maxTokens: number,
): Promise<{ text: string; model: string }> {
  const keys = getKeys(service)
  if (keys.length === 0) throw new Error(`${service} not configured`)

  for (const model of models) {
    for (const key of keys) {
      try {
        const text = await withTimeout(
          callOpenAICompat(baseUrl, providerName, key, model, system, messages, maxTokens),
          `${providerName}/${model}`,
        )
        if (text) return { text, model }
      } catch (e: any) {
        const msg = (e.message || '').slice(0, 150)
        if (isQuotaError(msg)) {
          console.warn(`[AI] ${providerName}/${model} quota/skip: ${msg.slice(0, 80)}`)
          continue
        }
        throw e
      }
    }
  }
  throw new Error(`All ${providerName} models/keys exhausted`)
}

async function callAnthropic(
  quality: Quality, system: string, messages: Msg[], maxTokens: number,
): Promise<{ text: string; model: string }> {
  const key = getKeys('ANTHROPIC')[0]
  if (!key) throw new Error('ANTHROPIC not configured')
  const model = CLAUDE_TIERS[quality]
  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic({ apiKey: key })
  const res = await withTimeout(
    client.messages.create({ model, max_tokens: maxTokens, system, messages }),
    'Anthropic',
  )
  return { text: (res.content[0] as { text: string }).text, model }
}

// ── Core callAI — used by all projects ───────────────────────────────────────
export async function callAI(
  system: string,
  messages: Msg[],
  maxTokens = 1024,
  quality: Quality = 'balanced',
): Promise<AIResponse> {
  const providers = [
    { name: 'groq',      fn: () => callProvider('https://api.groq.com/openai/v1',                          'Groq',     'GROQ',     GROQ_TIERS[quality],     system, messages, maxTokens) },
    { name: 'gemini',    fn: () => callProvider('https://generativelanguage.googleapis.com/v1beta/openai', 'Gemini',   'GEMINI',   GEMINI_TIERS[quality],   system, messages, maxTokens) },
    { name: 'cerebras',  fn: () => callProvider('https://api.cerebras.ai/v1',                              'Cerebras', 'CEREBRAS', CEREBRAS_TIERS[quality], system, messages, maxTokens) },
    { name: 'anthropic', fn: () => callAnthropic(quality, system, messages, maxTokens) },
  ]

  const tried: string[] = []
  for (const { name, fn } of providers) {
    try {
      const { text, model } = await fn()
      if (text) {
        if (tried.length) console.warn(`[AI] fell back to ${name}/${model} after: ${tried.join(' → ')}`)
        return { text, provider: name, model }
      }
    } catch (e: any) {
      const msg = (e.message || '').slice(0, 120)
      tried.push(`${name}(${msg})`)
      console.warn(`[AI] ${name} failed — trying next. Reason: ${msg}`)
    }
  }
  throw new Error(`All AI providers exhausted. Tried: ${tried.join(' | ')}`)
}

// ── Convenience wrapper (backward-compatible with old aiChat signature) ────────
export async function aiChat(
  messages: Msg[],
  systemPrompt?: string,
  maxTokens = 700,
  quality: Quality = 'balanced',
): Promise<string> {
  const system = systemPrompt ?? config.aiSystemPrompt
  const { text } = await callAI(system, messages, maxTokens, quality)
  return text
}

// ── In-memory response cache (1h TTL) ────────────────────────────────────────
const _cache = new Map<string, { text: string; ts: number }>()
const TTL    = 60 * 60 * 1000

export async function aiCached(key: string, fn: () => Promise<string>): Promise<string> {
  const hit = _cache.get(key)
  if (hit && Date.now() - hit.ts < TTL) return hit.text
  const text = await fn()
  _cache.set(key, { text, ts: Date.now() })
  return text
}
