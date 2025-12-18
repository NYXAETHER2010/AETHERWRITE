'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Sparkles, Loader2, Edit3, BookOpen, Plus, Eye } from 'lucide-react'
import { toast } from 'sonner'

interface Novel {
  id: string
  title: string | null
  mainIdea: string
  genre: string
  characters: string
  styleTone: string
  outline: string | null
  chapters: Array<{
    id: string
    chapterNumber: number
    chapterType: 'intro' | 'chapter' | 'outro'
    content: string
    createdAt: string
  }>
}

interface OutlineData {
  act_1: {
    chapters: Array<{
      number: number
      title: string
      summary: string
    }>
  }
  act_2: {
    chapters: Array<{
      number: number
      title: string
      summary: string
    }>
  }
  act_3: {
    chapters: Array<{
      number: number
      title: string
      summary: string
    }>
  }
}

export default function BookWriterPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const novelId = searchParams.get('novel_id')
  
  const [novel, setNovel] = useState<Novel | null>(null)
  const [outlineData, setOutlineData] = useState<OutlineData | null>(null)
  const [currentChapter, setCurrentChapter] = useState<number>(0)
  const [chapterContent, setChapterContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    if (!novelId) {
      router.push('/tools/novel-writer/idea')
      return
    }

    fetchNovel()
  }, [session, status, router, novelId])

  useEffect(() => {
    if (novel?.outline) {
      try {
        const parsed = JSON.parse(novel.outline)
        setOutlineData(parsed)
      } catch (error) {
        console.error('Failed to parse outline:', error)
      }
    }
  }, [novel])

  const fetchNovel = async () => {
    try {
      const response = await fetch(`/api/novels/${novelId}`)
      if (!response.ok) throw new Error('Failed to fetch novel')
      
      const data = await response.json()
      setNovel(data)
      
      // Set current chapter to next unwritten one
      if (data.chapters.length > 0) {
        setCurrentChapter(data.chapters.length)
      }
    } catch (error) {
      toast.error('Failed to load novel')
      router.push('/tools/novel-writer/cover')
    } finally {
      setIsLoading(false)
    }
  }

  const getChapterInfo = (chapterNum: number) => {
    if (!outlineData) return null
    
    const allChapters = [
      ...outlineData.act_1.chapters,
      ...outlineData.act_2.chapters,
      ...outlineData.act_3.chapters
    ]
    
    return allChapters.find(ch => ch.number === chapterNum)
  }

  const getChapterType = (chapterNum: number): 'intro' | 'chapter' | 'outro' => {
    if (chapterNum === 0) return 'intro'
    if (!outlineData) return 'chapter'
    
    const totalChapters = [
      ...outlineData.act_1.chapters,
      ...outlineData.act_2.chapters,
      ...outlineData.act_3.chapters
    ].length
    
    if (chapterNum > totalChapters) return 'outro'
    return 'chapter'
  }

  const handleGenerate = async () => {
    if (!novel) return

    const chapterInfo = getChapterInfo(currentChapter)
    const chapterType = getChapterType(currentChapter)
    
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: novel.title,
          main_idea: novel.mainIdea,
          genre: novel.genre,
          characters: JSON.parse(novel.characters || '[]'),
          style_tone: novel.styleTone,
          outline: novel.outline,
          chapter_number: currentChapter,
          chapter_type: chapterType,
          chapter_title: chapterInfo?.title || `Chapter ${currentChapter}`,
          chapter_summary: chapterInfo?.summary || '',
          previous_chapter_summary: novel.chapters[novel.chapters.length - 1]?.content?.slice(0, 200) || ''
        })
      })

      if (!response.ok) throw new Error('Failed to generate chapter')
      
      const data = await response.json()
      setChapterContent(data.content)
      toast.success('Chapter generated successfully!')
    } catch (error) {
      toast.error('Failed to generate chapter. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!novel || !chapterContent.trim()) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          novelId: novel.id,
          chapterNumber: currentChapter,
          chapterType: getChapterType(currentChapter),
          content: chapterContent
        })
      })

      if (!response.ok) throw new Error('Failed to save chapter')
      
      toast.success('Chapter saved successfully!')
      
      // Refresh novel data and move to next chapter
      await fetchNovel()
      setChapterContent('')
      setCurrentChapter(currentChapter + 1)
    } catch (error) {
      toast.error('Failed to save chapter. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const getWordCount = (text: string) => {
    return text.split(/\s+/).filter(word => word.length > 0).length
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session || !novel) {
    return null
  }

  const chapterInfo = getChapterInfo(currentChapter)
  const chapterType = getChapterType(currentChapter)
  const totalChapters = outlineData ? [
    ...outlineData.act_1.chapters,
    ...outlineData.act_2.chapters,
    ...outlineData.act_3.chapters
  ].length : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">AI Novel Writer</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/novels/${novelId}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Novel
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step 5 of 5: Write Novel</span>
            <span className="text-sm text-muted-foreground">100%</span>
          </div>
          <Progress value={100} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Write Your Novel</h1>
            <p className="text-muted-foreground">
              Generate and write your novel chapter by chapter with AI assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Chapter Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chapters</CardTitle>
                  <CardDescription>
                    {novel.chapters.length} of {totalChapters + 2} chapters written
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {/* Intro */}
                      <div
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          currentChapter === 0
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => setCurrentChapter(0)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Introduction</span>
                          {novel.chapters.find(ch => ch.chapterType === 'intro') && (
                            <Badge variant="secondary" className="text-xs">Done</Badge>
                          )}
                        </div>
                      </div>

                      {/* Regular Chapters */}
                      {outlineData && [
                        ...outlineData.act_1.chapters,
                        ...outlineData.act_2.chapters,
                        ...outlineData.act_3.chapters
                      ].map((chapter) => (
                        <div
                          key={chapter.number}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            currentChapter === chapter.number
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => setCurrentChapter(chapter.number)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Chapter {chapter.number}</div>
                              <div className="text-xs opacity-70 truncate">{chapter.title}</div>
                            </div>
                            {novel.chapters.find(ch => ch.chapterNumber === chapter.number) && (
                              <Badge variant="secondary" className="text-xs">Done</Badge>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Outro */}
                      <div
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          currentChapter > totalChapters
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => setCurrentChapter(totalChapters + 1)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Conclusion</span>
                          {novel.chapters.find(ch => ch.chapterType === 'outro') && (
                            <Badge variant="secondary" className="text-xs">Done</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Writing Area */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        {chapterType === 'intro' ? 'Introduction' : 
                         chapterType === 'outro' ? 'Conclusion' :
                         `Chapter ${currentChapter}: ${chapterInfo?.title || 'Untitled'}`}
                      </CardTitle>
                      {chapterInfo?.summary && (
                        <CardDescription className="mt-2">
                          {chapterInfo.summary}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={activeTab === 'write' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('write')}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Write
                      </Button>
                      <Button
                        variant={activeTab === 'preview' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('preview')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeTab === 'write' ? (
                    <>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="chapter-content">Chapter Content</Label>
                        <div className="text-sm text-muted-foreground">
                          {getWordCount(chapterContent)} words
                        </div>
                      </div>
                      <Textarea
                        id="chapter-content"
                        value={chapterContent}
                        onChange={(e) => setChapterContent(e.target.value)}
                        className="min-h-[400px] font-serif"
                        placeholder="Start writing your chapter here, or use the AI generator below..."
                      />
                    </>
                  ) : (
                    <div className="min-h-[400px] p-6 bg-muted rounded-lg">
                      <div className="prose prose-sm max-w-none">
                        {chapterContent ? (
                          <div className="whitespace-pre-wrap font-serif leading-relaxed">
                            {chapterContent}
                          </div>
                        ) : (
                          <div className="text-muted-foreground italic">
                            No content to preview. Start writing or generate content to see it here.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate with AI
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={handleSave}
                      disabled={isSaving || !chapterContent.trim()}
                      className="flex-1"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Save Chapter
                        </>
                      )}
                    </Button>
                  </div>

                  {chapterContent && (
                    <div className="text-sm text-muted-foreground">
                      💡 Tip: You can edit the generated content before saving to make it perfect for your story.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}