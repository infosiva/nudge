import { NextRequest, NextResponse } from 'next/server'
import { aiCached, aiChat } from '@/lib/ai'
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

    const cacheKey = `learn_explain_v2_${subject}_${level}_${age}_${topic}`

    const isGcse = subject?.includes('gcse')
    const is11plus = subject?.includes('eleven') || subject?.includes('11plus')
    const isInterview = subject?.includes('interview')

    const examSection = isGcse
      ? `**Exam Focus (GCSE)**
- What AQA, Edexcel, and OCR examiners look for on this topic
- Common mistakes and how to avoid them
- Key command words: describe, explain, analyse, evaluate
- How to structure your answer for maximum marks`
      : is11plus
      ? `**11+ Focus**
- Common question types for CEM and GL Assessment papers
- Speed and accuracy tips
- Worked example with step-by-step solution`
      : isInterview
      ? `**Interview Focus**
- How this topic appears in real interviews
- STAR method: Situation → Task → Action → Result
- Strong answer example + follow-up questions to expect`
      : ''

    const explanation = await aiCached(cacheKey, () =>
      aiChat(
        [
          {
            role: 'user',
            content: `Explain "${topic}" in ${subject} to a ${age}-year-old at "${level}" level.

Write a detailed, exam-focused lesson (400–600 words). Structure it clearly:

**Overview**
One paragraph introducing the concept.

**Key Concepts**
- **Term 1:** Definition and why it matters
- **Term 2:** Definition and why it matters
(at least 3–5 key terms with bold labels)

**How It Works**
Step-by-step explanation with examples. For maths: show worked examples with numbers. For science: explain the mechanism. For English: show a model paragraph. For history/geography: give real-world context and dates.

${examSection}

**Quick Summary**
3 bullet points: the most important things to remember.

Use **bold** for all key terms. Keep language age-appropriate for a ${age}-year-old.
Do not say "in conclusion". Output lesson content only.`,
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
