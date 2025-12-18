import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { novelId, chapterNumber, chapterType, content } = body

    if (!novelId || !chapterNumber || !chapterType || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify the novel belongs to the user
    const novel = await db.novel.findFirst({
      where: { 
        id: novelId,
        userId: user.id 
      }
    })

    if (!novel) {
      return NextResponse.json({ error: 'Novel not found' }, { status: 404 })
    }

    // Create or update the chapter
    const chapter = await db.chapter.upsert({
      where: {
        novelId_chapterNumber: {
          novelId,
          chapterNumber
        }
      },
      update: {
        chapterType,
        content
      },
      create: {
        novelId,
        chapterNumber,
        chapterType,
        content
      }
    })

    // Update the novel's updatedAt timestamp
    await db.novel.update({
      where: { id: novelId },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json(chapter)
  } catch (error) {
    console.error('Failed to save chapter:', error)
    return NextResponse.json({ error: 'Failed to save chapter' }, { status: 500 })
  }
}