import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { VersionControl } from '@/lib/version-control'
import { StoryMemoryEngine } from '@/lib/story-memory'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chapters = await db.chapter.findMany({
      where: {
        novelId: params.id
      },
      orderBy: {
        chapterNumber: 'asc'
      }
    })

    return NextResponse.json({ chapters })
  } catch (error) {
    console.error('Failed to fetch chapters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chapters' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { chapterNumber, title, summary, objectives } = body

    // Get novel to check current chapter count
    const novel = await db.novel.findUnique({
      where: { id: params.id }
    })

    if (!novel) {
      return NextResponse.json(
        { error: 'Novel not found' },
        { status: 404 }
      )
    }

    const chapter = await db.chapter.create({
      data: {
        novelId: params.id,
        chapterNumber: chapterNumber || novel.chapterCount + 1,
        title,
        summary,
        objectives,
        status: 'pending'
      }
    })

    // Update novel chapter count
    await db.novel.update({
      where: { id: params.id },
      data: {
        chapterCount: novel.chapterCount + 1
      }
    })

    return NextResponse.json({ chapter }, { status: 201 })
  } catch (error) {
    console.error('Failed to create chapter:', error)
    return NextResponse.json(
      { error: 'Failed to create chapter' },
      { status: 500 }
    )
  }
}
