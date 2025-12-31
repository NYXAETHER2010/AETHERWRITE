'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { BookOpen, ArrowLeft, Sparkles, FileText, Users, Download, Edit, Save, Plus, PenTool } from 'lucide-react'
import Link from 'next/link'

interface Novel {
  id: string
  title: string
  currentTitle: string | null
  description: string | null
  genre: string | null
  themes: string | null
  tone: string | null
  centralConflict: string | null
  directionalEnding: string | null
  outline: string | null
  chapterCount: number
  currentChapter: number
  totalWords: number
  status: string
}

interface Chapter {
  id: string
  chapterNumber: number
  title: string | null
  summary: string | null
  content: string | null
  wordCount: number
  status: string
}

interface Character {
  id: string
  name: string
  role: string | null
  age: string | null
  physicalAppearance: string | null
  personalityTraits: string | null
  backstory: string | null
  goals: string | null
  fears: string | null
  relationships: string | null
}

export default function NovelWorkspace() {
  const params = useParams()
  const router = useRouter()
  const novelId = params.id as string
  const [novel, setNovel] = useState<Novel | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [ideaInput, setIdeaInput] = useState('')
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([])
  const [generatingTitles, setGeneratingTitles] = useState(false)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [isCreateChapterOpen, setIsCreateChapterOpen] = useState(false)
  const [newChapterTitle, setNewChapterTitle] = useState('')
  const [editingContent, setEditingContent] = useState('')
  const [generatingChapter, setGeneratingChapter] = useState(false)
  const [characters, setCharacters] = useState<Character[]>([])
  const [isCreateCharacterOpen, setIsCreateCharacterOpen] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    role: '',
    age: '',
    physicalAppearance: '',
    personalityTraits: '',
    backstory: '',
    goals: '',
    fears: '',
    relationships: ''
  })

  useEffect(() => {
    if (novelId) {
      fetchNovel()
      fetchChapters()
      fetchCharacters()
    }
  }, [novelId])

  const fetchNovel = async () => {
    try {
      const response = await fetch(`/api/novels/${novelId}`)
      if (response.ok) {
        const data = await response.json()
        setNovel(data.novel)
        setIdeaInput(data.novel.description || '')
      }
    } catch (error) {
      console.error('Failed to fetch novel:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchChapters = async () => {
    try {
      const response = await fetch(`/api/novels/${novelId}/chapters`)
      if (response.ok) {
        const data = await response.json()
        setChapters(data.chapters || [])
      }
    } catch (error) {
      console.error('Failed to fetch chapters:', error)
    }
  }

  const fetchCharacters = async () => {
    try {
      const response = await fetch(`/api/novels/${novelId}/characters`)
      if (response.ok) {
        const data = await response.json()
        setCharacters(data.characters || [])
      }
    } catch (error) {
      console.error('Failed to fetch characters:', error)
    }
  }

  const handleGenerateIdea = async () => {
    setGenerating(true)
    try {
      const response = await fetch(`/api/novels/${novelId}/develop-idea`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: ideaInput })
      })

      if (response.ok) {
        const data = await response.json()
        setNovel(data.novel)
      }
    } catch (error) {
      console.error('Failed to develop idea:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleGenerateTitles = async () => {
    setGeneratingTitles(true)
    try {
      const response = await fetch(`/api/novels/${novelId}/generate-titles`, {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedTitles(data.titles)
      }
    } catch (error) {
      console.error('Failed to generate titles:', error)
    } finally {
      setGeneratingTitles(false)
    }
  }

  const handleSelectTitle = async (title: string) => {
    try {
      const response = await fetch(`/api/novels/${novelId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentTitle: title })
      })

      if (response.ok) {
        const data = await response.json()
        setNovel(data.novel)
      }
    } catch (error) {
      console.error('Failed to select title:', error)
    }
  }

  const handleGenerateOutline = async () => {
    setGenerating(true)
    try {
      const response = await fetch(`/api/novels/${novelId}/generate-outline`, {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        setNovel(data.novel)
      }
    } catch (error) {
      console.error('Failed to generate outline:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleCreateChapter = async () => {
    try {
      const response = await fetch(`/api/novels/${novelId}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newChapterTitle })
      })

      if (response.ok) {
        const data = await response.json()
        setIsCreateChapterOpen(false)
        setNewChapterTitle('')
        fetchChapters()
        fetchNovel()
      }
    } catch (error) {
      console.error('Failed to create chapter:', error)
    }
  }

  const handleSelectChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter)
    setEditingContent(chapter.content || '')
  }

  const handleSaveChapter = async () => {
    if (!selectedChapter) return

    try {
      const response = await fetch(`/api/novels/${novelId}/chapters/${selectedChapter.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editingContent,
          status: 'completed'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setChapters(chapters.map(ch => ch.id === selectedChapter.id ? data.chapter : ch))
        setSelectedChapter(data.chapter)
        fetchNovel()
      }
    } catch (error) {
      console.error('Failed to save chapter:', error)
    }
  }

  const handleGenerateChapter = async () => {
    if (!selectedChapter) return

    setGeneratingChapter(true)
    try {
      const response = await fetch(`/api/novels/${novelId}/chapters/${selectedChapter.id}/generate`, {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        setEditingContent(data.chapter.content || '')
        setChapters(chapters.map(ch => ch.id === selectedChapter.id ? data.chapter : ch))
        setSelectedChapter(data.chapter)
        fetchNovel()
      }
    } catch (error) {
      console.error('Failed to generate chapter:', error)
    } finally {
      setGeneratingChapter(false)
    }
  }

  const handleCreateCharacter = async () => {
    try {
      const response = await fetch(`/api/novels/${novelId}/characters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCharacter)
      })

      if (response.ok) {
        const data = await response.json()
        setIsCreateCharacterOpen(false)
        setNewCharacter({
          name: '',
          role: '',
          age: '',
          physicalAppearance: '',
          personalityTraits: '',
          backstory: '',
          goals: '',
          fears: '',
          relationships: ''
        })
        fetchCharacters()
      }
    } catch (error) {
      console.error('Failed to create character:', error)
    }
  }

  const handleExport = async (format: string) => {
    try {
      const response = await fetch(`/api/novels/${novelId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const title = novel?.currentTitle || novel?.title || 'novel'
        const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
        a.download = `${safeTitle}.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to export novel:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 animate-pulse mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Loading novel...</p>
        </div>
      </div>
    )
  }

  if (!novel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Novel Not Found</CardTitle>
            <CardDescription>The novel you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{novel.currentTitle || novel.title}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {novel.status}
                </Badge>
                {novel.genre && (
                  <Badge variant="outline">{novel.genre}</Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  {novel.chapterCount} chapters • {novel.totalWords.toLocaleString()} words
                </span>
              </div>
            </div>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Novel
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="idea" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="idea">
              <Sparkles className="mr-2 h-4 w-4" />
              Idea
            </TabsTrigger>
            <TabsTrigger value="outline">
              <FileText className="mr-2 h-4 w-4" />
              Outline
            </TabsTrigger>
            <TabsTrigger value="chapters">
              <BookOpen className="mr-2 h-4 w-4" />
              Chapters
            </TabsTrigger>
            <TabsTrigger value="characters">
              <Users className="mr-2 h-4 w-4" />
              Characters
            </TabsTrigger>
            <TabsTrigger value="export">
              <Download className="mr-2 h-4 w-4" />
              Export
            </TabsTrigger>
          </TabsList>

          {/* Idea Development Tab */}
          <TabsContent value="idea" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Develop Your Novel Idea</CardTitle>
                <CardDescription>
                  Start with a basic concept and let AI expand it into a complete foundation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="idea-input">Your Novel Idea</Label>
                  <Textarea
                    id="idea-input"
                    placeholder="Describe your novel concept, characters, setting, or plot idea..."
                    value={ideaInput}
                    onChange={(e) => setIdeaInput(e.target.value)}
                    rows={6}
                  />
                </div>
                <Button
                  onClick={handleGenerateIdea}
                  disabled={generating || !ideaInput.trim()}
                  size="lg"
                  className="w-full"
                >
                  {generating ? (
                    <>Generating Foundation...</>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Develop Novel Foundation
                    </>
                  )}
                </Button>

                {(novel.genre || novel.themes || novel.tone) && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold text-lg">Novel Foundation</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {novel.genre && (
                        <div>
                          <Label className="text-sm text-muted-foreground">Genre</Label>
                          <p className="font-medium">{novel.genre}</p>
                        </div>
                      )}
                      {novel.tone && (
                        <div>
                          <Label className="text-sm text-muted-foreground">Tone</Label>
                          <p className="font-medium">{novel.tone}</p>
                        </div>
                      )}
                      {novel.centralConflict && (
                        <div className="md:col-span-2">
                          <Label className="text-sm text-muted-foreground">Central Conflict</Label>
                          <p className="font-medium">{novel.centralConflict}</p>
                        </div>
                      )}
                      {novel.directionalEnding && (
                        <div className="md:col-span-2">
                          <Label className="text-sm text-muted-foreground">Directional Ending</Label>
                          <p className="font-medium">{novel.directionalEnding}</p>
                        </div>
                      )}
                      {novel.themes && (
                        <div className="md:col-span-2">
                          <Label className="text-sm text-muted-foreground">Themes</Label>
                          <p className="font-medium">{novel.themes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Title Generation */}
                {(novel.genre || novel.themes) && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold text-lg">Generate Titles</h3>
                    <Button
                      onClick={handleGenerateTitles}
                      disabled={generatingTitles}
                      variant="outline"
                      className="w-full"
                    >
                      {generatingTitles ? (
                        <>Generating Titles...</>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Title Options
                        </>
                      )}
                    </Button>

                    {generatedTitles.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm">Select a Title</Label>
                        <div className="grid gap-2">
                          {generatedTitles.map((title, index) => (
                            <Button
                              key={index}
                              variant={novel.currentTitle === title ? "default" : "outline"}
                              onClick={() => handleSelectTitle(title)}
                              className="justify-start text-left"
                            >
                              {title}
                              {novel.currentTitle === title && (
                                <span className="ml-auto">✓</span>
                              )}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generate Outline Card */}
            {(novel.genre && novel.centralConflict) && (
              <Card>
                <CardHeader>
                  <CardTitle>Generate Story Outline</CardTitle>
                  <CardDescription>
                    AI will create a complete chapter-wise outline based on your novel foundation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleGenerateOutline}
                    disabled={generating || !!novel.outline}
                    size="lg"
                    className="w-full"
                  >
                    {generating ? (
                      <>Generating Outline...</>
                    ) : (
                      <>
                        <FileText className="mr-2 h-5 w-5" />
                        Generate Complete Outline
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Outline Tab */}
          <TabsContent value="outline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Story Outline</CardTitle>
                <CardDescription>
                  Create a complete chapter-wise outline to guide your writing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {novel.outline ? (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm">{novel.outline}</pre>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No outline yet. Develop your idea first, then generate an outline.
                    </p>
                    {novel.genre && novel.centralConflict && (
                      <Button onClick={handleGenerateOutline} disabled={generating}>
                        {generating ? 'Generating...' : 'Generate Outline'}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chapters Tab */}
          <TabsContent value="chapters" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Chapter List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Chapters</CardTitle>
                    <Dialog open={isCreateChapterOpen} onOpenChange={setIsCreateChapterOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Chapter</DialogTitle>
                          <DialogDescription>
                            Start a new chapter for your novel
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="chapter-title">Chapter Title</Label>
                            <Input
                              id="chapter-title"
                              placeholder="Chapter {number} title..."
                              value={newChapterTitle}
                              onChange={(e) => setNewChapterTitle(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsCreateChapterOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateChapter}>Create Chapter</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    {chapters.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No chapters yet</p>
                        <p className="text-xs mt-1">Create an outline first</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {chapters.map((chapter) => (
                          <button
                            key={chapter.id}
                            onClick={() => handleSelectChapter(chapter)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              selectedChapter?.id === chapter.id
                                ? 'bg-primary/10 border-primary'
                                : 'hover:bg-muted/50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-xs">
                                    {chapter.chapterNumber}
                                  </Badge>
                                  <span className="font-medium text-sm truncate">
                                    {chapter.title || 'Untitled'}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {chapter.wordCount} words
                                </div>
                              </div>
                              <Badge
                                variant={chapter.status === 'completed' ? 'default' : 'secondary'}
                                className="text-xs shrink-0"
                              >
                                {chapter.status}
                              </Badge>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Chapter Editor */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  {selectedChapter ? (
                    <>
                      <CardTitle className="flex items-center gap-2">
                        Chapter {selectedChapter.chapterNumber}: {selectedChapter.title || 'Untitled'}
                      </CardTitle>
                      <CardDescription>
                        Use AI assistance or write manually. Your work is saved automatically.
                      </CardDescription>
                    </>
                  ) : (
                    <>
                      <CardTitle>Chapter Editor</CardTitle>
                      <CardDescription>
                        Select a chapter from the list to start writing
                      </CardDescription>
                    </>
                  )}
                </CardHeader>
                <CardContent>
                  {selectedChapter ? (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={handleGenerateChapter}
                          disabled={generatingChapter}
                          variant="outline"
                          className="flex-1"
                        >
                          {generatingChapter ? (
                            <>Generating...</>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              AI Generate
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={handleSaveChapter}
                          className="flex-1"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="chapter-content">Chapter Content</Label>
                        <Textarea
                          id="chapter-content"
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          placeholder="Start writing your chapter here..."
                          rows={20}
                          className="font-mono text-sm"
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          Word count: {editingContent.split(/\s+/).filter(w => w.length > 0).length}
                        </span>
                        {selectedChapter.aiGenerated && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            AI Generated
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <PenTool className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Select or create a chapter to start writing
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Characters Tab */}
          <TabsContent value="characters" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Characters</CardTitle>
                    <CardDescription>
                      Define and track your characters for story consistency
                    </CardDescription>
                  </div>
                  <Dialog open={isCreateCharacterOpen} onOpenChange={setIsCreateCharacterOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Character
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Character</DialogTitle>
                        <DialogDescription>
                          Add a character to help maintain consistency throughout your novel
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="char-name">Name *</Label>
                            <Input
                              id="char-name"
                              placeholder="Character name"
                              value={newCharacter.name}
                              onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="char-role">Role</Label>
                            <Input
                              id="char-role"
                              placeholder="Protagonist, Antagonist, Supporting..."
                              value={newCharacter.role}
                              onChange={(e) => setNewCharacter({ ...newCharacter, role: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="char-age">Age</Label>
                          <Input
                            id="char-age"
                            placeholder="Character age"
                            value={newCharacter.age}
                            onChange={(e) => setNewCharacter({ ...newCharacter, age: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="char-appearance">Physical Appearance</Label>
                          <Textarea
                            id="char-appearance"
                            placeholder="Describe the character's physical traits..."
                            value={newCharacter.physicalAppearance}
                            onChange={(e) => setNewCharacter({ ...newCharacter, physicalAppearance: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="char-personality">Personality Traits</Label>
                          <Textarea
                            id="char-personality"
                            placeholder="Describe personality, mannerisms, quirks..."
                            value={newCharacter.personalityTraits}
                            onChange={(e) => setNewCharacter({ ...newCharacter, personalityTraits: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="char-backstory">Backstory</Label>
                          <Textarea
                            id="char-backstory"
                            placeholder="Character's history and background..."
                            value={newCharacter.backstory}
                            onChange={(e) => setNewCharacter({ ...newCharacter, backstory: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="char-goals">Goals</Label>
                            <Textarea
                              id="char-goals"
                              placeholder="What does the character want?"
                              value={newCharacter.goals}
                              onChange={(e) => setNewCharacter({ ...newCharacter, goals: e.target.value })}
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="char-fears">Fears</Label>
                            <Textarea
                              id="char-fears"
                              placeholder="What are they afraid of?"
                              value={newCharacter.fears}
                              onChange={(e) => setNewCharacter({ ...newCharacter, fears: e.target.value })}
                              rows={2}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="char-relationships">Relationships</Label>
                          <Textarea
                            id="char-relationships"
                            placeholder="Connections to other characters..."
                            value={newCharacter.relationships}
                            onChange={(e) => setNewCharacter({ ...newCharacter, relationships: e.target.value })}
                            rows={2}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsCreateCharacterOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateCharacter} disabled={!newCharacter.name}>
                          Create Character
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {characters.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">
                      No characters yet
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Add characters to help maintain consistency and track their development
                    </p>
                    <Button onClick={() => setIsCreateCharacterOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Character
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {characters.map((character) => (
                      <Card key={character.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{character.name}</CardTitle>
                          {character.role && (
                            <Badge variant="secondary" className="w-fit mt-2">
                              {character.role}
                            </Badge>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            {character.age && (
                              <div>
                                <span className="text-muted-foreground">Age:</span>{' '}
                                <span className="font-medium">{character.age}</span>
                              </div>
                            )}
                            {character.goals && (
                              <div>
                                <span className="text-muted-foreground">Goal:</span>{' '}
                                <span className="font-medium line-clamp-1">{character.goals}</span>
                              </div>
                            )}
                            {character.personalityTraits && (
                              <div>
                                <span className="text-muted-foreground">Traits:</span>{' '}
                                <span className="font-medium line-clamp-2">{character.personalityTraits}</span>
                              </div>
                            )}
                          </div>
                          <Button variant="outline" className="w-full mt-4" size="sm">
                            <Edit className="mr-2 h-3 w-3" />
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Novel</CardTitle>
                <CardDescription>
                  Export your novel in professional formats for publishing or sharing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {chapters.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No chapters to export yet. Start writing chapters to enable export.
                    </p>
                    <Button onClick={() => fetchChapters()}>
                      Refresh Chapters
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="h-24 flex-col gap-2"
                        onClick={() => handleExport('txt')}
                      >
                        <FileText className="h-8 w-8" />
                        <span>Export as Text</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-24 flex-col gap-2 opacity-50 cursor-not-allowed"
                        disabled
                      >
                        <FileText className="h-8 w-8" />
                        <span>Export as DOCX (Coming Soon)</span>
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4 space-y-3">
                      <h3 className="font-semibold">Export Summary</h3>
                      <div className="grid md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Title:</span>{' '}
                          <span className="font-medium">{novel?.currentTitle || novel?.title || 'Untitled'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Chapters:</span>{' '}
                          <span className="font-medium">{chapters.length}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Words:</span>{' '}
                          <span className="font-medium">{novel?.totalWords?.toLocaleString() || 0}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Written Chapters:</span>{' '}
                          <span className="font-medium">
                            {chapters.filter(ch => ch.content && ch.content.trim().length > 0).length}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        <strong>Tip:</strong> Export your novel regularly to keep backups of your work.
                        The text export includes all chapters in proper order for easy reading or importing
                        into other writing tools.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto bg-background">
        <div className="container mx-auto px-4 py-6">
          <p className="text-sm text-muted-foreground text-center">
            © 2025 NovelForge. Your AI co-author for complete novels.
          </p>
        </div>
      </footer>
    </div>
  )
}
