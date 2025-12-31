import { db } from '@/lib/db'

export type NotificationType = 'generation_complete' | 'milestone' | 'system_update' | 'chapter_completed' | 'version_created'

export interface CreateNotificationInput {
  userId: string
  novelId?: string
  type: NotificationType
  title: string
  message: string
}

class NotificationService {
  /**
   * Create a new notification
   */
  async create(input: CreateNotificationInput): Promise<boolean> {
    try {
      await db.notification.create({
        data: {
          userId: input.userId,
          novelId: input.novelId,
          type: input.type,
          title: input.title,
          message: input.message
        }
      })

      return true
    } catch (error) {
      console.error('Failed to create notification:', error)
      return false
    }
  }

  /**
   * Get all notifications for a user
   */
  async getUserNotifications(userId: string, unreadOnly = false): Promise<any[]> {
    try {
      const notifications = await db.notification.findMany({
        where: {
          userId,
          ...(unreadOnly && { read: false })
        },
        orderBy: { createdAt: 'desc' },
        include: {
          novel: {
            select: {
              id: true,
              title: true,
              currentTitle: true
            }
          }
        }
      })

      return notifications
    } catch (error) {
      console.error('Failed to get notifications:', error)
      return []
    }
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const count = await db.notification.count({
        where: {
          userId,
          read: false
        }
      })

      return count
    } catch (error) {
      console.error('Failed to get unread count:', error)
      return 0
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await db.notification.update({
        where: { id: notificationId },
        data: { read: true }
      })

      return true
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      return false
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      await db.notification.updateMany({
        where: {
          userId,
          read: false
        },
        data: { read: true }
      })

      return true
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      return false
    }
  }

  /**
   * Delete a notification
   */
  async delete(notificationId: string): Promise<boolean> {
    try {
      await db.notification.delete({
        where: { id: notificationId }
      })

      return true
    } catch (error) {
      console.error('Failed to delete notification:', error)
      return false
    }
  }

  /**
   * Clear all read notifications for a user
   */
  async clearReadNotifications(userId: string): Promise<boolean> {
    try {
      await db.notification.deleteMany({
        where: {
          userId,
          read: true
        }
      })

      return true
    } catch (error) {
      console.error('Failed to clear notifications:', error)
      return false
    }
  }

  /**
   * Predefined notification templates
   */
  notify = {
    ideaDeveloped: (userId: string, novelId: string, novelTitle: string) =>
      this.create({
        userId,
        novelId,
        type: 'generation_complete',
        title: 'Idea Development Complete',
        message: `Your novel "${novelTitle}" has been developed with genre, themes, and central conflict.`
      }),

    titlesGenerated: (userId: string, novelId: string, novelTitle: string) =>
      this.create({
        userId,
        novelId,
        type: 'generation_complete',
        title: 'Titles Generated',
        message: `10 title options have been generated for "${novelTitle}". Review and select your favorite!`
      }),

    outlineGenerated: (userId: string, novelId: string, novelTitle: string, chapterCount: number) =>
      this.create({
        userId,
        novelId,
        type: 'generation_complete',
        title: 'Outline Generated',
        message: `A complete ${chapterCount}-chapter outline has been created for "${novelTitle}". You're ready to start writing!`
      }),

    chapterCompleted: (userId: string, novelId: string, novelTitle: string, chapterNumber: number, wordCount: number) =>
      this.create({
        userId,
        novelId,
        type: 'chapter_completed',
        title: `Chapter ${chapterNumber} Completed`,
        message: `Congratulations! You've completed Chapter ${chapterNumber} of "${novelTitle}" with ${wordCount} words.`
      }),

    milestoneReached: (userId: string, novelId: string, novelTitle: string, milestone: string) =>
      this.create({
        userId,
        novelId,
        type: 'milestone',
        title: 'Milestone Reached!',
        message: `Great job! You've reached a milestone: ${milestone} in "${novelTitle}".`
      }),

    novelCompleted: (userId: string, novelId: string, novelTitle: string, totalWords: number, totalChapters: number) =>
      this.create({
        userId,
        novelId,
        type: 'milestone',
        title: '🎉 Novel Completed!',
        message: `Congratulations! "${novelTitle}" is complete with ${totalWords.toLocaleString()} words across ${totalChapters} chapters. Time to export!`
      }),

    versionCreated: (userId: string, novelId: string, novelTitle: string) =>
      this.create({
        userId,
        novelId,
        type: 'version_created',
        title: 'Version Snapshot Created',
        message: `A version snapshot has been created for "${novelTitle}". Your work is safely saved.`
      }),

    consistencyWarning: (userId: string, novelId: string, novelTitle: string, issueCount: number) =>
      this.create({
        userId,
        novelId,
        type: 'system_update',
        title: 'Consistency Check',
        message: `${issueCount} potential consistency issues found in "${novelTitle}". Review your story memory.`
      })
  }
}

export const notificationService = new NotificationService()
