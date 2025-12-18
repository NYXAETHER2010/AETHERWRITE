'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Edit } from 'lucide-react'
import { toast } from 'sonner'

interface Novel {
  id: string
  ideaInput: string
  mainIdea: string
  genre: string
  characters: string
  styleTone: string
}

export default function TitleGeneratorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const novelId = searchParams.get('novel_id')
  
  const [novel, setNovel] = useState<Novel | null>(null)
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([])
  const [selectedTitle, setSelectedTitle] = useState('')
  const [customTitle, setCustomTitle] = useState('')
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

  const fetchNovel = async () => {
    try {
      const response = await fetch(`/api/novels/${novelId}`)
      if (!response.ok) throw new Error('Failed to fetch novel')
      
      const data = await response.json()
      setNovel(data)
    } catch (error) {
      toast.error('Failed to load novel')
      router.push('/tools/novel-writer/idea')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!novel) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          main_idea: novel.mainIdea,
          genre: novel.genre,
          characters: JSON.parse(novel.characters || '[]'),
          style_tone: novel.styleTone
        })
      })

      if (!response.ok) throw new Error('Failed to generate titles')
      
      const data = await response.json()
      setGeneratedTitles(data.titles || [])
      toast.success('Titles generated successfully!')
    } catch (error) {
      toast.error('Failed to generate titles. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveAndContinue = async () => {
    if (!novel) return

    const titleToSave = customTitle.trim() || selectedTitle
    if (!titleToSave) {
      toast.error('Please select or enter a title')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/novels/${novelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: titleToSave })
      })

      if (!response.ok) throw new Error('Failed to save title')
      
      toast.success('Title saved successfully!')
      router.push(`/tools/novel-writer/outline?novel_id=${novelId}`)
    } catch (error) {
      toast.error('Failed to save title. Please try again.')
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
            <span className="text-sm font-medium">Step 2 of 5: Book Title</span>
            <span className="text-sm text-muted-foreground">40%</span>
          </div>
          <Progress value={40} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Book Title Generator</h1>
            <p className="text-muted-foreground">
              Based on your novel concept, our AI will generate compelling title options.
            </p>
          </div>

          {/* Novel Context */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Novel Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <CardTitle>Generate Titles</CardTitle>
                <CardDescription>
                  Click to generate AI-powered title suggestions based on your novel concept.
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
                      Generating Titles...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Title Options
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Titles */}
            {generatedTitles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Titles</CardTitle>
                  <CardDescription>
                    Select a title or create your own custom title below.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    {generatedTitles.map((title, index) => (
                      <div
                        key={index}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedTitle === title
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => {
                          setSelectedTitle(title)
                          setCustomTitle('') // Clear custom title when selecting generated one
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{title}</span>
                          {selectedTitle === title && (
                            <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Custom Title Input */}
                  <div className="space-y-2">
                    <Label htmlFor="custom-title">Or Create Your Own Title</Label>
                    <div className="flex gap-2">
                      <Input
                        id="custom-title"
                        placeholder="Enter your custom title..."
                        value={customTitle}
                        onChange={(e) => {
                          setCustomTitle(e.target.value)
                          setSelectedTitle('') // Clear selected title when entering custom
                        }}
                      />
                      <Edit className="h-4 w-4 text-muted-foreground mt-3" />
                    </div>
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
                      disabled={isSaving || (!selectedTitle && !customTitle.trim())}
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