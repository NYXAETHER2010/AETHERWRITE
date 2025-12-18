'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, PenTool, Users, Map, FileText, MessageSquare, Image, Plus } from 'lucide-react'
import { db } from '@/lib/db'

interface Novel {
  id: string
  title: string | null
  genre: string | null
  updatedAt: Date
  _count: {
    chapters: number
  }
}

const tools = [
  {
    title: 'AI Novel Writer',
    description: 'Complete novel writing workflow from idea to finished book',
    icon: BookOpen,
    href: '/tools/novel-writer/idea',
    status: 'live' as const,
    color: 'bg-emerald-500'
  },
  {
    title: 'Short Story Writer',
    description: 'Craft compelling short stories with AI assistance',
    icon: PenTool,
    href: '/tools/short-story-writer',
    status: 'coming-soon' as const,
    color: 'bg-blue-500'
  },
  {
    title: 'Screenplay Writer',
    description: 'Write professional screenplays in standard format',
    icon: FileText,
    href: '/tools/screenplay-writer',
    status: 'coming-soon' as const,
    color: 'bg-purple-500'
  },
  {
    title: 'Manga Script Writer',
    description: 'Create engaging manga scripts with panel descriptions',
    icon: MessageSquare,
    href: '/tools/manga-script-writer',
    status: 'coming-soon' as const,
    color: 'bg-pink-500'
  },
  {
    title: 'Poetry Generator',
    description: 'Generate beautiful poetry in various styles',
    icon: PenTool,
    href: '/tools/poetry-generator',
    status: 'coming-soon' as const,
    color: 'bg-indigo-500'
  },
  {
    title: 'Character Builder',
    description: 'Develop deep, compelling characters for your stories',
    icon: Users,
    href: '/tools/character-builder',
    status: 'coming-soon' as const,
    color: 'bg-orange-500'
  },
  {
    title: 'World Builder',
    description: 'Create rich, immersive worlds for your fiction',
    icon: Map,
    href: '/tools/world-builder',
    status: 'coming-soon' as const,
    color: 'bg-teal-500'
  },
  {
    title: 'Cover Art Generator',
    description: 'Generate stunning cover art concepts',
    icon: Image,
    href: '/tools/cover-art-generator',
    status: 'coming-soon' as const,
    color: 'bg-red-500'
  }
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [novels, setNovels] = useState<Novel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }

    fetchNovels()
  }, [session, status, router])

  const fetchNovels = async () => {
    try {
      const response = await fetch('/api/novels')
      if (response.ok) {
        const data = await response.json()
        setNovels(data)
      }
    } catch (error) {
      console.error('Failed to fetch novels:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {session?.user?.name}
          </h1>
          <p className="text-muted-foreground">
            Choose a tool to start creating or continue your work
          </p>
        </div>

        {/* Tools Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Writing Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Card key={tool.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href={tool.href}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${tool.color} bg-opacity-10`}>
                        <tool.icon className={`h-6 w-6 ${tool.color.replace('bg-', 'text-')}`} />
                      </div>
                      {tool.status === 'live' ? (
                        <Badge variant="default" className="bg-emerald-500">
                          Live
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Coming Soon</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* My Novels */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">My Novels</h2>
            <Link href="/tools/novel-writer/idea">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Novel
              </Button>
            </Link>
          </div>
          
          {novels.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No novels yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start your first novel with our AI-powered writing tools
                </p>
                <Link href="/tools/novel-writer/idea">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Novel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {novels.map((novel) => (
                <Card key={novel.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">
                          {novel.title || 'Untitled Novel'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {novel.genre && <span>{novel.genre}</span>}
                          <span>{novel._count.chapters} chapters</span>
                          <span>Last edited {new Date(novel.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/novels/${novel.id}`}>
                          <Button variant="outline">View</Button>
                        </Link>
                        <Link href={`/tools/novel-writer/write?novel_id=${novel.id}`}>
                          <Button>Continue Writing</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}