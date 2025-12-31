'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, PenTool, Sparkles, Shield, Download, Bell, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">NovelForge</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm hover:text-primary transition-colors">How It Works</Link>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="h-4 w-4 mr-1" />
            AI-Powered Novel Writing
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Your AI Co-Author for<br />Complete Novels
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            A serious novel-writing system built for aspiring novelists and indie authors.
            Create coherent, compelling stories from idea to publication-ready manuscript.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/dashboard">
                Start Writing Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Cancel anytime
          </p>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Powerful Features for Serious Writers</h2>
            <p className="text-muted-foreground text-lg">Everything you need to craft your novel with AI assistance</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <PenTool className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Idea Development</CardTitle>
                <CardDescription>
                  Transform basic concepts into detailed story foundations with genre, themes, tone, and central conflict
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Smart Title Generation</CardTitle>
                <CardDescription>
                  Generate multiple market-ready titles that capture the essence of your story
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Structured Outlines</CardTitle>
                <CardDescription>
                  Create complete chapter-wise outlines with story arc, pacing, and key turning points
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Story Consistency Engine</CardTitle>
                <CardDescription>
                  Maintains internal memory for characters, relationships, timeline, and plot decisions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Chapter-by-Chapter Writing</CardTitle>
                <CardDescription>
                  Write one chapter at a time with full context awareness, ensuring narrative continuity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Export Ready</CardTitle>
                <CardDescription>
                  Export to PDF and DOCX formats suitable for self-publishing, editors, and beta readers
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="container mx-auto px-4 py-16 bg-muted/50 rounded-3xl my-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How NovelForge Works</h2>
            <p className="text-muted-foreground text-lg">Your journey from idea to published novel</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                step: 1,
                title: "Start with Your Idea",
                description: "Share a basic concept. Our AI expands it into a detailed foundation including genre, themes, tone, and central conflict."
              },
              {
                step: 2,
                title: "Generate Your Outline",
                description: "Create a complete chapter-wise outline that defines your story arc, pacing, key turning points, and chapter objectives."
              },
              {
                step: 3,
                title: "Write Chapter by Chapter",
                description: "Use AI assistance to write one chapter at a time. Each generation receives full novel context, ensuring no plot contradictions or character drift."
              },
              {
                step: 4,
                title: "Manage & Refine",
                description: "Review, edit, and save different versions. The Story Memory Engine maintains consistency across hundreds of pages."
              },
              {
                step: 5,
                title: "Export & Publish",
                description: "Export your completed novel in professional PDF or DOCX formats ready for self-publishing or submission."
              }
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">Ready to Write Your Novel?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of writers using NovelForge to bring their stories to life.
              Start for free today.
            </p>
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/dashboard">
                Create Your First Novel
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">NovelForge</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 NovelForge. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms</Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
