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
    const { title, main_idea, genre, characters, style_tone } = body

    if (!main_idea || !genre) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await generateContent(PROMPT_TEMPLATES.outline_generator, {
      title: title || 'Untitled Novel',
      main_idea,
      genre,
      characters: Array.isArray(characters) ? characters.join(', ') : characters,
      style_tone
    })

    // Parse the JSON response
    try {
      const parsedResult = JSON.parse(result)
      return NextResponse.json(parsedResult)
    } catch (parseError) {
      console.error('Failed to parse outline JSON:', parseError)
      // If JSON parsing fails, return the raw text
      return NextResponse.json({ raw: result })
    }
  } catch (error) {
    console.error('Failed to generate outline:', error)
    return NextResponse.json({ error: 'Failed to generate outline' }, { status: 500 })
  }
}