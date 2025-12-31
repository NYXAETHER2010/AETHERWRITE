import { db } from '@/lib/db'

export interface StoryMemoryEntry {
  id: string
  novelId: string
  type: 'plot_point' | 'relationship' | 'character_arc' | 'setting' | 'timeline'
  description: string
  chapterContext?: string
  importance: 'low' | 'normal' | 'high'
  createdAt: Date
  updatedAt: Date
}

export interface StoryContext {
  characters: any[]
  plotPoints: StoryMemoryEntry[]
  relationships: StoryMemoryEntry[]
  characterArcs: StoryMemoryEntry[]
  settings: StoryMemoryEntry[]
  timeline: StoryMemoryEntry[]
}

class StoryMemoryEngine {
  /**
   * Extract and store story memory from chapter content
   */
  async extractAndStoreMemory(novelId: string, chapterId: string, chapterContent: string, chapterNumber: number): Promise<void> {
    try {
      // Extract key story elements (simplified - in production, use AI/LLM)
      const extracted = await this.analyzeChapterContent(chapterContent, chapterNumber)

      // Store plot points
      for (const plotPoint of extracted.plotPoints) {
        await db.storyMemory.create({
          data: {
            novelId,
            type: 'plot_point',
            description: plotPoint,
            chapterContext: `Chapter ${chapterNumber}`,
            importance: 'high'
          }
        })
      }

      // Store relationships
      for (const relationship of extracted.relationships) {
        await db.storyMemory.create({
          data: {
            novelId,
            type: 'relationship',
            description: relationship,
            chapterContext: `Chapter ${chapterNumber}`,
            importance: 'normal'
          }
        })
      }

      // Store character arcs
      for (const arc of extracted.characterArcs) {
        await db.storyMemory.create({
          data: {
            novelId,
            type: 'character_arc',
            description: arc,
            chapterContext: `Chapter ${chapterNumber}`,
            importance: 'high'
          }
        })
      }

      // Store settings
      for (const setting of extracted.settings) {
        await db.storyMemory.create({
          data: {
            novelId,
            type: 'setting',
            description: setting,
            chapterContext: `Chapter ${chapterNumber}`,
            importance: 'low'
          }
        })
      }

      // Store timeline events
      for (const event of extracted.timelineEvents) {
        await db.storyMemory.create({
          data: {
            novelId,
            type: 'timeline',
            description: event,
            chapterContext: `Chapter ${chapterNumber}`,
            importance: 'normal'
          }
        })
      }
    } catch (error) {
      console.error('Failed to extract and store story memory:', error)
    }
  }

  /**
   * Analyze chapter content to extract story elements
   * In production, this would use an LLM to analyze the content
   */
  private async analyzeChapterContent(content: string, chapterNumber: number): Promise<{
    plotPoints: string[]
    relationships: string[]
    characterArcs: string[]
    settings: string[]
    timelineEvents: string[]
  }> {
    // Simplified extraction - in production, use AI/LLM
    // This is a placeholder for demonstration

    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)

    const plotPoints: string[] = []
    const relationships: string[] = []
    const characterArcs: string[] = []
    const settings: string[] = []
    const timelineEvents: string[] = []

    // Extract sample elements (very basic pattern matching)
    for (const sentence of sentences) {
      const lower = sentence.toLowerCase()

      // Plot points often contain action words
      if (lower.includes('discovered') || lower.includes('realized') || lower.includes('decided') ||
          lower.includes('learned') || lower.includes('found') || lower.includes('revealed')) {
        if (plotPoints.length < 3) {
          plotPoints.push(sentence.trim())
        }
      }

      // Relationships mention interactions between characters
      if (lower.includes('said to') || lower.includes('told') || lower.includes('spoke') ||
          lower.includes('relationship') || lower.includes('together') || lower.includes('with')) {
        if (relationships.length < 3) {
          relationships.push(sentence.trim())
        }
      }

      // Character development often mentions feelings, changes
      if (lower.includes('felt') || lower.includes('changed') || lower.includes('became') ||
          lower.includes('understood') || lower.includes('realized about herself')) {
        if (characterArcs.length < 3) {
          characterArcs.push(sentence.trim())
        }
      }

      // Settings describe locations
      if (lower.includes('room') || lower.includes('house') || lower.includes('street') ||
          lower.includes('office') || lower.includes('library') || lower.includes('walked through')) {
        if (settings.length < 3) {
          settings.push(sentence.trim())
        }
      }

      // Timeline events often mention time
      if (lower.includes('later') || lower.includes('that night') || lower.includes('next day') ||
          lower.includes('morning') || lower.includes('after') || lower.includes('when')) {
        if (timelineEvents.length < 3) {
          timelineEvents.push(sentence.trim())
        }
      }
    }

