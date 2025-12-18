'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, PenTool, Sparkles, ArrowRight } from 'lucide-react'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  if (session) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">AetherWrite</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="container mx-auto px-6 py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                AetherWrite
              </h1>
            </div>
            <h2 className="text-2xl md:text-3xl text-muted-foreground mb-8">
              AI-Powered Fiction Novel Writing Platform
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Transform your creative ideas into compelling novels with our AI-powered writing tools. 
              From concept to completion, we're here to help you write your next masterpiece.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-3">
                  Start Writing Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Write Great Fiction</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive suite of AI-powered tools helps you at every stage of the writing process
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <PenTool className="h-12 w-12 text-primary mb-4" />
                <CardTitle>AI Novel Writer</CardTitle>
                <CardDescription>
                  Complete workflow from idea generation to finished novel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Idea development</li>
                  <li>• Title generation</li>
                  <li>• Chapter outlining</li>
                  <li>• AI-assisted writing</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Smart Organization</CardTitle>
                <CardDescription>
                  Keep your novels, characters, and world-building organized
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Novel management</li>
                  <li>• Chapter tracking</li>
                  <li>• Progress monitoring</li>
                  <li>• Auto-save functionality</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Sparkles className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Coming Soon Tools</CardTitle>
                <CardDescription>
                  More specialized writing tools on the way
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Short story writer</li>
                  <li>• Screenplay writer</li>
                  <li>• Character builder</li>
                  <li>• World builder</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 py-24">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="text-center py-16">
              <h2 className="text-3xl font-bold mb-4">Ready to Write Your Novel?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of writers using AI to bring their stories to life. 
                Start your novel today with our free writing tools.
              </p>
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-3">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AetherWrite</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 AetherWrite. Empowering writers with AI.
          </p>
        </div>
      </footer>
    </div>
  )
}