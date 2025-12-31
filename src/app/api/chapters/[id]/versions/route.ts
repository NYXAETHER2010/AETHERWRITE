import { NextRequest, NextResponse } from 'next/server'
import { versionControl } from '@/lib/version-control'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const versions = await versionControl.getChapterVersions(params.id)
    return NextResponse.json({ versions })
  } catch (error) {
    console.error('Failed to fetch versions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch versions' },
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
    const { label } = body

    const snapshot = await versionControl.createSnapshot(params.id, label)

    if (!snapshot) {
      return NextResponse.json(
        { error: 'Failed to create snapshot' },
        { status: 400 }
      )
    }

    return NextResponse.json({ snapshot }, { status: 201 })
  } catch (error) {
    console.error('Failed to create snapshot:', error)
    return NextResponse.json(
      { error: 'Failed to create snapshot' },
      { status: 500 }
    )
  }
}