    return {
      plotPoints,
      relationships,
      characterArcs,
      settings,
      timelineEvents
    }
  }

  /**
   * Get complete story context for a novel
   */
  async getStoryContext(novelId: string): Promise<StoryContext> {
    try {
      const memories = await db.storyMemory.findMany({
        where: { novelId },
        orderBy: { createdAt: 'asc' }
      })

      return {
        characters: await db.character.findMany({ where: { novelId } }),
        plotPoints: memories.filter(m => m.type === 'plot_point'),
        relationships: memories.filter(m => m.type === 'relationship'),
        characterArcs: memories.filter(m => m.type === 'character_arc'),
        settings: memories.filter(m => m.type === 'setting'),
        timeline: memories.filter(m => m.type === 'timeline')
      }
    } catch (error) {
      console.error('Failed to get story context:', error)
      return {
        characters: [],
        plotPoints: [],
        relationships: [],
        characterArcs: [],
        settings: [],
        timeline: []
      }
    }
  }

  /**
   * Get context for chapter generation
   */
  async getChapterGenerationContext(novelId: string, currentChapterNumber: number): Promise<{
    previousChapters: string[]
    characters: any[]
    storyMemory: StoryContext
    novelFoundation: {
      genre: string | null
      tone: string | null
      themes: string | null
      centralConflict: string | null
      directionalEnding: string | null
    }
  }> {
    try {
      const novel = await db.novel.findUnique({
        where: { id: novelId },
        select: {
          genre: true,
          tone: true,
          themes: true,
          centralConflict: true,
          directionalEnding: true
        }
      })

      const previousChapters = await db.chapter.findMany({
        where: {
          novelId,
          chapterNumber: { lt: currentChapterNumber }
        },
        orderBy: { chapterNumber: 'asc' },
        select: {
          summary: true,
          objectives: true
        }
      })

      const characters = await db.character.findMany({
        where: { novelId }
      })

      const storyMemory = await this.getStoryContext(novelId)

      return {
        previousChapters: previousChapters.map(c => c.summary || c.objectives || ''),
        characters,
        storyMemory,
        novelFoundation: {
          genre: novel?.genre || null,
          tone: novel?.tone || null,
          themes: novel?.themes || null,
          centralConflict: novel?.centralConflict || null,
          directionalEnding: novel?.directionalEnding || null
        }
      }
    } catch (error) {
      console.error('Failed to get chapter generation context:', error)
      return {
        previousChapters: [],
        characters: [],
        storyMemory: {
          characters: [],
          plotPoints: [],
          relationships: [],
          characterArcs: [],
          settings: [],
          timeline: []
        },
        novelFoundation: {
          genre: null,
          tone: null,
          themes: null,
          centralConflict: null,
          directionalEnding: null
        }
      }
    }
  }

  /**
   * Check for consistency issues
   */
  async checkConsistency(novelId: string): Promise<{
    issues: Array<{ type: string, description: string }>
  }> {
    const issues: Array<{ type: string, description: string }> = []

    try {
      const memories = await db.storyMemory.findMany({
        where: { novelId },
        orderBy: { createdAt: 'asc' }
      })

      // Check for contradictions in relationships
      const relationshipDescriptions = memories
        .filter(m => m.type === 'relationship')
        .map(m => m.description.toLowerCase())

      // This is a simplified check - in production, use AI for more sophisticated analysis
      const contradictoryPairs: string[][] = []
      relationshipDescriptions.forEach(desc1 => {
        relationshipDescriptions.forEach(desc2 => {
          if ((desc1.includes('hated') && desc2.includes('loved')) ||
              (desc1.includes('enemies') && desc2.includes('friends'))) {
            contradictoryPairs.push([desc1, desc2])
          }
        })
      })

      if (contradictoryPairs.length > 0) {
        issues.push({
          type: 'relationship_contradiction',
          description: `Found ${contradictoryPairs.length} potential relationship contradictions. Review: ${contradictoryPairs[0].join(' vs ')}`
        })
      }

      // Check for character consistency
      const characters = await db.character.findMany({ where: { novelId } })
      characters.forEach(character => {
        if (!character.name || !character.personalityTraits) {
          issues.push({
            type: 'incomplete_character',
            description: `Character ${character.name || 'Unnamed'} is missing personality traits`
          })
        }
      })

      return { issues }
    } catch (error) {
      console.error('Failed to check consistency:', error)
      return { issues: [] }
    }
  }
}

export const storyMemoryEngine = new StoryMemoryEngine()
