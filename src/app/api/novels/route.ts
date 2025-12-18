import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
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

    const novels = await db.novel.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { chapters: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(novels)
  } catch (error) {
    console.error('Failed to fetch novels:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
    
    const novel = await db.novel.create({
      data: {
        userId: user.id,
        ...body
      }
    })

    return NextResponse.json(novel)
  } catch (error) {
    console.error('Failed to create novel:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}