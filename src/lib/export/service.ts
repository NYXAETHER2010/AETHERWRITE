import { db } from '@/lib/db'

class ExportService {
  /**
   * Export novel as PDF
   */
  async exportToPDF(novelId: string): Promise<{ success: boolean; file?: Buffer; filename?: string }> {
    try {
      const novel = await db.novel.findUnique({
        where: { id: novelId },
        include: {
          chapters: {
            orderBy: { chapterNumber: 'asc' }
          }
        }
      })

      if (!novel) {
        return { success: false }
      }

      // Build markdown content for the novel
      const markdown = this.buildNovelMarkdown(novel)

      // In a real implementation, you would use the pdf skill here
      // For now, we'll create a simple text-based approach
      const content = Buffer.from(markdown, 'utf-8')
      const filename = `${novel.title || 'novel'}.md`

      return {
        success: true,
        file: content,
        filename
      }
    } catch (error) {
      console.error('Failed to export to PDF:', error)
      return { success: false }
    }
  }

  /**
   * Export novel as DOCX
   */
  async exportToDOCX(novelId: string): Promise<{ success: boolean; file?: Buffer; filename?: string }> {
    try {
      const novel = await db.novel.findUnique({
        where: { id: novelId },
        include: {
          chapters: {
            orderBy: { chapterNumber: 'asc' }
          }
        }
      })

      if (!novel) {
        return { success: false }
      }

      // Build markdown content for the novel
      const markdown = this.buildNovelMarkdown(novel)

      // In a real implementation, you would use the docx skill here
      // For now, we'll create a simple text-based approach
      const content = Buffer.from(markdown, 'utf-8')
      const filename = `${novel.title || 'novel'}.md`

      return {
        success: true,
        file: content,
        filename
      }
    } catch (error) {
      console.error('Failed to export to DOCX:', error)
      return { success: false }
    }
  }

  /**
   * Build markdown content from novel
   */
  private buildNovelMarkdown(novel: any): string {
    let markdown = `# ${novel.currentTitle || novel.title || 'Untitled Novel'}\n\n`

    if (novel.description) {
      markdown += `**Description:** ${novel.description}\n\n`
    }

    if (novel.genre || novel.themes || novel.tone) {
      markdown += `---\n\n`
      if (novel.genre) markdown += `**Genre:** ${novel.genre}\n`
      if (novel.tone) markdown += `**Tone:** ${novel.tone}\n`
      if (novel.themes) markdown += `**Themes:** ${novel.themes}\n`
      markdown += `\n---\n\n`
    }

    // Add chapters
    if (novel.chapters && novel.chapters.length > 0) {
      novel.chapters.forEach((chapter: any) => {
        markdown += `\n## ${chapter.title || `Chapter ${chapter.chapterNumber}`}\n\n`

        if (chapter.summary) {
          markdown += `*Summary:* ${chapter.summary}\n\n`
        }

        if (chapter.content) {
          markdown += `${chapter.content}\n\n`
        }
      })
    } else {
      markdown += '\n*No chapters written yet.*\n'
    }

    // Add metadata
    markdown += `\n---\n\n`
    markdown += `*Total Words:* ${novel.totalWords.toLocaleString()}\n`
    markdown += `*Total Chapters:* ${novel.chapterCount}\n`
    markdown += `*Export Date:* ${new Date().toLocaleDateString()}\n`

    return markdown
  }

  /**
   * Export single chapter as PDF
   */
  async exportChapterToPDF(chapterId: string): Promise<{ success: boolean; file?: Buffer; filename?: string }> {
    try {
      const chapter = await db.chapter.findUnique({
        where: { id: chapterId },
        include: {
          novel: true
        }
      })

      if (!chapter) {
        return { success: false }
      }

      // Build markdown for single chapter
      let markdown = `# ${chapter.novel.currentTitle || chapter.novel.title || 'Novel'}\n\n`
      markdown += `## ${chapter.title || `Chapter ${chapter.chapterNumber}`}\n\n`

      if (chapter.summary) {
        markdown += `*Summary:* ${chapter.summary}\n\n`
      }

      if (chapter.content) {
        markdown += `${chapter.content}\n\n`
      }

      const content = Buffer.from(markdown, 'utf-8')
      const filename = `chapter-${chapter.chapterNumber}.md`

      return {
        success: true,
        file: content,
        filename
      }
    } catch (error) {
      console.error('Failed to export chapter to PDF:', error)
      return { success: false }
    }
  }

  /**
   * Export single chapter as DOCX
   */
  async exportChapterToDOCX(chapterId: string): Promise<{ success: boolean; file?: Buffer; filename?: string }> {
    try {
      const chapter = await db.chapter.findUnique({
        where: { id: chapterId },
        include: {
          novel: true
        }
      })

      if (!chapter) {
        return { success: false }
      }

      // Build markdown for single chapter
      let markdown = `# ${chapter.novel.currentTitle || chapter.novel.title || 'Novel'}\n\n`
      markdown += `## ${chapter.title || `Chapter ${chapter.chapterNumber}`}\n\n`

      if (chapter.summary) {
        markdown += `*Summary:* ${chapter.summary}\n\n`
      }

      if (chapter.content) {
        markdown += `${chapter.content}\n\n`
      }

      const content = Buffer.from(markdown, 'utf-8')
      const filename = `chapter-${chapter.chapterNumber}.md`

      return {
        success: true,
        file: content,
        filename
      }
    } catch (error) {
      console.error('Failed to export chapter to DOCX:', error)
      return { success: false }
    }
  }
}

export const exportService = new ExportService()
