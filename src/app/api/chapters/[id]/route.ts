import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { versionControl } from '@/lib/version-control'
import { storyMemoryEngine } from '@/lib/story-memory/engine'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chapter = await db.chapter.findUnique({
      where: { id: params.id },
      include: {
        versions: {
          orderBy: { createdAt: 'desc' }
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { content, title, summary, objectives } = body

    const chapter = await db.chapter.findUnique({
      where: { id: params.id }
    })

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    // Track version if significant change
    if (content && chapter.content) {
      await versionControl.trackVersionIfSignificant(params.id, content, chapter.content)
    }

    // Update chapter with auto-save
    const wordCount = content ? content.trim().split(/\s+/).filter(word => word.length > 0).length : 0

    const updatedChapter = await db.chapter.update({
      where: { id: params.id },
      data: {
        ...(content !== undefined && { content, wordCount }),
        ...(title !== undefined && { title }),
        ...(summary !== undefined && { summary }),
        ...(objectives !== undefined && { objectives }),
        updatedAt: new Date()
      }
    })

    // Extract and store story memory if content was updated
    if (content && chapter.novelId) {
      const novel = await db.novel.findUnique({
        where: { id: chapter.novelId },
        include: { chapters: true }
      })

      if (novel) {
        const chapterNumber = chapter.chapterNumber
        await storyMemoryEngine.extractAndStoreMemory(chapter.novelId, params.id, content, chapterNumber)
      }
    }

    return NextResponse.json({ chapter: updatedChapter })
  } catch (error) {
    console.error('Failed to update chapter:', error)
    return NextResponse.json(
      { error: 'Failed to update chapter' },
      { status: 500 }
    )
  }
}
