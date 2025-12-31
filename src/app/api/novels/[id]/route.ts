import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const novel = await db.novel.findUnique({
      where: {
        id: params.id
      },
      include: {
        chapters: {
          orderBy: {
            chapterNumber: 'asc'
          }
        },
        characters: true,
        storyMemories: true
      }
    })

    if (!novel) {
      return NextResponse.json(
        { error: 'Novel not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ novel })
  } catch (error) {
    console.error('Failed to fetch novel:', error)
    return NextResponse.json(
      { error: 'Failed to fetch novel' },
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

    const novel = await db.novel.update({
      where: {
        id: params.id
      },
      data: body
    })

    return NextResponse.json({ novel })
  } catch (error) {
    console.error('Failed to update novel:', error)
    return NextResponse.json(
      { error: 'Failed to update novel' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.novel.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete novel:', error)
    return NextResponse.json(
      { error: 'Failed to delete novel' },
      { status: 500 }
    )
  }
}
