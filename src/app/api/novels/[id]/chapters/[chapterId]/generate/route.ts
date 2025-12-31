import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function generateChapterContent(novel: any, chapter: any, previousChapters: any[]): Promise<{
  content: string
  summary: string
}> {
  // Simulated AI response - in production, you'd use z-ai-web-dev-sdk
  // This is a mock response demonstrating the chapter generation
  const mockContent = `The package sat on the kitchen table for three days before Emma finally found the courage to open it. Plain brown wrapping, addressed in her father's familiar scrawl—his handwriting hadn't changed, even though everything else had.

She ran her fingers over the address. Her name, written with that careful precision he'd always used when correcting her school papers. The return address was the university library, his old office.

"Dad's manuscript," she whispered to the empty room. The words felt foreign, impossible. Her father had been gone for six months. The funeral was a blur of sympathetic faces and casseroles she'd never reheated. The house was too quiet now.

Emma picked up the package. Lighter than she expected. She found a pair of scissors in the junk drawer and cut the tape, pulling back the brown paper to reveal a worn leather notebook. His journal—the one he'd carried everywhere, written in during every lunch break, every stolen moment between classes and meetings and the thousand obligations of a busy academic life.

She opened it to the first page. His handwriting greeted her, immediate and intimate.

*For Emma—if I don't finish this, I want you to decide what happens next. Not because you're my daughter, but because you're the best writer I know.*

The ink was slightly smudged, as if he'd hesitated before writing those words. Emma felt tears prick her eyes. Best writer? She hadn't written anything creative since college, since his gentle "you're talented, honey" had made her feel like a fraud compared to his published novels, his critical acclaim.

She turned the page. And there it was—the beginning of a story. Not one of his published works. Something new. Something unfinished.

The room seemed to hold its breath as Emma began to read.

---

The notebook contained thirty chapters, each meticulously plotted, most partially written. Her father had been working on this novel in secret, crafting it during those lunch breaks she'd thought were for grading papers or preparing lectures. The protagonist was a woman named Sarah who'd lost her father under similar circumstances, who found herself drawn back to his study, his unfinished projects, his ghost that seemed to inhabit every corner of the house where she'd grown up.

It was too close. Too personal. Emma closed the notebook, her hands trembling.

This wasn't just a story. It was her father saying goodbye in the only way he knew how—through words, through narrative, through the craft that had defined his entire adult life. And he was asking her to complete it.

The weight of that request settled over her shoulders like a physical burden. Complete his final work? Her, who hadn't written a creative word in years? Who'd convinced herself that her father's encouragement was just paternal love blinding him to her mediocrity?

But then she remembered those words again: *not because you're my daughter, but because you're the best writer I know.*

Emma opened the notebook again. This time, she didn't just read—she studied. Her father's process became clear in his margin notes, his crossed-out sentences, his experimental paragraphs. She saw his struggles with chapter seven, where Sarah discovers her father's secret letters. She saw his breakthrough in chapter twelve, where Sarah finally confronts her mother about the past.

She began to understand. This wasn't about talent. It was about craft, about the discipline of showing up to the page day after day, even when the words didn't come easily. It was about revision, about being willing to cut beautiful sentences that didn't serve the story.

Emma found herself reaching for a pen—her father's fountain pen, the one he'd given her for college graduation, still inked and ready.

She turned to the end of chapter three, where Sarah discovers the first hidden letter. Her father had left it unfinished, the scene hanging in mid-air. Emma read the previous paragraphs again, letting the story wash over her, feeling the rhythm of her father's sentences.

And then she wrote.

The pen moved across the page, her handwriting different from his but somehow complementary. Sarah pulled the letter from its envelope, her fingers trembling. The paper was old, yellowed, covered in handwriting she recognized immediately—her grandfather's, gone these twenty years. 

Emma stopped. Read what she'd written. It was... okay. Not perfect. But it fit. It belonged in this story.

She looked at the clock. Two hours had passed. The sun was setting, casting long shadows across the kitchen table. Her back ached from hunching over the notebook, but for the first time since her father's death, the quiet in the house didn't feel oppressive. It felt creative.

She was writing. Really writing. And somewhere, she hoped her father could see it.`

  const mockSummary = `Emma receives her late father's unfinished manuscript in a notebook. After initially hesitating to open it due to grief, she reads his note asking her to complete it. She discovers an unfinished story about a woman named Sarah who's also dealing with her father's death. Emma begins to understand her father's writing process and, using his old fountain pen, starts writing where he left off, finding a sense of connection and purpose in the act of writing.`

  return {
    content: mockContent,
    summary: mockSummary
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; chapterId: string } }
) {
  try {
    // Get chapter details
    const chapter = await db.chapter.findUnique({
      where: { id: params.chapterId }
    })

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    // Get novel details
    const novel = await db.novel.findUnique({
      where: { id: params.id }
    })

    if (!novel) {
      return NextResponse.json(
        { error: 'Novel not found' },
        { status: 404 }
      )
    }

    // Get previous chapters for context
    const previousChapters = await db.chapter.findMany({
      where: {
        novelId: params.id,
        chapterNumber: {
          lt: chapter.chapterNumber
        }
      },
      orderBy: {
        chapterNumber: 'desc'
      },
      take: 3
    })

    // Generate chapter content using AI
    const generated = await generateChapterContent(novel, chapter, previousChapters)

    // Update chapter with generated content
    const updatedChapter = await db.chapter.update({
      where: { id: params.chapterId },
      data: {
        content: generated.content,
        summary: generated.summary,
        status: 'completed',
        aiGenerated: true,
        wordCount: generated.content.split(/\s+/).length
      }
    })

    // Update novel total words
    const allChapters = await db.chapter.findMany({
      where: { novelId: params.id }
    })
    const totalWords = allChapters.reduce((sum, ch) => sum + ch.wordCount, 0)

    await db.novel.update({
      where: { id: params.id },
      data: { totalWords }
    })

    return NextResponse.json({ chapter: updatedChapter })
  } catch (error) {
    console.error('Failed to generate chapter:', error)
    return NextResponse.json(
      { error: 'Failed to generate chapter' },
      { status: 500 }
    )
  }
}
