import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function generateTitles(novel: any): Promise<string[]> {
  // Simulated AI response - in production, you'd use z-ai-web-dev-sdk
  const mockTitles = [
    "The Unfinished Manuscript",
    "Words Between Pages",
    "Her Father's Legacy",
    "The Ink of Memory",
    "Chapters Unwritten",
    "Finding the Ending",
    "Paper and Silence",
    "The Last Storyteller",
    "Beyond the Final Page",
    "Echoes in the Margins"
  ]

  return mockTitles
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if novel exists
    const novel = await db.novel.findUnique({
      where: { id: params.id }
    })

    if (!novel) {
      return NextResponse.json(
        { error: 'Novel not found' },
        { status: 404 }
      )
    }

    // Generate titles using AI
    const titles = await generateTitles(novel)

    return NextResponse.json({ titles })
  } catch (error) {
    console.error('Failed to generate titles:', error)
    return NextResponse.json(
      { error: 'Failed to generate titles' },
      { status: 500 }
    )
  }
}
