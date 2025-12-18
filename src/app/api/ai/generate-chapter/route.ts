import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateContent, PROMPT_TEMPLATES } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, 
      main_idea, 
      genre, 
      characters, 
      style_tone, 
      outline, 
      chapter_number, 
      chapter_type, 
      chapter_title, 
      chapter_summary,
      previous_chapter_summary 
    } = body

    if (!main_idea || !genre) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await generateContent(PROMPT_TEMPLATES.chapter_generator, {
      title: title || 'Untitled Novel',
      main_idea,
      genre,
      characters: Array.isArray(characters) ? characters.join(', ') : characters,
      style_tone,
      outline,
      chapter_number,
      chapter_type,
      chapter_title,
      chapter_summary,
      previous_chapter_summary
    })

    return NextResponse.json({ content: result })
  } catch (error) {
    console.error('Failed to generate chapter:', error)
    return NextResponse.json({ error: 'Failed to generate chapter' }, { status: 500 })
  }
}