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
    const { idea_input } = body

    if (!idea_input) {
      return NextResponse.json({ error: 'idea_input is required' }, { status: 400 })
    }

    const result = await generateContent(PROMPT_TEMPLATES.idea_generator, {
      idea_input
    })

    // Parse the JSON response
    try {
      const parsedResult = JSON.parse(result)
      return NextResponse.json(parsedResult)
    } catch (parseError) {
      // If JSON parsing fails, return the raw text
      return NextResponse.json({ raw: result })
    }
  } catch (error) {
    console.error('Failed to generate idea:', error)
    return NextResponse.json({ error: 'Failed to generate idea' }, { status: 500 })
  }
}