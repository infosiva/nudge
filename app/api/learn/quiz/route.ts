import { NextRequest, NextResponse } from 'next/server'
import { aiChat } from '@/lib/ai'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { topic, subject, age, level } = await req.json()
    if (!topic) {
      return NextResponse.json({ error: 'topic required' }, { status: 400 })
    }

    const raw = await aiChat(
      [
        {
          role: 'user',
          content: `Create a 5-question quiz about "${topic}" in ${subject} for a ${age}-year-old at "${level}" level.

Return ONLY a JSON object (no markdown, no extra text):
{
  "questions": [
    {
      "type": "multiple_choice",
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "explanation": "Why A is correct."
    },
    {
      "type": "true_false",
      "question": "Statement to evaluate.",
      "answer": "True",
      "explanation": "Why it's true."
    }
  ]
}

Rules:
- Mix of multiple_choice (3 questions) and true_false (2 questions)
- Options array only for multiple_choice (4 choices)
- answer must exactly match one of the options (or "True"/"False")
- explanation must be 1–2 sentences
- Age-appropriate difficulty
- No markdown fences, just valid JSON`,
        },
      ],
      'You are a quiz generator. Output only valid JSON, no markdown, no explanation.',
      1200,
      'best',
    )

    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('/api/learn/quiz error:', err)
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 })
  }
}
