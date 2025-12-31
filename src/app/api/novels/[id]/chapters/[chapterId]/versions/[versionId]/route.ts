import { NextRequest, NextResponse } from 'next/server'
import { VersionControl } from '@/lib/version-control'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; chapterId: string; versionId: string } }
) {
  try {
    await VersionControl.restoreVersion(params.chapterId, params.versionId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to restore version:', error)
    return NextResponse.json(
      { error: 'Failed to restore version' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; chapterId: string; versionId: string } }
) {
  try {
    await VersionControl.deleteVersion(params.versionId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete version:', error)
    return NextResponse.json(
      { error: 'Failed to delete version' },
      { status: 500 }
    )
  }
}
