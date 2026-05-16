import { NextRequest, NextResponse } from 'next/server'
import { aiChat } from '@/lib/ai'
import { AI_LIMITER } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const limited = AI_LIMITER.check(req)
  if (limited) return limited

  try {
    const { topic, subject, age, level } = await req.json()
    if (!topic) {
      return NextResponse.json({ error: 'topic required' }, { status: 400 })
    }

    const is11plus = subject?.includes('eleven') || subject?.includes('11plus')
    const isVR = is11plus && topic?.toLowerCase().includes('verbal')
    const isNVR = is11plus && topic?.toLowerCase().includes('non-verbal')

    // VR/NVR: generate actual question-type simulations, all multiple choice
    const quizPrompt = (isVR || isNVR)
      ? `Create 5 practice questions of the EXACT type "${topic}" for a ${age}-year-old 11+ student.

CRITICAL: These must be REAL examples of this specific 11+ question type — not questions ABOUT it.
For VR types: use actual words, letters, codes as they appear in CEM/GL papers.
For NVR types: describe shapes in text (e.g. "large dark circle", "small white triangle rotated 90°").

Return ONLY a JSON object (no markdown):
{
  "questions": [
    {
      "type": "multiple_choice",
      "question": "The actual question as it would appear in a paper",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "explanation": "Step-by-step: how to solve this. The rule/pattern is X because Y."
    }
  ]
}

Rules:
- ALL 5 questions must be multiple_choice
- Every question is a real practice example of "${topic}"
- Options must be plausible wrong answers (common traps)
- answer must exactly match one option
- explanation shows the solving method step-by-step
- No markdown fences, just valid JSON`
      : `Create a 5-question quiz about "${topic}" in ${subject} for a ${age}-year-old at "${level}" level.

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
- No markdown fences, just valid JSON`

    const raw = await aiChat(
      [{ role: 'user', content: quizPrompt }],
      'You are a quiz generator for a children and teen learning platform. Output only valid JSON, no markdown, no explanation. All questions must be age-appropriate and educational. Never generate questions involving violence, adult themes, or harmful content.',
      1400,
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
