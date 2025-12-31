import { db } from '@/lib/db'
import type { Novel, Chapter } from '@prisma/client'

export class NovelExport {
  /**
   * Export novel as formatted markdown
   */
  static async exportMarkdown(novelId: string): Promise<string> {
    const novel = await db.novel.findUnique({
      where: { id: novelId },
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' }
        }
      }
    })

    if (!novel) {
      throw new Error('Novel not found')
    }

    let markdown = `# ${novel.currentTitle || novel.title}\n\n`

    if (novel.description) {
      markdown += `*${novel.description}*\n\n`
    }

    if (novel.genre) {
      markdown += `**Genre:** ${novel.genre}\n\n`
    }

    if (novel.themes) {
      markdown += `**Themes:** ${novel.themes}\n\n`
    }

    markdown += `---\n\n`

    for (const chapter of novel.chapters) {
      if (chapter.title) {
        markdown += `## Chapter ${chapter.chapterNumber}: ${chapter.title}\n\n`
      } else {
        markdown += `## Chapter ${chapter.chapterNumber}\n\n`
      }

      if (chapter.content) {
        markdown += `${chapter.content}\n\n`
      }

      markdown += `---\n\n`
    }

    return markdown
  }

  /**
   * Export novel as plain text
   */
  static async exportText(novelId: string): Promise<string> {
    const markdown = await this.exportMarkdown(novelId)

    // Remove markdown formatting for plain text
    let text = markdown
      .replace(/^#{1,2}\s/gm, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/---\n/g, '\n') // Remove separators
      .replace(/\n{3,}/g, '\n\n') // Reduce multiple newlines

    return text
  }

  /**
   * Prepare novel data for DOCX export
   */
  static async prepareDocxData(novelId: string): Promise<{
    title: string
    author?: string
    description?: string
    chapters: Array<{
      number: number
      title?: string
      content: string
    }>
  }> {
    const novel = await db.novel.findUnique({
      where: { id: novelId },
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' },
          where: {
            content: {
              not: null
            }
          }
        }
      }
    })

    if (!novel) {
      throw new Error('Novel not found')
    }

    return {
      title: novel.currentTitle || novel.title,
      chapters: novel.chapters.map(chapter => ({
        number: chapter.chapterNumber,
        title: chapter.title || undefined,
        content: chapter.content || ''
      }))
    }
  }

  /**
   * Generate filename for export
   */
  static generateFilename(novel: Novel, format: 'pdf' | 'docx' | 'txt' | 'md'): string {
    const title = (novel.currentTitle || novel.title)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)

    return `${title}.${format}`
  }

  /**
   * Get export statistics
   */
  static async getExportStats(novelId: string): Promise<{
    wordCount: number
    chapterCount: number
    estimatedPages: number
    estimatedReadingTime: number
  }> {
    const novel = await db.novel.findUnique({
      where: { id: novelId },
      include: {
        chapters: true
      }
    })

    if (!novel) {
      throw new Error('Novel not found')
    }

    const wordsPerMinute = 200
    const wordsPerPage = 300

    return {
      wordCount: novel.totalWords,
      chapterCount: novel.chapterCount,
      estimatedPages: Math.ceil(novel.totalWords / wordsPerPage),
      estimatedReadingTime: Math.ceil(novel.totalWords / wordsPerMinute)
    }
  }
}
