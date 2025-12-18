import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const novel = await db.novel.findFirst({
      where: { 
        id: params.id,
        userId: user.id 
      },
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' }
        },
        _count: {
          select: { chapters: true }
        }
      }
    })

    if (!novel) {
      return NextResponse.json({ error: 'Novel not found' }, { status: 404 })
    }

    return NextResponse.json(novel)
  } catch (error) {
    console.error('Failed to fetch novel:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const novel = await db.novel.update({
      where: { 
        id: params.id,
        userId: user.id 
      },
      data: body
    })

    return NextResponse.json(novel)
  } catch (error) {
    console.error('Failed to update novel:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}