import { db } from '@/lib/db'
import type { Novel, Chapter, Character, StoryMemory } from '@prisma/client'

export interface StoryContext {
  characters: Character[]
  plotPoints: StoryMemory[]
  relationships: StoryMemory[]
  timeline: StoryMemory[]
  settings: StoryMemory[]
  characterArcs: StoryMemory[]
}

export interface ConsistencyCheck {
  type: 'character' | 'plot' | 'setting' | 'timeline'
  issue: string
  suggestion: string
  severity: 'low' | 'medium' | 'high'
}

export class StoryMemoryEngine {
  /**
   * Extract story elements from a chapter and update memory
   */
  static async extractAndUpdateStoryMemory(
    novelId: string,
    chapterId: string,
    chapterContent: string
  ): Promise<void> {
    // Extract plot points
    const plotPoints = await this.extractPlotPoints(chapterContent)
    for (const point of plotPoints) {
      await db.storyMemory.create({
        data: {
          novelId,
          type: 'plot_point',
          description: point,
          chapterContext: chapterId,
          importance: 'normal'
        }
      })
    }

    // Extract timeline events
    const timelineEvents = await this.extractTimelineEvents(chapterContent)
    for (const event of timelineEvents) {
      await db.storyMemory.create({
        data: {
          novelId,
          type: 'timeline',
          description: event,
          chapterContext: chapterId,
          importance: 'normal'
        }
      })
    }

    // Extract setting information
    const settings = await this.extractSettings(chapterContent)
    for (const setting of settings) {
      await db.storyMemory.create({
        data: {
          novelId,
          type: 'setting',
          description: setting,
          chapterContext: chapterId,
          importance: 'low'
        }
      })
    }
  }

  /**
   * Get complete story context for AI generation
   */
  static async getStoryContext(novelId: string): Promise<StoryContext> {
    const characters = await db.character.findMany({
      where: { novelId }
    })

    const storyMemories = await db.storyMemory.findMany({
      where: { novelId },
      orderBy: { createdAt: 'asc' }
    })

    return {
      characters,
      plotPoints: storyMemories.filter(m => m.type === 'plot_point'),
      relationships: storyMemories.filter(m => m.type === 'relationship'),
      timeline: storyMemories.filter(m => m.type === 'timeline'),
      settings: storyMemories.filter(m => m.type === 'setting'),
      characterArcs: storyMemories.filter(m => m.type === 'character_arc')
    }
  }

  /**
   * Generate context string for AI prompts
   */
  static generateContextPrompt(context: StoryContext, novel: any, previousChapters: Chapter[]): string {
    let prompt = `STORY CONTEXT FOR GENERATION\n\n`

    // Novel foundation
    prompt += `NOVEL TITLE: ${novel.currentTitle || novel.title}\n`
    prompt += `GENRE: ${novel.genre || 'Not specified'}\n`
    prompt += `THEMES: ${novel.themes || 'Not specified'}\n`
    prompt += `TONE: ${novel.tone || 'Not specified'}\n`
    prompt += `CENTRAL CONFLICT: ${novel.centralConflict || 'Not specified'}\n\n`

    // Characters
    if (context.characters.length > 0) {
      prompt += `CHARACTERS:\n`
      context.characters.forEach(char => {
        prompt += `- ${char.name} (${char.role})\n`
        if (char.personalityTraits) prompt += `  Personality: ${char.personalityTraits}\n`
        if (char.backstory) prompt += `  Backstory: ${char.backstory}\n`
        if (char.goals) prompt += `  Goals: ${char.goals}\n`
        if (char.relationships) prompt += `  Relationships: ${char.relationships}\n`
      })
      prompt += '\n'
    }

    // Plot points
    if (context.plotPoints.length > 0) {
      prompt += `IMPORTANT PLOT POINTS:\n`
      context.plotPoints.slice(-10).forEach(point => {
        prompt += `- ${point.description}\n`
      })
      prompt += '\n'
    }

    // Timeline
    if (context.timeline.length > 0) {
      prompt += `TIMELINE OF EVENTS:\n`
      context.timeline.forEach(event => {
        prompt += `- ${event.description}\n`
      })
      prompt += '\n'
    }

    // Settings
    if (context.settings.length > 0) {
      prompt += `KEY SETTINGS:\n`
      const uniqueSettings = [...new Set(context.settings.map(s => s.description))]
      uniqueSettings.slice(-5).forEach(setting => {
        prompt += `- ${setting}\n`
      })
      prompt += '\n'
    }

    // Previous chapters summaries
    if (previousChapters.length > 0) {
      prompt += `PREVIOUS CHAPTERS CONTEXT:\n`
      previousChapters.forEach(chapter => {
        prompt += `Chapter ${chapter.chapterNumber}: ${chapter.title || 'Untitled'}\n`
        if (chapter.summary) {
          prompt += `  Summary: ${chapter.summary}\n`
        }
        if (chapter.objectives) {
          prompt += `  Objectives: ${chapter.objectives}\n`
        }
      })
      prompt += '\n'
    }

    prompt += `END OF CONTEXT. Maintain consistency with all information above.\n`

    return prompt
  }

  /**
   * Check for consistency issues
   */
  static async checkConsistency(novelId: string, chapterContent: string): Promise<ConsistencyCheck[]> {
    const issues: ConsistencyCheck[] = []
    const context = await this.getStoryContext(novelId)

    // Check for character consistency
    for (const character of context.characters) {
      if (chapterContent.toLowerCase().includes(character.name.toLowerCase())) {
        // Check if traits are being violated
        if (character.personalityTraits) {
          // In production, you'd use AI to analyze this
          // For now, we'll do basic pattern matching
        }
      }
    }

    return issues
  }

  /**
   * Extract plot points from chapter content
   */
  private static async extractPlotPoints(content: string): Promise<string[]> {
    // In production, use LLM to extract plot points
    // For now, return empty array
    return []
  }

  /**
   * Extract timeline events from chapter content
   */
  private static async extractTimelineEvents(content: string): Promise<string[]> {
    // In production, use LLM to extract timeline events
    // For now, return empty array
    return []
  }

  /**
   * Extract settings from chapter content
   */
  private static async extractSettings(content: string): Promise<string[]> {
    // In production, use LLM to extract settings
    // For now, return empty array
    return []
  }

  /**
   * Update character arc information
   */
  static async updateCharacterArc(
    novelId: string,
    characterName: string,
    arcDescription: string
  ): Promise<void> {
    await db.storyMemory.create({
      data: {
        novelId,
        type: 'character_arc',
        description: `${characterName}: ${arcDescription}`,
        importance: 'high'
      }
    })
  }

  /**
   * Track relationship changes
   */
  static async trackRelationship(
    novelId: string,
    description: string
  ): Promise<void> {
    await db.storyMemory.create({
      data: {
        novelId,
        type: 'relationship',
        description,
        importance: 'high'
      }
    })
  }
}
