'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Clock, Star, Wrench } from 'lucide-react'

const toolDescriptions: Record<string, { title: string; description: string; features: string[] }> = {
  'short-story-writer': {
    title: 'Short Story Writer',
    description: 'Craft compelling short stories with AI assistance from concept to completion.',
    features: [
      'Story idea generator',
      'Character development',
      'Plot structure templates',
      'Dialogue assistance',
      'Multiple genre support'
    ]
  },
  'screenplay-writer': {
    title: 'Screenplay Writer',
    description: 'Write professional screenplays in standard industry format with AI guidance.',
    features: [
      'Industry-standard formatting',
      'Scene breakdown generator',
      'Character dialogue assistance',
      'Plot structure templates',
      'Export to Final Draft format'
    ]
  },
  'manga-script-writer': {
    title: 'Manga Script Writer',
    description: 'Create engaging manga scripts with detailed panel descriptions and dialogue.',
    features: [
      'Panel layout suggestions',
      'Visual description generator',
      'Character dialogue assistance',
      'Pacing guidance',
      'Multiple manga styles'
    ]
  },
  'poetry-generator': {
    title: 'Poetry Generator',
    description: 'Generate beautiful poetry in various styles and forms with AI assistance.',
    features: [
      'Multiple poetry forms',
      'Rhyme scheme assistance',
      'Metaphor and imagery suggestions',
      'Emotional tone control',
      'Style customization'
    ]
  },
  'character-builder': {
    title: 'Character Builder',
    description: 'Develop deep, compelling characters with detailed backstories and personalities.',
    features: [
      'Character archetype templates',
      'Backstory generator',
      'Personality trait builder',
      'Character relationship mapper',
      'Character arc development'
    ]
  },
  'world-builder': {
    title: 'World Builder',
    description: 'Create rich, immersive worlds with detailed lore, geography, and cultures.',
    features: [
      'Geography generator',
      'Culture creation tools',
      'History timeline builder',
      'Magic system designer',
      'Political structure mapper'
    ]
  },
  'cover-art-generator': {
    title: 'Cover Art Generator',
    description: 'Generate stunning cover art concepts and detailed visual prompts.',
    features: [
      'Visual concept generator',
      'Style customization',
      'Composition suggestions',
      'Color palette designer',
      'Typography recommendations'
    ]
  }
}

export default function ComingSoonPage({ params }: { params: { tool: string[] } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const toolPath = params.tool?.join('/') || ''
  const toolInfo = toolDescriptions[toolPath]

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (!toolInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
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
              <Wrench className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Tools</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">{toolInfo.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">{toolInfo.description}</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-full">
              <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-700 dark:text-amber-300 font-medium">Coming Soon</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>What this tool will include</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {toolInfo.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Development Status</CardTitle>
                <CardDescription>Current progress and timeline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">In Planning</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span>Concept & Planning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-muted rounded-full"></div>
                    <span>Development</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-muted rounded-full"></div>
                    <span>Beta Testing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-muted rounded-full"></div>
                    <span>Launch</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    We're working hard to bring this tool to you. Sign up for updates to be notified when it's ready.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="text-center py-8">
              <h3 className="text-xl font-semibold mb-4">While You Wait</h3>
              <p className="text-muted-foreground mb-6">
                Try our AI Novel Writer tool, which is already available and packed with powerful features to help you write your next masterpiece.
              </p>
              <Link href="/tools/novel-writer/idea">
                <Button size="lg">
                  Try AI Novel Writer
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}