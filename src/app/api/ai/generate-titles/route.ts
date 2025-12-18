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
    const { main_idea, genre, characters, style_tone } = body

    if (!main_idea || !genre) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await generateContent(PROMPT_TEMPLATES.title_generator, {
      main_idea,
      genre,
      characters: Array.isArray(characters) ? characters.join(', ') : characters,
      style_tone
    })

    // Split by lines and filter out empty lines
    const titles = result.split('\n')
      .map(line => line.replace(/^\d+\.\s*/, '').trim()) // Remove numbering
      .filter(line => line.length > 0)

    return NextResponse.json({ titles })
  } catch (error) {
    console.error('Failed to generate titles:', error)
    return NextResponse.json({ error: 'Failed to generate titles' }, { status: 500 })
  }
}