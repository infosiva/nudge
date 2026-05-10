/**
 * POST /api/study/upload
 * Accepts: multipart/form-data with field "file" (PDF or text)
 * Returns: { text, quiz, flashcards, summary }
 *
 * Pipeline:
 *   1. Extract text from uploaded file (PDF: pdftext extraction; TXT/MD: direct)
 *   2. Truncate to 8000 chars (model context limit)
 *   3. AI generates quiz (5 Qs), flashcards (8 cards), summary (3 bullet points)
 *   4. Return JSON
 */
import { NextRequest, NextResponse } from 'next/server'
import { aiChat } from '@/lib/ai'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase()

  if (name.endsWith('.pdf')) {
    // Use pdf-parse via dynamic import (server only)
    const buf = Buffer.from(await file.arrayBuffer())
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse')
      const data = await pdfParse(buf)
      return data.text ?? ''
    } catch {
      // pdf-parse not installed — extract raw printable chars as fallback
      const raw = buf.toString('latin1')
      return raw.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s{3,}/g, '\n').trim()
    }
  }

  // TXT / MD / plain text
  return await file.text()
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 })
    }

    const rawText = await extractText(file)
    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json({ error: 'Could not extract enough text from file' }, { status: 422 })
    }

    // Truncate to avoid token overflow (~8000 chars ≈ 2000 tokens)
    const text = rawText.slice(0, 8000)

    const prompt = `You are a study assistant. Analyse this study material and generate learning aids.

STUDY MATERIAL:
"""
${text}
"""

Return ONLY a valid JSON object (no markdown, no extra text):
{
  "summary": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"],
  "flashcards": [
    { "front": "Question or term", "back": "Answer or definition" }
  ],
  "quiz": [
    {
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "explanation": "Why A is correct."
    }
  ]
}

Rules:
- summary: exactly 5 bullet points (strings), each 1 sentence, the most important takeaways
- flashcards: exactly 8 cards covering key terms, concepts, or facts from the material
- quiz: exactly 5 multiple-choice questions (4 options each), answer must match an option exactly
- Stay faithful to the source material — no invented facts
- Output ONLY the JSON, nothing else`

    const raw = await aiChat(
      [{ role: 'user', content: prompt }],
      undefined,
      2048,
      'balanced'
    )

    // Strip markdown fences if model wraps output
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()

    let parsed: { summary: string[]; flashcards: { front: string; back: string }[]; quiz: { question: string; options: string[]; answer: string; explanation: string }[] }
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: 'AI returned invalid JSON — try again' }, { status: 500 })
    }

    return NextResponse.json({
      filename: file.name,
      charCount: rawText.length,
      summary:    parsed.summary    ?? [],
      flashcards: parsed.flashcards ?? [],
      quiz:       parsed.quiz       ?? [],
    })
  } catch (err) {
    console.error('study/upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
