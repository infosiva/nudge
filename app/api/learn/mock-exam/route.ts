import { NextRequest, NextResponse } from 'next/server'
import { aiChat } from '@/lib/ai'
import { AI_LIMITER } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const limited = AI_LIMITER.check(req)
  if (limited) return limited

  try {
    const { subject, level, age, examBoard, paperType } = await req.json()
    if (!subject || !paperType) {
      return NextResponse.json({ error: 'subject and paperType required' }, { status: 400 })
    }

    let systemPrompt = 'You are an exam paper generator for a children and teen learning platform. Output only valid JSON, no markdown, no explanation. All content must be age-appropriate and educational. Never generate questions involving violence, adult themes, or harmful content.'
    let userPrompt = ''

    if (paperType === 'gcse') {
      userPrompt = `Generate a GCSE mock exam paper for ${subject} (Level: ${level}, Age: ${age}).

Return ONLY a JSON object (no markdown, no extra text):
{
  "title": "Paper title",
  "duration": 45,
  "totalMarks": 30,
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "marks": 1,
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "markScheme": "What markers look for: ...",
      "explanation": "Why A is correct."
    }
  ]
}

Rules:
- Generate 10 questions total
- Mix of 1-mark multiple_choice (4 questions), 4-mark short_answer (4 questions), 6-mark extended (2 questions)
- For multiple_choice: 4 options, answer must match one option
- For short_answer and extended: detailed markScheme with grading criteria
- Include age-appropriate difficulty for Level ${level}
- All explanations 1–2 sentences
- No markdown fences, just valid JSON`
    } else if (paperType === '11plus') {
      userPrompt = `Generate an 11+ entrance exam paper for ${subject} (Level: ${level}, Age: ${age}).

Return ONLY a JSON object (no markdown, no extra text):
{
  "title": "Paper title",
  "duration": 45,
  "totalMarks": 30,
  "questions": [
    {
      "id": 1,
      "type": "verbal_reasoning",
      "marks": 1,
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "markScheme": "What markers look for: ...",
      "explanation": "Why A is correct."
    }
  ]
}

Rules:
- Generate 10 questions total
- Mix of verbal_reasoning, non_verbal_reasoning, maths, english_comprehension
- All 1-mark questions with 4 options each
- Include answer key and markScheme with grading notes
- Age-appropriate difficulty (typically 10–11 years old)
- Explanations 1–2 sentences
- No markdown fences, just valid JSON`
    } else if (paperType === 'interview') {
      userPrompt = `Generate interview prep questions for ${subject} (Level: ${level}, Age: ${age}).

Return ONLY a JSON object (no markdown, no extra text):
{
  "title": "Paper title",
  "duration": 45,
  "totalMarks": 30,
  "questions": [
    {
      "id": 1,
      "type": "behavioural",
      "marks": 1,
      "question": "Tell me about a time when...",
      "answer": "...",
      "markScheme": "STAR framework: Situation, Task, Action, Result",
      "explanation": "Model answer demonstrating..."
    }
  ]
}

Rules:
- Generate 10 questions total: 5 behavioural (STAR method) + 5 technical/competency
- Behavioural questions start with "Tell me about a time when..." or "Describe a situation where..."
- Technical questions test subject knowledge and problem-solving
- Include model STAR answers for behavioural questions
- MarkScheme explains scoring criteria
- Explanations 2–3 sentences with example structure
- No markdown fences, just valid JSON`
    }

    const raw = await aiChat(
      [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      systemPrompt,
      1200,
      'best',
    )

    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('/api/learn/mock-exam error:', err)
    return NextResponse.json({ error: 'Failed to generate mock exam' }, { status: 500 })
  }
}
