import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function generateOutline(novel: any): Promise<string> {
  // Simulated AI response - in production, you'd use z-ai-web-dev-sdk
  const mockOutline = `Chapter 1: The Discovery
- Protagonist receives a package containing her late father's unfinished manuscript
- Flashbacks to her childhood memories of him writing
- Initial reluctance to read the manuscript
- Opening the package and beginning to read

Chapter 2: First Words
- Reading the first chapters and being transported back
- Memories of her father's study come flooding back
- Realizing how little she knew about his writing process
- Finding notes in the margins that puzzle her

Chapter 3: The Hidden Notes
- Discovering cryptic references in the manuscript
- A mysterious letter tucked between pages 45 and 46
- First hint that there's more to the story
- Decision to investigate further

Chapter 4: The Archive
- Visiting her father's old university archive
- Meeting an old colleague who knew her father
- Learning about an unfinished project he never mentioned
- Finding references to "the lost chapters"

Chapter 5: Family Secrets
- Confronting her mother about what she knows
- Revelations about her father's past that shock her
- Understanding why the manuscript was never finished
- The weight of family legacy pressing down

Chapter 6: The Choice
- Internal struggle: complete or preserve?
- Dreams of her father guiding her
- Finding her own voice emerging
- Making the decision to continue

Chapter 7: Writing Through Grief
- Beginning to write in her own style
- The cathartic process of completing his work
- Characters begin to evolve beyond her father's vision
- Finding closure through creation

Chapter 8: The Ending
- Completing the final chapter
- A moment of connection with her father's memory
- Understanding that honoring means both preserving and evolving
- Peace in having created something together

Chapter 9: Publication
- The manuscript is published under both their names
- Reading the reviews and feeling mixed emotions
- A letter from a reader who was touched by the story
- Knowing that her father's legacy lives on

Chapter 10: New Beginnings
- Starting her own writing project
- Feeling her father's support
- Understanding that stories connect us beyond death
- The novel ends as she begins her own first chapter`

  return mockOutline
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if novel exists
    const novel = await db.novel.findUnique({
      where: { id: params.id }
    })

    if (!novel) {
      return NextResponse.json(
        { error: 'Novel not found' },
        { status: 404 }
      )
    }

    // Generate outline using AI
    const outline = await generateOutline(novel)

    // Update novel with outline
    const updatedNovel = await db.novel.update({
      where: { id: params.id },
      data: {
        outline,
        status: 'writing'
      }
    })

    return NextResponse.json({ novel: updatedNovel })
  } catch (error) {
    console.error('Failed to generate outline:', error)
    return NextResponse.json(
      { error: 'Failed to generate outline' },
      { status: 500 }
    )
  }
}
