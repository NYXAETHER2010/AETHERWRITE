'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface GeneratedIdea {
  main_idea: string
  genre: string
  characters: string[]
  style_tone: string
}

export default function IdeaGeneratorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [ideaInput, setIdeaInput] = useState('')
  const [generatedIdea, setGeneratedIdea] = useState<GeneratedIdea | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

  const handleGenerate = async () => {
    if (!ideaInput.trim()) {
      toast.error('Please enter your book idea')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea_input: ideaInput })
      })

      if (!response.ok) throw new Error('Failed to generate idea')
      
      const data = await response.json()
      setGeneratedIdea(data)
      toast.success('Idea generated successfully!')
    } catch (error) {
      toast.error('Failed to generate idea. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveAndContinue = async () => {
    if (!generatedIdea) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/novels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaInput,
          mainIdea: generatedIdea.main_idea,
          genre: generatedIdea.genre,
          characters: JSON.stringify(generatedIdea.characters),
          styleTone: generatedIdea.style_tone
        })
      })

      if (!response.ok) throw new Error('Failed to save novel')
      
      const novel = await response.json()
      toast.success('Novel saved successfully!')
      router.push(`/tools/novel-writer/title?novel_id=${novel.id}`)
    } catch (error) {
      toast.error('Failed to save novel. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to login
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
            <span className="text-sm font-medium">Step 1 of 5: Book Idea</span>
            <span className="text-sm text-muted-foreground">20%</span>
          </div>
          <Progress value={20} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Book Idea Generator</h1>
            <p className="text-muted-foreground">
              Tell us about your book idea and our AI will help develop it into a complete concept.
            </p>
          </div>

          <div className="grid gap-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Your Book Idea</CardTitle>
                <CardDescription>
                  Describe your book concept in 50-500 characters. What is your story about?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="idea">Book Idea</Label>
                  <Textarea
                    id="idea"
                    placeholder="A detective who can solve crimes by experiencing the victims' last moments, but each vision takes a piece of their memory..."
                    value={ideaInput}
                    onChange={(e) => setIdeaInput(e.target.value)}
                    className="min-h-[120px]"
                    maxLength={500}
                  />
                  <div className="text-sm text-muted-foreground text-right">
                    {ideaInput.length}/500 characters
                  </div>
                </div>
                <Button 
                  onClick={handleGenerate} 
                  disabled={!ideaInput.trim() || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Idea...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Novel Concept
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Content */}
            {generatedIdea && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Novel Concept</CardTitle>
                  <CardDescription>
                    Here's your AI-generated novel concept. You can edit any part before saving.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Main Idea</Label>
                    <p className="p-3 bg-muted rounded-lg text-sm">
                      {generatedIdea.main_idea}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Genre</Label>
                    <p className="p-3 bg-muted rounded-lg text-sm">
                      {generatedIdea.genre}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Key Characters</Label>
                    <div className="space-y-2">
                      {generatedIdea.characters.map((character, index) => (
                        <p key={index} className="p-3 bg-muted rounded-lg text-sm">
                          {character}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Writing Style & Tone</Label>
                    <p className="p-3 bg-muted rounded-lg text-sm">
                      {generatedIdea.style_tone}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setGeneratedIdea(null)}
                      className="flex-1"
                    >
                      Regenerate
                    </Button>
                    <Button 
                      onClick={handleSaveAndContinue}
                      disabled={isSaving}
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