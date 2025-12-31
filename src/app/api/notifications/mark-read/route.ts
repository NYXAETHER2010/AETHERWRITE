import { NextRequest, NextResponse } from 'next/server'
import { notificationService } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    // For demo, use default user - in production, get userId from auth
    const userId = 'default-user-id'

    const success = await notificationService.markAllAsRead(userId)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to mark notifications as read' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to mark notifications as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    )
  }
}
