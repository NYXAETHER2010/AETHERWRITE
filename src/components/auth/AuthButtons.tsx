'use client'

import { useAuth, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { BookOpen, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function AuthButtons() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-4">
        <Button variant="outline" disabled>Loading...</Button>
        <Button disabled>Get Started</Button>
      </div>
    )
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        <UserButton afterSignOutUrl="/" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" asChild>
        <Link href="/sign-in">Sign In</Link>
      </Button>
      <Button asChild>
        <Link href="/sign-in">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}

export function NavbarAuth() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return null

  if (isSignedIn) {
    return (
      <nav className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/settings">Settings</Link>
        </Button>
        <UserButton afterSignOutUrl="/">
          <Button>Sign Out</Button>
        </UserButton>
      </nav>
    )
  }

  return null
}
