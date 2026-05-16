import { NextRequest, NextResponse } from 'next/server'
import { aiCached, aiChat } from '@/lib/ai'
import { AI_LIMITER } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const limited = AI_LIMITER.check(req)
  if (limited) return limited

  try {
    const { subject, level, goal, age } = await req.json()
    if (!subject || !level) {
      return NextResponse.json({ error: 'subject and level required' }, { status: 400 })
    }

    const cacheKey = `learn_path_v2_${subject}_${level}_${age}`

    const raw = await aiCached(cacheKey, () =>
      aiChat(
        [
          {
            role: 'user',
            content: `Generate a learning path for a ${age}-year-old studying "${subject}" at "${level}" level.
${goal ? `Their goal: ${goal}` : ''}

Return ONLY a JSON object with this exact shape (no markdown, no extra text):
{
  "topics": [
    { "id": "topic-slug", "title": "Topic Title", "desc": "One sentence description." },
    ...
  ]
}

Rules:
- 8–12 topics, ordered from fundamentals to advanced
- id must be lowercase, hyphen-separated, unique
- desc must be one sentence, engaging and age-appropriate
- No markdown, no explanation, just the JSON`,
          },
        ],
        'You are a curriculum designer. Output only valid JSON, no markdown fences, no explanation.'
      )) // cached

    // Strip markdown fences if model ignored instructions
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('/api/learn/path error:', err)
    return NextResponse.json({ error: 'Failed to generate learning path' }, { status: 500 })
  }
}
