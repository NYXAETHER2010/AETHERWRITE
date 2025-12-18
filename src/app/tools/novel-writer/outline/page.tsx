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
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Edit3 } from 'lucide-react'
import { toast } from 'sonner'

interface Novel {
  id: string
  title: string | null
  ideaInput: string
  mainIdea: string
  genre: string
  characters: string
  styleTone: string
}

interface Outline {
  act_1: {
    title: string
    chapters: Array<{
      number: number
      title: string
      summary: string
    }>
  }
  act_2: {
    title: string
    chapters: Array<{
      number: number
      title: string
      summary: string
    }>
  }
  act_3: {
    title: string
    chapters: Array<{
      number: number
      title: string
      summary: string
    }>
  }
}

export default function OutlineGeneratorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const novelId = searchParams.get('novel_id')
  
  const [novel, setNovel] = useState<Novel | null>(null)
  const [generatedOutline, setGeneratedOutline] = useState<Outline | null>(null)
  const [editedOutline, setEditedOutline] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
    if (generatedOutline) {
      setEditedOutline(JSON.stringify(generatedOutline, null, 2))
    }
  }, [generatedOutline])

  const fetchNovel = async () => {
    try {
      const response = await fetch(`/api/novels/${novelId}`)
      if (!response.ok) throw new Error('Failed to fetch novel')
      
      const data = await response.json()
      setNovel(data)
    } catch (error) {
      toast.error('Failed to load novel')
      router.push('/tools/novel-writer/title')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!novel) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: novel.title,
          main_idea: novel.mainIdea,
          genre: novel.genre,
          characters: JSON.parse(novel.characters || '[]'),
          style_tone: novel.styleTone
        })
      })

      if (!response.ok) throw new Error('Failed to generate outline')
      
      const data = await response.json()
      setGeneratedOutline(data)
      toast.success('Outline generated successfully!')
    } catch (error) {
      toast.error('Failed to generate outline. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveAndContinue = async () => {
    if (!novel || !editedOutline.trim()) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/novels/${novelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outline: editedOutline })
      })

      if (!response.ok) throw new Error('Failed to save outline')
      
      toast.success('Outline saved successfully!')
      router.push(`/tools/novel-writer/cover?novel_id=${novelId}`)
    } catch (error) {
      toast.error('Failed to save outline. Please try again.')
    } finally {
      setIsSaving(false)
    }
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
        </div>
      </header>

      {/* Progress */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step 3 of 5: Book Outline</span>
            <span className="text-sm text-muted-foreground">60%</span>
          </div>
          <Progress value={60} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Book Outline Generator</h1>
            <p className="text-muted-foreground">
              Create a structured 3-act outline for your novel with chapter breakdowns.
            </p>
          </div>

          {/* Novel Context */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Novel Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <p className="text-sm text-muted-foreground mt-1">{novel.title || 'Untitled'}</p>
              </div>
              <div>
                <Label>Main Idea</Label>
                <p className="text-sm text-muted-foreground mt-1">{novel.mainIdea}</p>
              </div>
              <div>
                <Label>Genre</Label>
                <p className="text-sm text-muted-foreground mt-1">{novel.genre}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-8">
            {/* Generate Section */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Outline</CardTitle>
                <CardDescription>
                  Generate a complete 3-act structure with chapter breakdowns for your novel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Outline...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Novel Outline
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Outline */}
            {generatedOutline && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Outline</CardTitle>
                  <CardDescription>
                    Review and edit your novel outline. You can modify the structure, chapter titles, and summaries.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preview Section */}
                  <div className="space-y-6">
                    {Object.entries(generatedOutline).map(([actKey, act]) => (
                      <div key={actKey} className="border rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">{act.title}</h3>
                        <div className="space-y-3">
                          {act.chapters.map((chapter) => (
                            <div key={chapter.number} className="border-l-2 border-primary/20 pl-4">
                              <h4 className="font-medium">Chapter {chapter.number}: {chapter.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{chapter.summary}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Edit Section */}
                  <div className="space-y-2">
                    <Label htmlFor="outline-edit">Edit Outline (JSON)</Label>
                    <Textarea
                      id="outline-edit"
                      value={editedOutline}
                      onChange={(e) => setEditedOutline(e.target.value)}
                      className="min-h-[300px] font-mono text-sm"
                      placeholder="Edit the outline in JSON format..."
                    />
                    <p className="text-xs text-muted-foreground">
                      <Edit3 className="inline h-3 w-3 mr-1" />
                      You can edit the outline directly. Make sure to maintain valid JSON format.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="flex-1"
                    >
                      Regenerate
                    </Button>
                    <Button 
                      onClick={handleSaveAndContinue}
                      disabled={isSaving || !editedOutline.trim()}
                      className="flex-1"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Save & Continue
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}