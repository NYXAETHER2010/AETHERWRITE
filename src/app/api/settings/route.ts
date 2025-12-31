import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // For now, use default user
    const userId = 'default-user-id'

    let settings = await db.userSettings.findUnique({
      where: { userId }
    })

    if (!settings) {
      settings = await db.userSettings.create({
        data: {
          userId,
          theme: 'light',
          defaultLanguage: 'en',
          autoSave: true,
          emailNotifications: true
        }
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { theme, defaultLanguage, autoSave, emailNotifications } = body

    // For now, use default user
    const userId = 'default-user-id'

    const settings = await db.userSettings.upsert({
      where: { userId },
      update: {
        theme,
        defaultLanguage,
        autoSave,
        emailNotifications
      },
      create: {
        userId,
        theme,
        defaultLanguage,
        autoSave,
        emailNotifications
      }
    })

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Failed to update settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
