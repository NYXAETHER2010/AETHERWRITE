import { NextRequest, NextResponse } from 'next/server'
import { VersionControl } from '@/lib/version-control'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; chapterId: string } }
) {
  try {
    const versions = await VersionControl.getVersions(params.chapterId)
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
  { params }: { params: { id: string; chapterId: string } }
) {
  try {
    const body = await request.json()
    const { label } = body

    if (!label) {
      return NextResponse.json(
        { error: 'Label is required' },
        { status: 400 }
      )
    }

    await VersionControl.createSnapshot(params.chapterId, label)

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Failed to create snapshot:', error)
    return NextResponse.json(
      { error: 'Failed to create snapshot' },
      { status: 500 }
    )
  }
}
