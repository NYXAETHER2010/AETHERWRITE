import { NextRequest, NextResponse } from 'next/server'
import { notificationService } from '@/lib/notifications'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    // For demo, use default user - in production, get userId from auth
    const userId = 'default-user-id'

    const notifications = await notificationService.getUserNotifications(userId, unreadOnly)

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clearRead = searchParams.get('clearRead') === 'true'

    // For demo, use default user - in production, get userId from auth
    const userId = 'default-user-id'

    if (clearRead) {
      await notificationService.clearReadNotifications(userId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Failed to clear notifications:', error)
    return NextResponse.json(
      { error: 'Failed to clear notifications' },
      { status: 500 }
    )
  }
}
