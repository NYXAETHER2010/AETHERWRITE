import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const characters = await db.character.findMany({
      where: {
        novelId: params.id
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json({ characters })
  } catch (error) {
    console.error('Failed to fetch characters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
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
    const { name, role, age, physicalAppearance, personalityTraits, backstory, goals, fears, relationships } = body

    const character = await db.character.create({
      data: {
        novelId: params.id,
        name,
        role,
        age,
        physicalAppearance,
        personalityTraits,
        backstory,
        goals,
        fears,
        relationships
      }
    })

    return NextResponse.json({ character }, { status: 201 })
  } catch (error) {
    console.error('Failed to create character:', error)
    return NextResponse.json(
      { error: 'Failed to create character' },
      { status: 500 }
    )
  }
}
