import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { VersionControl } from '@/lib/version-control'
import { StoryMemoryEngine } from '@/lib/story-memory'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; chapterId: string } }
) {
  try {
    const chapter = await db.chapter.findUnique({
      where: { id: params.chapterId },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    })

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ chapter })
  } catch (error) {
    console.error('Failed to fetch chapter:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chapter' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; chapterId: string } }
) {
  try {
    const body = await request.json()
    const { content, title, summary, objectives, status } = body

    // Auto-save with version control
    if (content) {
      await VersionControl.autoSave(params.chapterId, content)

      // Update story memory
      await StoryMemoryEngine.extractAndUpdateStoryMemory(params.id, params.chapterId, content)
    }

    const chapter = await db.chapter.update({
      where: { id: params.chapterId },
      data: {
        title,
        summary,
        objectives,
        status,
        updatedAt: new Date()
      }
    })

    // Update novel word count
    const allChapters = await db.chapter.findMany({
      where: { novelId: params.id }
    })
    const totalWords = allChapters.reduce((sum, ch) => sum + ch.wordCount, 0)

    await db.novel.update({
      where: { id: params.id },
      data: { totalWords }
    })

    return NextResponse.json({ chapter })
  } catch (error) {
    console.error('Failed to update chapter:', error)
    return NextResponse.json(
      { error: 'Failed to update chapter' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; chapterId: string } }
) {
  try {
    const chapter = await db.chapter.findUnique({
      where: { id: params.chapterId }
    })

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    await db.chapter.delete({
      where: { id: params.chapterId }
    })

    // Update novel chapter count
    const novel = await db.novel.findUnique({
      where: { id: params.id }
    })

    if (novel) {
      await db.novel.update({
        where: { id: params.id },
        data: {
          chapterCount: Math.max(0, novel.chapterCount - 1)
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete chapter:', error)
    return NextResponse.json(
      { error: 'Failed to delete chapter' },
      { status: 500 }
    )
  }
}
