'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, BookOpen, Edit3, Calendar, FileText, Users, Palette } from 'lucide-react'

interface Novel {
  id: string
  title: string | null
  mainIdea: string
  genre: string
  characters: string
  styleTone: string
  outline: string | null
  coverPrompt: string | null
  createdAt: string
  updatedAt: string
  chapters: Array<{
    id: string
    chapterNumber: number
    chapterType: 'intro' | 'chapter' | 'outro'
    content: string
    createdAt: string
  }>
}

export default function NovelViewPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const novelId = params.id as string
  
  const [novel, setNovel] = useState<Novel | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    if (!novelId) {
      router.push('/dashboard')
      return
    }

    fetchNovel()
  }, [session, status, router, novelId])

  const fetchNovel = async () => {
    try {
      const response = await fetch(`/api/novels/${novelId}`)
      if (!response.ok) throw new Error('Failed to fetch novel')
      
      const data = await response.json()
      setNovel(data)
    } catch (error) {
      console.error('Failed to load novel:', error)
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const getWordCount = (text: string) => {
    return text.split(/\s+/).filter(word => word.length > 0).length
  }

  const getTotalWordCount = () => {
    if (!novel) return 0
    return novel.chapters.reduce((total, chapter) => total + getWordCount(chapter.content), 0)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!session || !novel) {
    return null
  }

  const sortedChapters = [...novel.chapters].sort((a, b) => a.chapterNumber - b.chapterNumber)

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
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Novel View</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/tools/novel-writer/write?novel_id=${novelId}`}>
              <Button>
                <Edit3 className="h-4 w-4 mr-2" />
                Continue Writing
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Novel Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{novel.title || 'Untitled Novel'}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Created {formatDate(novel.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {sortedChapters.length} chapters
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {getTotalWordCount().toLocaleString()} words
              </div>
              {novel.genre && (
                <Badge variant="secondary">{novel.genre}</Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Novel Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Main Idea */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Main Idea</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{novel.mainIdea}</p>
                  </CardContent>
                </Card>

                {/* Characters */}
                {novel.characters && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Characters
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {JSON.parse(novel.characters).map((character: string, index: number) => (
                          <p key={index} className="text-sm text-muted-foreground">
                            {character}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Style & Tone */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Style & Tone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{novel.styleTone}</p>
                  </CardContent>
                </Card>

                {/* Cover Prompt */}
                {novel.coverPrompt && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Cover Prompt
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {novel.coverPrompt}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Chapters */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Chapters</CardTitle>
                  <CardDescription>
                    Read through your novel chapter by chapter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sortedChapters.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No chapters yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start writing your novel to see chapters here
                      </p>
                      <Link href={`/tools/novel-writer/write?novel_id=${novelId}`}>
                        <Button>Start Writing</Button>
                      </Link>
                    </div>
                  ) : (
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-8">
                        {sortedChapters.map((chapter, index) => (
                          <div key={chapter.id}>
                            <div className="mb-4">
                              <h3 className="text-xl font-semibold mb-2">
                                {chapter.chapterType === 'intro' ? 'Introduction' :
                                 chapter.chapterType === 'outro' ? 'Conclusion' :
                                 `Chapter ${chapter.chapterNumber}`}
                              </h3>
                              <div className="text-sm text-muted-foreground">
                                {getWordCount(chapter.content)} words • {formatDate(chapter.createdAt)}
                              </div>
                            </div>
                            <div className="prose prose-sm max-w-none">
                              <div className="whitespace-pre-wrap font-serif leading-relaxed text-sm">
                                {chapter.content}
                              </div>
                            </div>
                            {index < sortedChapters.length - 1 && (
                              <Separator className="mt-8" />
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
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