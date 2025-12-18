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
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Edit3, Image } from 'lucide-react'
import { toast } from 'sonner'

interface Novel {
  id: string
  title: string | null
  mainIdea: string
  genre: string
  styleTone: string
  outline: string | null
}

export default function CoverPromptGeneratorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const novelId = searchParams.get('novel_id')
  
  const [novel, setNovel] = useState<Novel | null>(null)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [editedPrompt, setEditedPrompt] = useState('')
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
    if (generatedPrompt) {
      setEditedPrompt(generatedPrompt)
    }
  }, [generatedPrompt])

  const fetchNovel = async () => {
    try {
      const response = await fetch(`/api/novels/${novelId}`)
      if (!response.ok) throw new Error('Failed to fetch novel')
      
      const data = await response.json()
      setNovel(data)
    } catch (error) {
      toast.error('Failed to load novel')
      router.push('/tools/novel-writer/outline')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!novel) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-cover-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: novel.title,
          genre: novel.genre,
          main_idea: novel.mainIdea,
          style_tone: novel.styleTone
        })
      })

      if (!response.ok) throw new Error('Failed to generate cover prompt')
      
      const data = await response.json()
      setGeneratedPrompt(data.prompt)
      toast.success('Cover prompt generated successfully!')
    } catch (error) {
      toast.error('Failed to generate cover prompt. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveAndContinue = async () => {
    if (!novel || !editedPrompt.trim()) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/novels/${novelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverPrompt: editedPrompt })
      })

      if (!response.ok) throw new Error('Failed to save cover prompt')
      
      toast.success('Cover prompt saved successfully!')
      router.push(`/tools/novel-writer/write?novel_id=${novelId}`)
    } catch (error) {
      toast.error('Failed to save cover prompt. Please try again.')
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
            <span className="text-sm font-medium">Step 4 of 5: Cover Prompt</span>
            <span className="text-sm text-muted-foreground">80%</span>
          </div>
          <Progress value={80} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Book Cover Prompt Generator</h1>
            <p className="text-muted-foreground">
              Generate a detailed text prompt for creating your book cover. This prompt can be used with AI image generation tools.
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
              <div>
                <Label>Style & Tone</Label>
                <p className="text-sm text-muted-foreground mt-1">{novel.styleTone}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-8">
            {/* Generate Section */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Cover Prompt</CardTitle>
                <CardDescription>
                  Create a detailed text prompt for your book cover that captures the essence of your novel.
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
                      Generating Cover Prompt...
                    </>
                  ) : (
                    <>
                      <Image className="h-4 w-4 mr-2" />
                      Generate Cover Prompt
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Prompt */}
            {generatedPrompt && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Cover Prompt</CardTitle>
                  <CardDescription>
                    Review and edit your cover prompt. This text can be used with AI image generation tools like Midjourney, DALL-E, or Stable Diffusion.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preview Section */}
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Preview:</h4>
                    <p className="text-sm whitespace-pre-wrap">{generatedPrompt}</p>
                  </div>

                  {/* Edit Section */}
                  <div className="space-y-2">
                    <Label htmlFor="prompt-edit">Edit Cover Prompt</Label>
                    <Textarea
                      id="prompt-edit"
                      value={editedPrompt}
                      onChange={(e) => setEditedPrompt(e.target.value)}
                      className="min-h-[200px]"
                      placeholder="Edit the cover prompt..."
                    />
                    <p className="text-xs text-muted-foreground">
                      <Edit3 className="inline h-3 w-3 mr-1" />
                      Customize the prompt to match your vision for the book cover.
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      How to use this prompt:
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Copy this prompt and paste it into AI image generators</li>
                      <li>• Tools like Midjourney, DALL-E, or Stable Diffusion work well</li>
                      <li>• You can modify the prompt to get different variations</li>
                      <li>• Consider adding style keywords like "book cover design" or "typography"</li>
                    </ul>
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
                      disabled={isSaving || !editedPrompt.trim()}
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