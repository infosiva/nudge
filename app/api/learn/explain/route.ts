import { NextRequest, NextResponse } from 'next/server'
import { aiCached, aiChat } from '@/lib/ai'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { topic, subject, age, level } = await req.json()
    if (!topic) {
      return NextResponse.json({ error: 'topic required' }, { status: 400 })
    }

    const cacheKey = `learn_explain_${subject}_${level}_${age}_${topic}`

    const explanation = await aiCached(cacheKey, () =>
      aiChat(
        [
          {
            role: 'user',
            content: `Explain "${topic}" in ${subject} to a ${age}-year-old at "${level}" level.

Write a clear, engaging lesson (200–350 words). Use:
- Simple language appropriate for age ${age}
- **bold** for key terms
- Short bullet points (- item) for lists
- Blank lines between sections

Do not include a quiz, do not say "in conclusion". Just the lesson content.`,
          },
        ],
        `You are Nudge, a friendly AI tutor. Explain topics clearly and engagingly for the student's age and level.`
      )
    )

    return NextResponse.json({ explanation })
  } catch (err) {
    console.error('/api/learn/explain error:', err)
    return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 })
  }
}
