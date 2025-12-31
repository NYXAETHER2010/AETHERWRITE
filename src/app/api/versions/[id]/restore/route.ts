import { NextRequest, NextResponse } from 'next/server'
import { versionControl } from '@/lib/version-control'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await versionControl.restoreVersion(params.id)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to restore version' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to restore version:', error)
    return NextResponse.json(
      { error: 'Failed to restore version' },
      { status: 500 }
    )
  }
}
