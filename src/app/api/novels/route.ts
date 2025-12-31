import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // For now, return novels for a default user
    // In production, you'd get userId from authentication
    const novels = await db.novel.findMany({
      where: {
        userId: 'default-user-id'
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json({ novels })
  } catch (error) {
    console.error('Failed to fetch novels:', error)
    return NextResponse.json(
      { error: 'Failed to fetch novels' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Create a default user if needed
    let userId = 'default-user-id'
    const existingUser = await db.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      await db.user.create({
        data: {
          id: userId,
          email: 'demo@novelforge.com',
          name: 'Demo User'
        }
      })
    }

    const novel = await db.novel.create({
      data: {
        userId,
        title,
        description,
        status: 'idea'
      }
    })

    return NextResponse.json({ novel }, { status: 201 })
  } catch (error) {
    console.error('Failed to create novel:', error)
    return NextResponse.json(
      { error: 'Failed to create novel' },
      { status: 500 }
    )
  }
}
