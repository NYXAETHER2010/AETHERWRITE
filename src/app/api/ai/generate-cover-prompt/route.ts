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
    const { title, genre, main_idea, style_tone } = body

    if (!main_idea || !genre) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await generateContent(PROMPT_TEMPLATES.cover_prompt, {
      title: title || 'Untitled Novel',
      main_idea,
      genre,
      style_tone
    })

    return NextResponse.json({ prompt: result })
  } catch (error) {
    console.error('Failed to generate cover prompt:', error)
    return NextResponse.json({ error: 'Failed to generate cover prompt' }, { status: 500 })
  }
}