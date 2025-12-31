import { db } from '@/lib/db'

export interface VersionSnapshot {
  id: string
  chapterId: string
  content: string
  wordCount: number
  versionLabel: string | null
  isSnapshot: boolean
  createdAt: Date
}

class VersionControlService {
  /**
   * Auto-save chapter content
   */
  async autoSaveChapter(chapterId: string, content: string): Promise<void> {
    try {
      const wordCount = this.countWords(content)

      await db.chapter.update({
        where: { id: chapterId },
        data: {
          content,
          wordCount,
          updatedAt: new Date()
        }
      })
    } catch (error) {
      console.error('Failed to auto-save chapter:', error)
    }
  }

  /**
   * Create a manual version snapshot
   */
  async createSnapshot(chapterId: string, label?: string): Promise<VersionSnapshot | null> {
    try {
      const chapter = await db.chapter.findUnique({
        where: { id: chapterId }
      })

      if (!chapter || !chapter.content) {
        return null
      }

      const snapshot = await db.chapterVersion.create({
        data: {
          chapterId,
          content: chapter.content,
          wordCount: chapter.wordCount,
          versionLabel: label || `Snapshot - ${new Date().toLocaleString()}`,
          isSnapshot: true
        }
      })

      return snapshot
    } catch (error) {
      console.error('Failed to create snapshot:', error)
      return null
    }
  }

  /**
   * Get all versions of a chapter
   */
  async getChapterVersions(chapterId: string): Promise<VersionSnapshot[]> {
    try {
      const versions = await db.chapterVersion.findMany({
        where: { chapterId },
        orderBy: { createdAt: 'desc' }
      })

      return versions
    } catch (error) {
      console.error('Failed to get chapter versions:', error)
      return []
    }
  }

  /**
   * Restore a previous version
   */
  async restoreVersion(versionId: string): Promise<boolean> {
    try {
      const version = await db.chapterVersion.findUnique({
        where: { id: versionId }
      })

      if (!version) {
        return false
      }

      // Create a backup of current state before restoring
      await this.createSnapshot(version.chapterId, 'Backup before restore')

      // Restore the version
      await db.chapter.update({
        where: { id: version.chapterId },
        data: {
          content: version.content,
          wordCount: version.wordCount,
          updatedAt: new Date()
        }
      })

      return true
    } catch (error) {
      console.error('Failed to restore version:', error)
      return false
    }
  }

  /**
   * Compare two versions
   */
  async compareVersions(versionId1: string, versionId2: string): Promise<{
    version1: VersionSnapshot
    version2: VersionSnapshot
    wordCountDiff: number
  } | null> {
    try {
      const version1 = await db.chapterVersion.findUnique({
        where: { id: versionId1 }
      })

      const version2 = await db.chapterVersion.findUnique({
        where: { id: versionId2 }
      })

      if (!version1 || !version2) {
        return null
      }

      return {
        version1,
        version2,
        wordCountDiff: version2.wordCount - version1.wordCount
      }
    } catch (error) {
      console.error('Failed to compare versions:', error)
      return null
    }
  }

  /**
   * Create automatic version on significant changes
   */
  async trackVersionIfSignificant(chapterId: string, newContent: string, oldContent: string): Promise<boolean> {
    try {
      const oldWordCount = this.countWords(oldContent)
      const newWordCount = this.countWords(newContent)
      const wordDiff = Math.abs(newWordCount - oldWordCount)

      // Create a version if there's a significant change (e.g., 500+ words difference)
      if (wordDiff >= 500) {
        const chapter = await db.chapter.findUnique({
          where: { id: chapterId }
        })

        if (chapter) {
          await db.chapterVersion.create({
            data: {
              chapterId,
              content: oldContent,
              wordCount: oldWordCount,
              versionLabel: `Auto-version (${oldWordCount} words)`,
              isSnapshot: false
            }
          })
          return true
        }
      }

      return false
    } catch (error) {
      console.error('Failed to track version:', error)
      return false
    }
  }

  /**
   * Count words in text
   */
  private countWords(text: string): number {
    if (!text) return 0
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  /**
   * Get version statistics for a novel
   */
  async getNovelVersionStats(novelId: string): Promise<{
    totalVersions: number
    totalSnapshots: number
    chaptersWithVersions: number
  }> {
    try {
      const chapters = await db.chapter.findMany({
        where: { novelId },
        select: { id: true }
      })

      const chapterIds = chapters.map(c => c.id)

      const versions = await db.chapterVersion.findMany({
        where: { chapterId: { in: chapterIds } }
      })

      const snapshots = versions.filter(v => v.isSnapshot)
      const chaptersWithVersions = new Set(versions.map(v => v.chapterId)).size

      return {
        totalVersions: versions.length,
        totalSnapshots: snapshots.length,
        chaptersWithVersions
      }
    } catch (error) {
      console.error('Failed to get novel version stats:', error)
      return {
        totalVersions: 0,
        totalSnapshots: 0,
        chaptersWithVersions: 0
      }
    }
  }
}

export const versionControl = new VersionControlService()
