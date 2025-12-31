import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { storyMemoryEngine } from '@/lib/story-memory/engine'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const novel = await db.novel.findUnique({
      where: { id: params.id }
    })

    if (!novel) {
      return NextResponse.json(
        { error: 'Novel not found' },
        { status: 404 }
      )
    }

    const storyContext = await storyMemoryEngine.getStoryContext(params.id)
    const consistencyCheck = await storyMemoryEngine.checkConsistency(params.id)

    return NextResponse.json({
      storyContext,
      consistencyCheck
    })
  } catch (error) {
    console.error('Failed to fetch story memory:', error)
    return NextResponse.json(
      { error: 'Failed to fetch story memory' },
      { status: 500 }
    )
  }
}
