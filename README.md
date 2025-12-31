# 📖 NovelForge - AI-Powered Novel Writing Platform

<div align="center">

**A serious novel-writing system built for aspiring novelists and indie authors**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.11.1-2D3791)](https://prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE.md)

[Features](#-features) • [Quick Start](#-quick-start) • [Installation](#-installation) • [Documentation](#-documentation) • [API](#-api-routes) • [Architecture](#-architecture)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [How It Works](#-how-it-works)
- [Detailed Documentation](#-detailed-documentation)
- [API Routes](#-api-routes)
- [Database Schema](#-database-schema)
- [Architecture](#-architecture)
- [Development Workflow](#-development-workflow)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 Overview

NovelForge is a comprehensive AI-assisted novel writing platform designed for writers who want to create complete, coherent novels rather than fragmented AI-generated text. The platform acts as an AI co-author, helping writers ideate, structure, write, and finalize novels while preserving narrative consistency, character integrity, and authorial control.

### 🎯 Core Philosophy

**"The AI supports the writer — it does not replace the writer."**

NovelForge is built on the principle that:
- Writers maintain creative control
- AI provides assistance and generation
- Story consistency is enforced across hundreds of pages
- The narrative flows naturally without contradictions
- The author's vision is always preserved

### 👥 Target Users

- **Aspiring Novelists**: First-time authors learning the craft
- **Indie Authors**: Self-publishing authors managing multiple projects
- **Long-form Storytellers**: Writers working on full-length narratives (50,000+ words)
- **Beta Readers & Editors**: Collaborators reviewing manuscript drafts
- **Writing Teams**: Groups collaborating on shared projects

### 🚀 What Makes NovelForge Different

Unlike AI writing tools that generate short, disconnected content, NovelForge focuses on **long-form narrative coherence**:

| Feature | Traditional AI Tools | NovelForge |
|----------|---------------------|------------|
| Content Generation | Short snippets, single prompts | Chapter-by-chapter with full context |
| Story Memory | None | Automatic tracking of characters, plot, settings, timeline |
| Consistency | Random across generations | Engine maintains narrative coherence |
| Control | AI-driven | Writer maintains final say |
| Output | Fragmented | Complete, publication-ready manuscripts |

---

## ✨ Features

### 🧠 Story Memory Consistency Engine

**The brain behind your novel that remembers everything**

NovelForge automatically tracks and maintains narrative consistency across hundreds of pages:

**What It Tracks:**
- **Characters**: Names, traits, backstories, goals, relationships
- **Plot Points**: Key story events, turning points, revelations
- **Settings**: Locations, environments, world-building details
- **Timeline**: Chronological events, temporal relationships
- **Character Arcs**: Development arcs and emotional journeys
- **Relationships**: How characters interact and evolve

**How It Works:**
1. **Automatic Extraction**: As you write, AI analyzes each chapter to extract:
   - New character introductions
   - Plot developments
   - Setting descriptions
   - Timeline events
   - Relationship changes

2. **Context Storage**: All extracted elements are stored in the database with:
   - Chapter references (where did this appear?)
   - Importance levels (low, normal, high)
   - Type categories (plot_point, relationship, character_arc, setting, timeline)

3. **Consistency Checking**: Before each new chapter generation:
   - The engine retrieves all existing story memory
   - Checks for contradictions (e.g., "hated character suddenly friends")
   - Flags potential issues for review
   - Generates a comprehensive context prompt for AI

4. **AI Context Prompt**: Generates a detailed prompt including:
   ```
   NOVEL TITLE: [Title]
   GENRE: [Genre]
   THEMES: [Themes]
   TONE: [Tone]
   CENTRAL CONFLICT: [Conflict]
   
   CHARACTERS:
   - [Name] ([Role]): [Traits]
     Backstory: [Background]
     Goals: [Motivations]
     Relationships: [With other characters]
   
   PREVIOUS CHAPTERS:
   - Chapter 1: [Summary] - [Objectives]
   - Chapter 2: [Summary] - [Objectives]
   ...
   
   IMPORTANT PLOT POINTS:
   - [Recent plot developments]
   
   TIMELINE OF EVENTS:
   - [Chronological story events]
   
   MAINTAIN CONSISTENCY WITH ALL INFORMATION ABOVE.
   ```

**Benefits:**
- ✅ **No Character Drift**: Characters stay consistent from Chapter 1 to the end
- ✅ **No Plot Holes**: Story memory ensures all plot threads are addressed
- ✅ **Setting Consistency**: Locations and environments remain stable
- ✅ **Relationship Integrity**: Character interactions don't contradict established patterns
- ✅ **AI Context**: Each AI generation has full understanding of your story

**Usage:**
```typescript
// Automatic (happens when chapters are saved)
await storyMemoryEngine.extractAndStoreMemory(novelId, chapterId, chapterContent, chapterNumber)

// Manual (add specific story memory)
await storyMemoryEngine.updateCharacterArc(novelId, 'Hero discovers truth about past')

// Get context for AI generation
const context = await storyMemoryEngine.getChapterGenerationContext(novelId, chapterNumber)
const prompt = storyMemoryEngine.generateContextPrompt(context, novel, previousChapters)

// Check for consistency issues
const issues = await storyMemoryEngine.checkConsistency(novelId)
```

---

### 💾 Auto-Save with Version Control

**Never lose your work again - safe experimentation with complete history**

NovelForge provides robust version control specifically designed for writers:

**Auto-Save Feature:**
- **Automatic Saving**: Content is saved as you type (configurable)
- **Silent Saves**: Non-intrusive background saving
- **Interval-based**: Also saves at regular intervals (e.g., every 30 seconds)
- **Conflict Detection**: Warns if multiple users edit simultaneously

**Version Snapshots:**
- **Manual Snapshots**: Create named versions of your chapter at any time
- **Automatic Versions**: Created when significant changes are detected (e.g., 500+ words added)
- **Version Labels**: Custom labels like "Draft 1", "First complete version", "Beta reader feedback version"
- **Timestamps**: Every version has a creation date for easy reference

**Version History:**
- **Complete Timeline**: See all versions of each chapter
- **Comparison**: Compare any two versions to see what changed
- **Word Count Tracking**: See word count changes between versions
- **Restore Anytime**: Go back to any previous version with one click
- **Automatic Backup**: Before restoring, creates a backup of current state

**Version Types:**
- **Snapshots**: Manually created, explicitly named versions
- **Auto-Versions**: Automatically created when significant content is added
- **Backup Versions**: Created automatically before restore operations

**Storage & Cleanup:**
- **Smart Retention**: Keeps last 50 auto-versions per chapter
- **Snapshots Never Deleted**: Manual snapshots are permanent unless explicitly deleted
- **Storage Efficient**: Uses database storage, no file system bloat

**Usage:**
```typescript
// Auto-save happens automatically
await versionControl.autoSaveChapter(chapterId, content)

// Create manual snapshot
await versionControl.createSnapshot(chapterId, "After major rewrite")

// Get version history
const versions = await versionControl.getChapterVersions(chapterId)

// Compare versions
const comparison = await versionControl.compareVersions(version1Id, version2Id)
// Returns: version1, version2, wordCountDiff

// Restore previous version
await versionControl.restoreVersion(versionId)

// Get statistics
const stats = await versionControl.getNovelVersionStats(novelId)
// Returns: { totalVersions, totalSnapshots, chaptersWithVersions }
```

**Version Control in the UI:**
1. **Version List Panel**: See all versions with:
   - Timestamp
   - Version label
   - Word count
   - Type indicator (snapshot/auto/backup)

2. **Version Comparison**: Side-by-side view of two versions showing:
   - Content differences
   - Word count delta
   - Visual highlighting of changes

3. **One-Click Restore**: Restore any version instantly with automatic backup

4. **Version Actions**:
   - Delete unwanted versions
   - Rename versions
   - Create new snapshot from any version

---

### 📤 PDF/DOCX Export Integration

**Export your novel in publication-ready formats**

NovelForge supports exporting your complete novels or individual chapters in formats ready for:
- **Self-publishing**: Amazon KDP, Barnes & Noble Press, Apple Books
- **Traditional Publishing**: Send to literary agents and publishers
- **Beta Readers**: Share with early readers for feedback
- **Print Preparation**: Ready for print-on-demand services
- **Archival**: Long-term storage in standard formats

**Supported Formats:**
- **Markdown (.md)**: Universal format, easily convertible
- **Plain Text (.txt)**: Simple text without formatting
- **PDF (.pdf)**: Professional publishing format (via PDF skill integration)
- **DOCX (.docx)**: Microsoft Word compatible (via DOCX skill integration)

**Export Content:**
- **Title Page**: Novel title, author information
- **Metadata**: Genre, themes, word count, chapter count, export date
- **Table of Contents**: Auto-generated chapter list
- **Chapter Formatting**:
  - Chapter headers with numbers and titles
  - Proper spacing and indentation
  - Scene breaks preserved
- **Footer**: Page numbers, copyright notice

**Export Options:**
- **Complete Novel**: Export all chapters with front matter and metadata
- **Single Chapter**: Export individual chapters (useful for beta readers)
- **Include/Exclude**: Choose to include or exclude:
  - Character profiles
  - Story summaries
  - Author notes
- **Format Selection**: Choose your preferred output format

**Novel Export Statistics:**
Before exporting, view comprehensive statistics:
- **Total Words**: Complete word count
- **Total Chapters**: Number of chapters
- **Estimated Pages**: Based on standard word-per-page (300 words/page)
- **Estimated Reading Time**: Based on average reading speed (200 words/minute)
- **Chapter Breakdown**: Words per chapter for consistency checking

**Usage:**
```typescript
// Export complete novel as PDF
const response = await fetch('/api/novels/[id]/export', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ format: 'pdf' })
})
// Returns file download

// Export complete novel as DOCX
const response = await fetch('/api/novels/[id]/export', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ format: 'docx' })
})

// Export single chapter
const stats = await exportService.getExportStats(novelId)
// Returns: { wordCount, chapterCount, estimatedPages, estimatedReadingTime }
```

**File Naming Convention:**
Exports use clean, filename-safe names:
```
novel-title-v1.0.md
your-novel-chapter-1.pdf
working-title-v2.docx
```

---

### 🔔 Notification System

**Stay informed of your progress and AI generation events**

NovelForge keeps you updated with timely, relevant notifications about your novel-writing journey.

**Notification Types:**

#### 📝 Generation Complete
Fires when AI finishes generating content:
- Idea development complete
- Titles generated
- Outline created
- Chapter content generated

**Example:**
```
✨ Idea Development Complete
Your novel "The Last Library" has been developed with genre, themes, and central conflict.
```

#### 🎯 Milestones Reached
Celebrate your progress with milestone notifications:
- **Word Count Milestones**:
  - 10,000 words (novella length)
  - 25,000 words (short novel)
  - 50,000 words (standard novel)
  - 75,000 words (long novel)
  - 100,000 words (epic length)
  
- **Chapter Milestones**:
  - 5 chapters completed
  - 10 chapters completed
  - 20 chapters completed
  - 30 chapters completed
  - 50 chapters completed

**Example:**
```
🎉 Congratulations! 50,000 words reached!
Great job! You've reached a significant milestone in "The Last Library".
```

#### 📖 Chapter Completed
Notified when each chapter is marked as complete:
- Chapter number and title
- Word count
- Previous chapter completion (for tracking progress)

**Example:**
```
📝 Chapter 12 Completed
Congratulations! You've completed Chapter 12 of "The Last Library" with 3,245 words.
```

#### 🏗 Version Created
Notified when you create a new version snapshot:
- Chapter reference
- Version label
- Confirmation that your work is safely saved

**Example:**
```
💾 Version Snapshot Created
A version snapshot has been created for Chapter 5.
Your work is safely saved.
```

#### ⚙ System Updates
Platform announcements and feature updates:
- New feature releases
- Important bug fixes
- Maintenance notifications
- Platform improvements

**Example:**
```
⚙ System Update
NovelForge v2.0 is now available with enhanced AI context generation!
```

**Notification Management:**

**In-App Notifications:**
- **Notification Bell**: Badge showing unread count in header
- **Notification Panel**: Slide-out panel showing all notifications
- **Smart Grouping**: Notifications grouped by type and time
- **Quick Actions**: Mark as read, delete, go to relevant content
- **Auto-Mark as Read**: Mark as read when clicking through to content

**Notification States:**
- **Unread**: Bold, prominent display
- **Read**: Dimmed, normal display
- **Clicking**: Opens relevant novel/chapter/page
- **Dismissing**: Removes from view (soft delete)

**Notification Center (Settings Page):**
View all notifications in one place with:
- **Filter by Type**: Show only generation, milestone, or system notifications
- **Date Navigation**: Jump to specific time periods
- **Bulk Actions**: Mark all as read, clear read notifications
- **Notification Preferences**: Configure what you want to be notified about

**Email Notifications (Optional):**
- **Daily Digest**: Summary of activity
- **Immediate Alerts**: Important notifications sent instantly
- **Weekly Progress**: Your writing progress over the week
- **Configurable**: Turn on/off per notification type

**Usage:**
```typescript
// Get all notifications (including read)
const notifications = await notificationService.getUserNotifications(userId)

// Get only unread notifications
const unread = await notificationService.getUserNotifications(userId, true)

// Get unread count
const count = await notificationService.getUnreadCount(userId)

// Mark notification as read
await notificationService.markAsRead(notificationId)

// Mark all as read
await notificationService.markAllAsRead(userId)

// Clear all read notifications
await notificationService.clearReadNotifications(userId)

// Create custom notification
await notificationService.notify.chapterCompleted(userId, novelId, 'My Novel', 5, 3421)

// Check and notify milestones (automatic)
await notificationService.checkAndNotifyMilestones(userId, novelId)
// Automatically checks word count and chapter milestones
```

**Notification Templates:**
All common events have pre-built notification templates:
```typescript
// Idea development
notificationService.notify.ideaDeveloped(userId, novelId, 'My Novel')

// Titles generated  
notificationService.notify.titlesGenerated(userId, novelId, 'My Novel')

// Outline generated
notificationService.notify.outlineGenerated(userId, novelId, 'My Novel', 10)

// Chapter completed
notificationService.notify.chapterCompleted(userId, novelId, 'My Novel', 1, 3500)

// Milestone reached
notificationService.notify.milestoneReached(userId, novelId, 'My Novel', '50,000 words!')

// Novel completed
notificationService.notify.novelCompleted(userId, novelId, 'My Novel', 80000, 24)

// Version created
notificationService.notify.versionCreated(userId, novelId, 'My Novel')

// Consistency warning
notificationService.notify.consistencyWarning(userId, novelId, 'My Novel', 3)
```

---

### 🔐 User Authentication (Clerk)

**Secure, frictionless authentication powered by Clerk**

NovelForge uses Clerk for all authentication needs, providing:
- **Email/Password Sign-in**: Traditional authentication
- **Social Sign-in**: Google, GitHub, and more (configurable)
- **Magic Links**: Passwordless sign-in via email
- **Sign-up Flow**: Easy new user registration
- **Email Verification**: Confirm email ownership
- **Password Reset**: Self-service password recovery
- **Two-Factor Authentication**: Optional extra security layer
- **Session Management**: Persistent, secure sessions
- **User Profiles**: Rich user data including name, email, avatar

**Authentication Flow:**

1. **Landing Page**:
   - "Sign In" button (takes you to sign-in page)
   - "Get Started" button (same as sign in for new users)
   - Auth state is managed globally

2. **Sign-In Page** (`/sign-in`):
   - Clean, focused sign-in form
   - Social authentication options
   - Magic link option
   - Redirect to sign-up
   - "Back to Home" link
   - Clerk components handle all authentication UI

3. **Protected Routes**:
   - All pages requiring authentication are automatically protected
   - Unauthenticated users are redirected to `/sign-in`
   - Redirect URL preserves destination (return after sign-in to intended page)
   - Dashboard, novel workspace, and settings are protected

4. **User Profile**:
   - UserButton component provides avatar, account menu
   - Sign out with confirmation
   - Account settings link
   - Display user name and email

**Middleware Protection:**

The middleware (`src/middleware.ts`) protects all application routes:
```typescript
// Routes that require authentication
// All app routes except landing and sign-in are protected

// Redirect behavior:
// - Not authenticated → redirect to /sign-in
// - Authenticated user on public route → redirect to /dashboard

// Protected routes:
// /dashboard/*
// /novel/*
// /settings/*
```

**Usage in Components:**

```typescript
// Get current user state
const { isSignedIn, user, userId } = useAuth()

// Check authentication status
const isLoaded = isLoaded // Clerk has loaded auth state

// Get user information
const name = `${user.firstName} ${user.lastName}`
const email = user.primaryEmailAddress.emailAddress
const avatar = user.imageUrl

// Sign out component
<SignOutButton signOutUrl="/">
  Sign Out
</SignOutButton>

// User button with dropdown
<UserButton afterSignOutUrl="/" />

// Sign in component
<SignInButton mode="modal">
  Sign In
</SignInButton>
<SignInButton mode="modal" redirectUrl="/dashboard">
  Get Started
</SignInButton>
```

**Protected API Routes:**
All API routes requiring user ID can access Clerk authentication:
```typescript
// Get authenticated user ID in server components
import { auth } from '@clerk/nextjs/server'
const { userId } = auth()

// In middleware
const { userId } = await auth() // Get user ID
```

---

### ⚙️ User Settings Page

**Complete control over your NovelForge experience**

The settings page (`/settings`) provides comprehensive configuration options organized into four main tabs:

### 👤 Profile Tab

**User Information Display:**
- **Avatar**: Profile picture (managed through Clerk)
- **Name**: Full name display
- **Email**: Email address with verification status
- **Join Date**: When account was created

**Profile Management:**
- **Clerk Integration**: Links to Clerk account for:
  - Password changes
  - Email updates
  - Two-factor authentication setup
  - Personal information
  - Connected accounts (social logins)
- **Read-Only Fields**: Display-only in app (manage in Clerk)

### 🎨 Preferences Tab

**App Appearance:**
- **Theme Selection**:
  - **Light**: Clean, bright interface
  - **Dark**: Easy on the eyes interface
  - **System**: Follows device/system preference
- **Language**: Choose interface language
  - English, Spanish, French, German, Chinese
  - Affects UI labels and date formats

**Editor Settings:**
- **Auto-Save Toggle**: Enable/disable automatic saving
- **Auto-Save Interval**: How frequently to save (30s, 60s, 120s)
- **Word Count Display**: Show/hide live word count
- **Typing Feedback**: Visual or sound feedback

**Writing Experience:**
- **Default Font**: Choose your preferred writing font
- **Font Size**: Adjust for comfort
- **Line Spacing**: Single, 1.5, or double
- **Paragraph Spacing**: Before and after paragraph options

### 🔔 Notifications Tab

**Notification Channels:**
- **In-App Notifications**: Show in the app notification center
- **Email Notifications**: Send notifications via email
  - **Immediate**: Important alerts instantly
  - **Daily Digest**: Summary at end of day
  - **Weekly Summary**: Progress report once per week

**Notification Types (configure each):**
- **AI Generation Complete**: Notify when AI finishes generating
  - Titles, outline, chapter content
- **Milestones**: Celebrate word count and chapter achievements
  - Every 10,000 words
  - Every 5 chapters
  - Novel completion
- **Chapter Progress**: When chapters are marked complete
- **Version Updates**: When snapshots are created
- **System Updates**: Platform news and feature announcements
- **Consistency Issues**: When story memory detects potential contradictions

**Notification Preferences:**
- **Quiet Mode**: Disable all notifications temporarily
- **Focus Mode**: Minimize distractions during writing sessions
- **Do Not Disturb**: Suspend non-critical notifications
- **Schedule**: Choose quiet hours (e.g., 10 PM - 8 AM)

### 🛡️ Security Tab

**Account Security:**
- **Email Verification Status**: Shows if email is verified
- **Password Management**: Link to Clerk for password changes
- **Two-Factor Authentication**: Enable/disable and manage 2FA
- **Active Sessions**: View and manage logged-in sessions
- **Sign Out All Devices**: Emergency sign-out from all devices

**Data Management:**
- **Export My Data**: Download all your data in machine-readable format
  - Includes novels, chapters, characters, settings
  - JSON or CSV format
- **Import Data**: Restore from backup
- **Delete Account**: Permanent account deletion with:
  - Confirmation dialog
  - Warning about data loss
  - Option to download data before deletion

**Privacy Settings:**
- **Profile Visibility**: Control who can see your profile
- **Novel Privacy**: Set novels as private or shareable
- **Beta Reader Access**: Grant specific users access to drafts
- **Analytics**: Control whether anonymous usage data is collected

### 💾 Data Management

**Storage Management:**
- **Storage Quota**: View your total and used storage
- **Storage Breakdown**: How much is used by:
  - Novel content
  - Version history
  - Character profiles
  - Story memory
- **Cleanup Tools**: Mass delete old versions, clear unused data

**Settings Persistence:**
- All settings are saved to database
- Instant application-wide availability
- Settings cache for quick access
- Automatic sync across devices (same account)

**Usage:**
```typescript
// Access user data
const { user } = useAuth()
const userId = user.id
const email = user.primaryEmailAddress?.emailAddress
const name = `${user.firstName} ${user.lastName}`

// Get user settings
const settings = await getUserSettings(userId)

// Update settings
const updated = await updateUserSettings(userId, {
  theme: 'dark',
  autoSave: true,
  emailNotifications: false
})

// Save settings
await fetch('/api/settings', {
  method: 'PUT',
  body: JSON.stringify(settings)
})
```

---

## 🛠️ Tech Stack

### Core Framework
- **Next.js 15.3.5**: React framework with App Router
- **TypeScript 5.0**: Type-safe development
- **React 19.0**: UI library

### Styling & UI
- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui**: Component library with Radix UI primitives
- **Lucide React**: Icon library (600+ icons)
- **Framer Motion 12.23.2**: Animations and transitions

### Database & ORM
- **Prisma 6.11.1**: Type-safe ORM
- **SQLite**: Embedded database (custom.db)
- **Prisma Client**: Database query client

### Authentication
- **Clerk Next.js 6.36.5**: Authentication and user management
- **@clerk/nextjs**: Clerk React SDK

### State Management
- **React Hooks**: useState, useEffect for local state
- **Zustand 5.0.6**: Global client state

### API Integration
- **z-ai-web-dev-sdk 0.0.15**: AI services SDK
  - LLM for text generation
  - Image generation capabilities
  - Video generation capabilities
  - ASR for speech-to-text

### Form Handling
- **React Hook Form 7.60.0**: Form state management
- **Zod 4.0.2**: Schema validation

### Development Tools
- **ESLint 9**: Code quality and consistency
- **TypeScript 5**: Type checking
- **Bun**: Fast JavaScript runtime and package manager

### File Processing
- **Skills-based Export**: PDF and DOCX generation capabilities
- **Markdown Support**: Universal text format

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun 1.0+
- npm or bun package manager
- Git (for cloning)

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NYXAETHER2010/AETHERWRITE.git
   cd AETHERWRITE
   ```

2. **Install dependencies:**
   ```bash
   # Using npm
   npm install
   
   # Using bun (recommended - faster)
   bun install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root:
   ```env
   DATABASE_URL="file:./db/custom.db"
   
   # Clerk environment variables (get from Clerk dashboard)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."
   
   # z-ai-web-dev-sdk (if using AI features)
   Z_AI_SDK_KEY="your_sdk_key"
   ```

4. **Initialize the database:**
   ```bash
   bun run db:push
   ```

5. **Start the development server:**
   ```bash
   bun run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000`

### First-Time Setup

1. **Create an account:**
   - Click "Get Started" or "Sign In"
   - Choose sign-up method (email or social)
   - Verify your email
   - Set up your profile

2. **Create your first novel:**
   - Navigate to Dashboard
   - Click "New Novel"
   - Enter a working title
   - Add optional description

3. **Develop your idea:**
   - Open your novel workspace
   - Go to "Idea" tab
   - Enter your basic concept
   - Click "Develop Novel Foundation"
   - AI generates: genre, themes, tone, conflict, ending

4. **Generate titles:**
   - Click "Generate Title Options"
   - AI creates 10 market-ready titles
   - Select your favorite
   - Set as your novel's title

5. **Create an outline:**
   - Click "Generate Complete Outline"
   - AI creates chapter-by-chapter outline
   - Review and adjust if needed
   - Set the number of chapters

6. **Start writing chapters:**
   - Go to "Chapters" tab
   - Create your first chapter
   - Use AI assistance for content generation
   - Story memory ensures consistency across chapters

---

## 🔧 Installation

### Development Dependencies

```bash
# Install all dependencies
bun install
```

**Key packages:**
- `next@15.3.5` - Framework
- `react@19.0.0` - UI library
- `@clerk/nextjs@6.36.5` - Authentication
- `prisma@6.11.1` - Database ORM
- `tailwindcss@4` - Styling
- `z-ai-web-dev-sdk@0.0.15` - AI SDK

### Database Setup

**Initialize Prisma:**
```bash
# Generate Prisma client
bun run db:generate
```

**Create and push schema:**
```bash
# Push schema to database
bun run db:push
```

**Database location:**
- SQLite database: `db/custom.db`
- Automatic creation on first run
- Schema defined in `prisma/schema.prisma`

### Clerk Authentication Setup

1. **Create a Clerk application:**
   - Go to https://dashboard.clerk.com
   - Create new application
   - Choose "Next.js" as framework
   - Select authentication methods (email, social, etc.)
   - Configure allowed origins: `http://localhost:3000`

2. **Get API keys:**
   - **Publishable Key**: Found in Clerk dashboard (starts with `pk_`)
   - **Secret Key**: Found in Clerk dashboard (starts with `sk_`)
   - Copy both keys to `.env.local`

3. **Configure environment variables:**
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxx
   CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxx
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   ```

4. **Update Clerk components:**
   The `AuthButtons.tsx` and sign-in page are pre-configured with Clerk components:
   - `<SignIn />` component
   - `<SignUp />` component
   - `<UserButton />` component
   - `useAuth()` hook

### Running the Project

**Development mode:**
```bash
bun run dev
# Starts at http://localhost:3000
# Hot module reload enabled
```

**Production build:**
```bash
bun run build
# Creates optimized production build in .next directory
```

**Production start:**
```bash
bun run start
# Runs production build (uses Node.js runtime)
```

**Linting:**
```bash
bun run lint
# Runs ESLint to check code quality
```

### Environment Variables Reference

Required environment variables (create `.env.local`):

```env
# Database
DATABASE_URL="file:./db/custom.db"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# z-ai-web-dev-sdk (for AI features)
Z_AI_SDK_KEY="your_z_ai_sdk_key"
```

---

## 📖 How It Works

### The NovelForge Writing Workflow

NovelForge follows a structured, linear workflow that guides you from initial idea to published manuscript:

### Phase 1: Ideation 💡

**Goal**: Transform a vague concept into a concrete foundation.

**Process:**
1. **Input Your Idea**: Enter a basic concept (1-2 sentences)
   ```
   "A woman discovers her late father's unfinished manuscript in his attic."
   ```

2. **AI Analysis**: AI analyzes your idea and expands it into:
   - **Genre**: The type of story (e.g., Literary Fiction, Mystery, Fantasy)
   - **Themes**: Central themes and motifs (e.g., Loss, Memory, Truth)
   - **Tone**: The emotional and writing style (e.g., Contemplative, Hopeful)
   - **Central Conflict**: The core problem of the story
   - **Directional Ending**: How the story should resolve

3. **Foundation Storage**: All generated elements are saved to the novel record
4. **Review**: You can see and edit each element before proceeding

**Example Output:**
```
Genre: Literary Fiction
Themes: Loss and grief, The search for meaning, Family secrets, Redemption
Tone: Contemplative, Emotional, Hopeful
Central Conflict: A woman must decide whether to complete her late father's unfinished manuscript or preserve his legacy as-is, while uncovering family secrets that challenge everything she thought she knew about him.
Directional Ending: The protagonist completes the manuscript in her own voice, finding closure and understanding that honoring her father's legacy means both respecting his work and adding her own truth to the story.
```

### Phase 2: Title Generation ✍️

**Goal**: Choose the perfect title for your novel.

**Process:**
1. **AI Generates Options**: Based on your story foundation, AI creates 10 title options
   - Each title is market-ready
   - Titles capture the essence of your story
   - Different tones and styles are represented

2. **Review Options**: See all 10 titles in a list
   - No commitment yet—just browsing
   - Titles show genre-appropriate style

3. **Select Your Favorite**: Click the title you love most
   - Sets as your novel's official title
   - Previous working title is preserved if you change your mind

**Example Titles for Literary Fiction:**
```
1. The Unfinished Manuscript
2. Words Between Pages
3. Her Father's Legacy
4. Finding the Ending
5. The Ink of Memory
6. Beyond the Final Chapter
7. A Daughter's Promise
8. Echoes in the Margins
9. The Last Storyteller
10. Completing the Book
```

### Phase 3: Outline Creation 📝

**Goal**: Create a complete chapter-wise roadmap for your novel.

**Process:**
1. **AI Generates Outline**: Using:
   - Story foundation (genre, themes, tone)
   - Central conflict
   - Directional ending
   - Your word count target (if specified)

2. **Structure Creation**: AI creates:
   - **Chapter Count**: Appropriate for your genre and concept (e.g., 10-20 chapters)
   - **Story Arc**: Beginning, middle, climax, resolution
   - **Pacing**: Where turning points occur
   - **Chapter Objectives**: What each chapter should accomplish

3. **Review and Edit**: Read through the outline
   - Add your own notes
   - Restructure chapters if needed
   - Add or remove plot points

4. **Set Chapter Count**: Confirms the total number of chapters
   - Each chapter gets a number
   - Can add more chapters later

**Example Outline Structure:**
```
Chapter 1: The Discovery
- Protagonist receives package containing her late father's unfinished manuscript
- Flashbacks to her childhood memories of him writing
- Initial reluctance to read the manuscript
- Opening the package and beginning to read

Chapter 2: First Words
- Reading the first chapters and being transported back in time
- Memories of her father's study come flooding back
- Realizing how little she knew about his writing process
- Finding notes in the margins that puzzle her

Chapter 3: The Hidden Notes
- Discovering cryptic references in the manuscript
- A mysterious letter tucked between pages 45 and 46
- First hint that there's more to the story
- Decision to investigate further

...and so on through Chapter 10
```

### Phase 4: Chapter-by-Chapter Writing ✍️

**Goal**: Write your novel one chapter at a time with full narrative awareness.

**The Writing Process for Each Chapter:**

1. **Select Chapter**: Choose which chapter to write
2. **AI Generation Request**: AI receives:
   - **Complete Novel Concept**: Title, genre, themes, tone, conflict, ending
   - **Full Outline**: All chapters with summaries and objectives
   - **Previous Chapters**: Summaries of all chapters written so far
   - **Story Memory**: All characters, plot points, settings, relationships, timeline
   - **Current Chapter Context**: What happened in previous chapters
3. **AI Generates Content**: Creates chapter content that:
   - Continues the story naturally
   - Maintains character consistency
   - Respects established settings and timeline
   - Moves toward chapter objectives
   - Matches the agreed tone and style
4. **Review and Edit**: Read through AI-generated content
   - Make changes, add your own writing
   - Adjust dialogue, descriptions, pacing
5. **Auto-Save**: Changes are automatically saved with version tracking
6. **Mark Complete**: When satisfied, mark chapter as complete

**How Story Memory Ensures Consistency:**

**Character Consistency:**
- When generating Chapter 5, AI knows:
  - All characters introduced in Chapters 1-4
  - Their traits, goals, backstories
  - Their relationships and current dynamics
  - No character suddenly has different personality

**Setting Consistency:**
- When describing the protagonist's hometown in Chapter 6:
  - AI references the setting established in Chapter 1
  - Maintains geographic consistency
  - Doesn't suddenly change climate or architecture

**Plot Consistency:**
- When referring to the mysterious letter from Chapter 3:
  - AI knows this was introduced in Chapter 3
  - Provides consistent context
  - Doesn't contradict when it was found

**Timeline Consistency:**
- When Chapter 7 references "three weeks after finding the letter":
  - AI has the chronological context
  - Maintains proper time relationships
  - Doesn't create temporal paradoxes

**Why This Works:**
- **Context is Cumulative**: Each chapter has access to ALL previous context
- **AI Has Complete Picture**: Unlike single-prompt AI, AI "reads" your entire story
- **No Fragmentation**: The story is treated as one cohesive narrative
- **Writer Remains in Control**: AI generates suggestions, writer has final say

**Example Context Provided to AI:**
```
STORY CONTEXT FOR GENERATION

NOVEL TITLE: The Unfinished Manuscript
GENRE: Literary Fiction
THEMES: Loss and grief, The search for meaning, Family secrets, Redemption
TONE: Contemplative, Emotional, Hopeful
CENTRAL CONFLICT: A woman discovers her late father's unfinished manuscript and must decide whether to complete it or preserve his legacy, while uncovering family secrets.

CHARACTERS:
- Eleanor Vance (Protagonist): 34, archivist, analytical but emotional
  Personality: Careful, thoughtful, seeking truth, carrying grief
  Backstory: Daughter of Robert Vance (deceased author), grew up watching him write
  Goals: Understand her father through his work, complete the manuscript, find closure
  Relationships: Close to father, distant from mother, searching for his assistant

- Robert Vance (Deceased): 58, author, Eleanor's father
  Personality: Meticulous, private, brilliant, enigmatic
  Backstory: Renowned author who never finished his final book
  Goals: Complete his magnum opus, hidden meanings in text
  Relationships: Eleanor's father (deceased), had a secret lover (revealed in letters)

- Dr. Marcus Chen (Robert's assistant): 65, loyal friend, knows the secret
  Personality: Trustworthy, observant, protective of Robert's legacy
  Goals: Help Eleanor complete the manuscript, deliver Robert's final letter
  Relationships: Robert's closest friend and confidant

PREVIOUS CHAPTERS CONTEXT:
Chapter 1: Eleanor receives package with Robert's manuscript, discovers it's unfinished. She's hesitant to read it, missing her father. Opening the package, she finds the manuscript and begins reading.

Chapter 2: Eleanor reads Robert's notes in the margins. Flashbacks to her childhood watching him write. She realizes how little she knew about his creative process. The margins contain cryptic references to a "Chapter Zero" and hidden sections.

Chapter 3: Eleanor finds a letter hidden between pages 45-46. It's from Robert to Marcus, dated just before his death. The letter mentions that Chapter Zero exists but was never meant to be found. It warns of "the truth beneath the ink."

Chapter 4: Eleanor visits Dr. Chen at Robert's old office. Marcus is evasive but confirms Robert's final days were troubled. He gives Eleanor a key to Robert's safe deposit box.

Chapter 5: Eleanor opens the safe deposit box. Inside, she finds Robert's research notes about their family history—shocking revelations that her mother isn't who she thought. She also finds a complete draft of Chapter Zero.

IMPORTANT PLOT POINTS:
- Eleanor's discovery of the unfinished manuscript
- The mysterious margin notes
- Robert's deathbed warning letter
- Marcus's cryptic warnings
- Opening Robert's safe deposit box
- Shocking family history revelation in the research notes
- Discovery of the complete Chapter Zero draft

TIMELINE OF EVENTS:
- Robert's death (3 years ago)
- Eleanor receives the manuscript (yesterday)
- Eleanor reads Chapter 1-2 and discovers notes (yesterday)
- Eleanor finds the hidden letter (yesterday)
- Eleanor visits Marcus (today)

MAINTAIN CONSISTENCY WITH ALL INFORMATION ABOVE.
```

### Phase 5: Draft Management & Version Control 💾

**Goal**: Write with confidence using safety nets.

**Auto-Save:**
- Saves every 30 seconds while writing
- No need to manually save (though you can)
- Never lose more than 30 seconds of work
- Visual indicator shows when last save occurred

**Version Snapshots:**
- Before major rewrites, create a snapshot labeled "Before Rewrite"
- After important scenes, create "Scene Complete" snapshot
- When sharing with beta reader, create "Beta Version 1" snapshot
- Snapshots are permanent (never auto-deleted)

**Comparing Versions:**
- See exactly what changed between any two versions
- Word count delta helps track progress
- Content differences highlighted
- Easy to restore if a change goes wrong

**Restoring Versions:**
- One click restores previous version
- Automatic backup created before restore
- Current version saved as "Pre-restore backup"
- Easy to undo a restoration

**Example Version History:**
```
Chapter 5 - The Safe Deposit Box
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Snapshot] "First Complete Draft"
   Words: 3,245
   Created: Jan 15, 2025
   Restore | Delete

[Auto-Version] "Added dialogue scene" 
   Words: 3,245 → 3,890 (+645)
   Created: Jan 16, 2025
   Restore | Delete

[Backup] "Before Rewrite"
   Words: 3,890
   Created: Jan 16, 2025
   Restore | Delete

[Auto-Version] "After Major Rewrite"
   Words: 4,250
   Created: Jan 17, 2025
   Created: Jan 17, 2025  ← Current

Compare: "After Major Rewrite" vs "First Complete Draft"
Content difference: Major restructuring of the dialogue scene
Word count change: +1,005 words
```

### Phase 6: Export & Publishing 📤

**Goal**: Transform your digital manuscript into publication-ready format.

**Export Process:**
1. **Choose Format**: PDF or DOCX (or Markdown/Text for flexibility)
2. **Select Content**: Full novel or specific chapters
3. **Include Metadata**: Title, author, word count
4. **Generate File**: Creates properly formatted document
5. **Download**: File downloads to your device
6. **Review**: Open in your preferred application to verify

**Publication Ready Features:**
- **Professional formatting**: Proper margins, fonts, and layout
- **Table of contents**: Auto-generated chapter navigation
- **Page numbers**: Correctly positioned throughout
- **Clean typography**: Industry-standard formatting
- **Print-ready**: Correct dimensions for print-on-demand

**Export Statistics:**
See comprehensive data before exporting:
```
Total Word Count: 78,432
Total Chapters: 12
Estimated Pages: 262 (at 300 words/page)
Estimated Reading Time: 6.5 hours (at 200 words/minute)

Chapter Breakdown:
Chapter 1: 6,543 words (22 pages)
Chapter 2: 5,234 words (18 pages)
Chapter 3: 7,890 words (27 pages)
...
```

---

## 📚 Detailed Documentation

### Novel Workspace Interface

**The NovelForge novel workspace (`/novel/[id]`) is your creative command center.**

**Layout Structure:**
```
┌─────────────────────────────────────────────────────┐
│ Header (Sticky)                               │
│ - Back button to dashboard                    │
│ - Novel title (selected)                     │
│ - Status badge, genre badge, progress          │
│ - Edit Novel button                           │
├─────────────────────────────────────────────────────┤
│ Navigation Tabs (Horizontal)                   │
│ ├─ [💡 Idea] [📝 Outline]           │
│ ├─ [📖 Chapters] [👥 Characters]     │
│ ├─ [📤 Export]                            │
└─────────────────────────────────────────────────────┘
│                                                 │
│ Tab Content (Scrollable)                         │
│                                                 │
│ [Tab-specific features and content]             │
│                                                 │
└─────────────────────────────────────────────────────┘
```

### 💡 Idea Tab

**Transform concepts into complete story foundations.**

**Components:**

1. **Idea Input Area**:
   - Large text area for your concept
   - Placeholder: "Describe your novel concept..."
   - Character limit: 10,000 characters
   - Auto-saves as you type (every 30 seconds)

2. **Generate Button**:
   - Large, prominent CTA
   - Loading state during generation
   - Disabled until idea has content

3. **Foundation Display** (appears after generation):
   - **Genre**: The story category
   - **Themes**: Central motifs and ideas
   - **Tone**: Emotional and writing style
   - **Central Conflict**: The core story problem
   - **Directional Ending**: How the story resolves

**Interactive Features:**
- **Regenerate**: Click generate again to get different results
- **Edit Fields**: Click any field to manually edit
- **Save Changes**: Edits are saved to database
- **Clear Foundation**: Remove generated elements and start over

**Story Memory Integration:**
The idea phase automatically creates initial story memory entries:
- **Characters**: Characters mentioned in your idea are registered
- **Plot Seeds**: Potential plot points are stored
- **Setting Hints**: Any locations are remembered

### ✍️ Title Generation

**Get market-ready titles for your story.**

**Process:**
1. **Click "Generate Title Options"**
2. **Wait 5-15 seconds** for AI generation
3. **Review 10 Titles** displayed in a grid
4. **Select Your Favorite** by clicking on it
5. **Selected Title** becomes the novel's title

**Title Display:**
- Selected title is shown in header
- Bold, prominent display
- Click to change selection

**Title Options Example:**
All titles are tailored to your story's genre and themes:

**For Literary Fiction:**
1. "The Unfinished Manuscript"
2. "Words Between Pages"
3. "Her Father's Legacy"
4. "Finding the Ending"
5. "The Ink of Memory"
6. "Echoes in the Margins"
7. "The Last Storyteller"
8. "Completing the Book"

**For Fantasy:**
1. "The Last Archmage"
2. "Sword of Forgotten Fire"
3. "The Dragon's Apprentice"
4. "Realm of Shadow"
5. "Chronicles of Aethermoor"

**For Mystery:**
1. "The Silent Witness"
2. "Clues in the Ink"
3. "The Last Detective"
4. "Murder in the Margins"
5. "The Final Chapter"

### 📝 Outline Tab

**Create a complete chapter-by-chapter roadmap.**

**Structure:**

1. **Generate Button**: Large CTA to create outline
   - Disabled if outline already exists
   - Shows loading state during generation
   - Uses story foundation as context

2. **Outline Display** (when exists):
   - **Formatted Text**: Clean, readable outline
   - **Chapter Numbers**: Clearly labeled (Chapter 1, Chapter 2, etc.)
   - **Chapter Titles**: Each chapter has a descriptive title
   - **Chapter Summaries**: Brief 1-2 sentence summaries
   - **Chapter Objectives**: What each chapter should accomplish
   - **Turning Points**: Key moments highlighted

3. **Outline Editing**:
   - **Edit Button**: Modify the outline
   - **Save Changes**: Preserves your edits
   - **Regenerate Option**: Create a new outline if unsatisfied

4. **Progress Tracking**:
   - Shows outline length (number of chapters)
   - Estimated word count based on chapters
   - Progress percentage toward completion

**Outline Structure Example:**
```
Chapter 1: The Discovery
- Eleanor receives package containing her late father's unfinished manuscript
- Flashbacks to her childhood memories of him writing
- Initial reluctance to read the manuscript
- Opening the package and beginning to read

Chapter 2: First Words
- Reading the first chapters and being transported back in time
- Memories of her father's study come flooding back
- Realizing how little she knew about his writing process
- Finding notes in the margins that puzzle her

Chapter 3: The Hidden Notes
- Discovering cryptic references in the manuscript
- A mysterious letter tucked between pages 45 and 46
- First hint that there's more to the story
- Decision to investigate further

[Continues through Chapter 10...]
```

**Story Memory Integration:**
The outline phase creates comprehensive story memory:
- **Plot Arc**: Entire story structure is stored
- **Chapter Dependencies**: How chapters connect to each other
- **Timeline Events**: Chronological story points mapped

### 📖 Chapters Tab

**Write, manage, and organize your novel chapter by chapter.**

**Layout:**

```
┌──────────────────────────────────────────────────┐
│ Left Panel: Chapter List          │
│                                  │
│ ┌─────────────────────┐          │
│ │ + New Chapter    │          │
│ ├─────────────────────┤          │
│ │ Ch 1: Discovery│          │
│ │ Ch 2: First Words│          │
│ │ Ch 3: Hidden Notes│ (active)│
│ │ Ch 4: The Visit  │          │
│ │ Ch 5: Safe Box  │          │
│ └─────────────────────┘          │
└──────────────────────────────────────────┘
│                                  │
┌──────────────────────────────────────────┐
│ Right Panel: Chapter Editor         │
│                                  │
│ ┌─────────────────────────────┐          │
│ │ Chapter 3: The Hidden Notes │          │
│ ├─────────────────────────────┤          │
│ │ Status: In Progress        │          │
│ │ Words: 2,453 / ~3k goal│          │
│ ├─────────────────────────────┤          │
│ │ [📝 Write Tab]         │          │
│ │ [📋 Outline Tab]        │          │
│ │ [💾 Versions Tab]       │          │
│ │ [📤 Export Tab]         │          │
│ ├─────────────────────────────┤          │
│ │ Rich Text Editor         │          │
│ │                         │          │
│ │ Chapter content...        │          │
│ │                         │          │
│ │ [✅ Save] [🤖 Generate] │          │
│ └─────────────────────────────┘          │
└──────────────────────────────────────────┘
```

**Chapter List Features:**
- **Status Indicators**: Pending, In Progress, Complete (colored badges)
- **Word Counts**: See each chapter's length at a glance
- **Drag & Drop**: Reorder chapters (coming)
- **Bulk Actions**: Delete multiple chapters (coming)
- **Quick Edit**: Edit title and status without opening
- **Create New**: Add chapter at any position

**Chapter Editor Features:**

**Write Tab:**
- **Rich Text Editor**: Full-featured writing environment
- **Auto-Save Indicator**: Shows when last save occurred
- **Word Count**: Live word count display
- **AI Assistant**: Button to generate chapter content
- **Chapter Context**: See summary and objectives
- **Story Memory View**: All story elements for reference

**Outline Tab:**
- **Chapter Summary**: 1-2 sentence overview
- **Chapter Objectives**: What this chapter should accomplish
- **Connection Points**: How it links to previous/next chapters
- **Story Beats**: Key moments to hit

**Versions Tab:**
- **Version List**: All snapshots and auto-versions
- **Compare**: Side-by-side comparison of any two versions
- **Restore**: One-click restore with automatic backup
- **Create Snapshot**: Named version before major changes
- **Version Labels**: Custom names for easy identification
- **Timestamps**: See when each version was created

**Export Tab:**
- **Export Single Chapter**: Export just this chapter
- **Format Options**: Markdown, Text, PDF, DOCX
- **Include Context**: Option to include summary and notes

**AI Generation (Write Tab):**

**Process:**
1. **Click "Generate Chapter Content"**
2. **AI Analyzes Context**:
   - Novel foundation (title, genre, themes, tone)
   - Complete outline with all chapters
   - Previous chapters' full content
   - Story memory (characters, plot, settings, timeline)
3. **AI Generates Content**:
   - Continues naturally from previous chapter
   - Uses all characters established so far
   - Maintains settings and timeline
   - Works toward chapter objectives
   - Matches tone and style
4. **Appears in Editor**: Generated content is loaded for review
5. **You Can Edit**: Add your own writing, make changes
6. **Auto-Save**: All changes are saved with version tracking

**Why This Produces Better Results:**
- **Complete Context**: Unlike short AI prompts, AI reads your ENTIRE novel
- **Consistency**: AI won't introduce contradictions to established story
- **Continuity**: Each chapter flows naturally from the last
- **Character Memory**: AI remembers every character's traits and history
- **No Repetition**: AI knows what you've already written

### 👥 Characters Tab

**Create and manage your cast of characters.**

**Character Profile Structure:**

1. **Basic Information**:
   - **Name**: Character's full name
   - **Role**: Protagonist, antagonist, supporting, mentor, etc.
   - **Age**: Character's age (or age range)
   - **Gender**: Male, female, non-binary, other
   - **Pronouns**: He/him, she/her, they/them

2. **Physical Appearance**:
   - **Description**: Height, build, hair color, eye color
   - **Distinguishing Features**: Scars, tattoos, unique traits
   - **Clothing Style**: Typical attire or fashion sense
   - **Voice**: How they speak

3. **Personality Traits**:
   - **Strengths**: What they're good at
   - **Weaknesses**: Their flaws and vulnerabilities
   - **Fears**: What terrifies them
   - **Desires**: What they want most
   - **Quirks**: Unique habits or mannerisms
   - **Values**: What they believe in

4. **Backstory**:
   - **Origin**: Where they come from
   - **Family**: Parents, siblings, childhood
   - **Education**: Schooling or training
   - **Past Trauma**: Events that shaped them
   - **Secrets**: Hidden aspects others don't know

5. **Goals & Motivations**:
   - **External Goal**: What they're trying to achieve in the story
   - **Internal Need**: What they emotionally need
   - **Conflicts**: What stands in their way
   - **Arc**: How they change throughout the story

6. **Relationships**:
   - **With Other Characters**: Describe connections
   - **Family Ties**: Mother, father, siblings
   - **Friends & Allies**: Who supports them
   - **Enemies & Rivals**: Who opposes them
   - **Romantic Interests**: Love interests (if applicable)

**Character Management:**
- **Create New Character**: Add characters anytime
- **Edit Character**: Update profiles as story evolves
- **Delete Character**: Remove if character is cut
- **View All Characters**: Grid/list view of entire cast
- **Character Search**: Find specific characters quickly

**Story Memory Integration:**
Characters defined in this tab are automatically:
- **Added to Story Memory**: Available for AI context
- **Referenced in Generation**: AI knows all character traits
- **Consistency Enforced**: AI won't violate established character traits
- **Relationship Tracking**: How characters relate is maintained

### 📤 Export Tab

**Prepare your novel for the world.**

**Export Options:**

**Full Novel Export:**
- **Format Selection**: PDF or DOCX
- **Include Elements**: Choose what to include:
  - ✅ Table of contents
  - ✅ Title page with author name
  - ✅ Chapter numbers
  - ✅ Page numbers
  - ❌ Character profiles (optional)
  - ❌ Story summaries (optional)
- **Generate**: Creates formatted document
- **Download**: File downloads automatically

**Single Chapter Export:**
- **Select Chapter**: Choose from dropdown
- **Quick Export**: One-click export of specific chapter
- **Format Options**: Same as full novel
- **Useful For**: Beta readers, critique groups, sharing excerpts

**Export Preview:**
Before downloading, see:
```
Novel: The Unfinished Manuscript
Author: [Your Name]
Total Words: 78,432
Total Chapters: 12
Estimated Pages: 262
Estimated Reading Time: 6.5 hours

Included:
✅ Table of Contents
✅ Title Page
✅ Chapter Numbers
✅ Page Numbers

Format: PDF
```

**Export History:**
- Track previous exports with date and format
- Re-export without reconfiguring options
- See export statistics over time

---

## 🌐 API Routes

All API endpoints are organized by resource and follow REST conventions.

### 📚 Novel Routes

#### `GET /api/novels`
**Description**: Fetch all novels for the current user.

**Response:**
```json
{
  "novels": [
    {
      "id": "string",
      "userId": "string",
      "title": "string",
      "currentTitle": "string | null",
      "description": "string | null",
      "genre": "string | null",
      "themes": "string | null",
      "tone": "string | null",
      "centralConflict": "string | null",
      "directionalEnding": "string | null",
      "outline": "string | null",
      "chapterCount": number,
      "currentChapter": number,
      "totalWords": number,
      "status": "string",
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  ]
}
```

#### `POST /api/novels`
**Description**: Create a new novel.

**Request Body:**
```json
{
  "title": "My Novel Title",
  "description": "A brief description of the novel concept..."
}
```

**Response (201):**
```json
{
  "novel": {
    "id": "novel-id",
    "title": "My Novel Title",
    "description": "A brief description...",
    "status": "idea",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### `GET /api/novels/[id]`
**Description**: Fetch a specific novel with full details.

**Response:**
```json
{
  "novel": {
    "id": "string",
    "userId": "string",
    "title": "string",
    "currentTitle": "string | null",
    "description": "string | null",
    "genre": "string | null",
    "themes": "string | null",
    "tone": "string | null",
    "centralConflict": "string | null",
    "directionalEnding": "string | null",
    "outline": "string | null",
    "chapterCount": number,
    "currentChapter": number,
    "totalWords": number,
    "status": "string",
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601",
    "chapters": [...],
    "characters": [...],
    "storyMemories": [...]
  }
}
```

#### `PUT /api/novels/[id]`
**Description**: Update novel details.

**Request Body:**
```json
{
  "title": "Updated Title",
  "currentTitle": "Market-Ready Title",
  "description": "Updated description",
  "genre": "Literary Fiction",
  "themes": "Loss, Memory, Truth",
  "tone": "Contemplative",
  "centralConflict": "The protagonist's internal and external conflict",
  "directionalEnding": "She finds closure and completes her father's work"
}
```

**Response:**
```json
{
  "novel": {
    "id": "string",
    // Updated novel object
  }
}
```

#### `DELETE /api/novels/[id]`
**Description**: Delete a novel and all associated data.

**Response (200):**
```json
{
  "success": true
}
```

#### `POST /api/novels/[id]/develop-idea`
**Description**: Use AI to expand a basic idea into a complete story foundation.

**Request Body:**
```json
{
  "idea": "A woman discovers her late father's unfinished manuscript and must decide whether to complete it or preserve his legacy..."
}
```

**Response:**
```json
{
  "novel": {
    "id": "string",
    "genre": "Literary Fiction",
    "themes": "Loss and grief, The search for meaning, Family secrets, Redemption",
    "tone": "Contemplative, Emotional, Hopeful",
    "centralConflict": "A woman discovers her late father's unfinished manuscript and must decide whether to complete it or preserve his legacy, while uncovering family secrets that challenge everything she thought she knew about him.",
    "directionalEnding": "The protagonist completes the manuscript in her own voice, finding closure and understanding that honoring her father's legacy means both respecting his work and adding her own truth to the story.",
    "status": "outlined"
  }
}
```

#### `POST /api/novels/[id]/generate-titles`
**Description**: Generate multiple market-ready title options.

**Response:**
```json
{
  "titles": [
    "The Unfinished Manuscript",
    "Words Between Pages",
    "Her Father's Legacy",
    "Finding the Ending",
    "The Ink of Memory",
    "Echoes in the Margins",
    "The Last Storyteller",
    "Completing the Book",
    "A Daughter's Promise",
    "The Final Chapter"
  ]
}
```

#### `POST /api/novels/[id]/generate-outline`
**Description**: Generate a complete chapter-wise outline.

**Response:**
```json
{
  "novel": {
    "id": "string",
    "outline": "Chapter 1: The Discovery\n- Protagonist receives package...\n\nChapter 2: First Words\n- Reading the first chapters...\n\n[Full 10-20 chapter outline]",
    "status": "writing",
    "chapterCount": 10
  }
}
```

### 📖 Chapter Routes

#### `GET /api/novels/[id]/chapters`
**Description:** Fetch all chapters for a novel.

**Response:**
```json
{
  "chapters": [
    {
      "id": "string",
      "novelId": "string",
      "chapterNumber": 1,
      "title": "The Discovery",
      "summary": "Protagonist receives package containing her late father's unfinished manuscript",
      "objectives": "Establish the protagonist, her goal, and the inciting incident",
      "content": "string | null",
      "wordCount": 0,
      "status": "pending",
      "aiGenerated": false,
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    }
  ]
}
```

#### `POST /api/novels/[id]/chapters`
**Description:** Create a new chapter.

**Request Body:**
```json
{
  "chapterNumber": 1,
  "title": "Chapter 1: The Discovery",
  "summary": "Protagonist receives package...",
  "objectives": "Establish the protagonist..."
}
```

**Response (201):**
```json
{
  "chapter": {
    "id": "chapter-id",
    "novelId": "string",
    "chapterNumber": 1,
    "title": "Chapter 1: The Discovery",
    "status": "pending",
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
}
```

#### `GET /api/chapters/[id]`
**Description:** Fetch a specific chapter with versions.

**Response:**
```json
{
  "chapter": {
    "id": "string",
    "novelId": "string",
    "chapterNumber": 1,
    "title": "Chapter 1",
    "summary": "string",
    "objectives": "string",
    "content": "Full chapter text...",
    "wordCount": 3456,
    "status": "completed",
    "aiGenerated": false,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601",
    "versions": [
      {
        "id": "version-id",
        "chapterId": "string",
        "content": "Previous version content...",
        "wordCount": 3200,
        "versionLabel": "First Draft",
        "isSnapshot": true,
        "createdAt": "ISO8601"
      }
    ]
  }
}
```

#### `PUT /api/chapters/[id]`
**Description:** Update chapter content and metadata.

**Request Body:**
```json
{
  "content": "Updated chapter text with additional writing...",
  "title": "Updated Title",
  "summary": "Updated summary",
  "objectives": "Updated objectives",
  "status": "completed"
}
```

**Process:**
1. Auto-saves the chapter
2. Creates a version if significant change (500+ words)
3. Extracts and stores story memory elements
4. Updates novel's total word count
5. Triggers notification if chapter completed

**Response:**
```json
{
  "chapter": {
    "id": "string",
    "content": "string",
    "wordCount": 3567,
    "status": "string",
    "updatedAt": "ISO8601"
  }
}
```

#### `DELETE /api/chapters/[id]`
**Description:** Delete a chapter.

**Response (200):**
```json
{
  "success": true
}
```

### 💾 Version Control Routes

#### `GET /api/chapters/[id]/versions`
**Description:** Get version history for a chapter.

**Response:**
```json
{
  "versions": [
    {
      "id": "version-id",
      "chapterId": "string",
      "content": "Chapter text at this version",
      "wordCount": 3456,
      "versionLabel": "First Draft",
      "isSnapshot": true,
      "createdAt": "2025-01-15T10:30:00.000Z"
    },
    {
      "id": "version-id-2",
      "chapterId": "string",
      "content": "Chapter text with edits",
      "wordCount": 3890,
      "versionLabel": "After Review Edits",
      "isSnapshot": false,
      "createdAt": "2025-01-15T14:45:00.000Z"
    }
  ]
}
```

#### `POST /api/chapters/[id]/versions`
**Description:** Create a manual snapshot.

**Request Body:**
```json
{
  "label": "Before Major Rewrite"
}
```

**Process:**
1. Captures current chapter content
2. Creates a version entry with custom label
3. Sets `isSnapshot: true` (permanent version)
4. Returns the created version

**Response (201):**
```json
{
  "snapshot": {
    "id": "version-id",
    "chapterId": "string",
    "content": "Current chapter text...",
    "wordCount": 3456,
    "versionLabel": "Before Major Rewrite",
    "isSnapshot": true,
    "createdAt": "ISO8601"
  }
}
```

#### `POST /api/versions/[id]/restore`
**Description:** Restore a chapter to a previous version.

**Process:**
1. Fetches the target version
2. Creates automatic backup of current state (labeled "Backup before restore")
3. Updates chapter content to version content
4. Returns success

**Response (200):**
```json
{
  "success": true
}
```

#### `DELETE /api/versions/[id]`
**Description:** Delete a version (auto-versions only, snapshots are permanent).

**Response (200):**
```json
{
  "success": true
}
```

### 📤 Export Routes

#### `POST /api/novels/[id]/export`
**Description:** Export a novel in PDF or DOCX format.

**Request Body:**
```json
{
  "format": "pdf" // or "docx"
}
```

**Process:**
1. Fetches novel with all chapters
2. Organizes content into proper structure
3. Generates formatted document
4. Returns file as download

**Response:**
Binary file download (not JSON)

**Headers:**
```
Content-Type: application/pdf (or application/vnd.openxmlformats-officedocument.wordprocessingml.document)
Content-Disposition: attachment; filename="novel-title.pdf"
```

### 👥 Character Routes

#### `GET /api/novels/[id]/characters`
**Description:** Fetch all characters for a novel.

**Response:**
```json
{
  "characters": [
    {
      "id": "string",
      "novelId": "string",
      "name": "Eleanor Vance",
      "role": "Protagonist",
      "age": "34",
      "physicalAppearance": "5'6\", brown hair, brown eyes, wears glasses",
      "personalityTraits": "Careful, thoughtful, seeking truth, carrying grief, analytical, emotional",
      "backstory": "Daughter of Robert Vance (deceased author), grew up watching him write. After his death, she's been struggling with grief and a sense of unfinished business. Recently discovered his unfinished manuscript and is trying to understand him through his work.",
      "goals": "Understand her father through his work, complete the manuscript, find closure",
      "fears": "Never truly understanding her father, destroying his legacy, the truth in his hidden writings",
      "relationships": "Close to her late father (deceased), distant from her mother, searching for information about his assistant Dr. Marcus Chen"
    }
  ]
}
```

#### `POST /api/novels/[id]/characters`
**Description:** Create a new character.

**Request Body:**
```json
{
  "name": "Dr. Marcus Chen",
  "role": "Supporting",
  "age": "65",
  "physicalAppearance": "Asian, 5'10\", thin glasses, gray hair going white, kind eyes",
  "personalityTraits": "Trustworthy, observant, protective, loyal, intelligent, secretive",
  "backstory": "Robert Vance's closest friend and confidant for 40 years. Was his research assistant at the university. Knows about Robert's hidden research into family history. Protective of Robert's legacy and reputation.",
  "goals": "Help Eleanor Vance complete her father's manuscript, deliver Robert's final letter to Eleanor, preserve Robert's literary reputation",
  "fears": "Robert's secrets coming to light and damaging his name, Eleanor discovering uncomfortable truths about her father",
  "relationships": "Robert Vance (best friend, deceased), Eleanor Vance (daughter of deceased author, seeking answers)"
}
```

**Response (201):**
```json
{
  "character": {
    "id": "character-id",
    "novelId": "string",
    "name": "string",
    "role": "string",
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
}
```

#### `PUT /api/characters/[id]`
**Description:** Update character details.

#### `DELETE /api/characters/[id]`
**Description:** Delete a character.

### 🧠 Story Memory Routes

#### `GET /api/novels/[id]/story-memory`
**Description:** Get complete story context and consistency check for a novel.

**Response:**
```json
{
  "storyContext": {
    "characters": [...],
    "plotPoints": [
      {
        "id": "string",
        "novelId": "string",
        "type": "plot_point",
        "description": "Eleanor receives the package",
        "chapterContext": "Chapter 1",
        "importance": "high",
        "createdAt": "ISO8601"
      }
    ],
    "relationships": [
      {
        "id": "string",
        "novelId": "string",
        "type": "relationship",
        "description": "Eleanor has a complex relationship with her late father—she loved him but is also angry at him for leaving the manuscript unfinished.",
        "chapterContext": "Chapter 1",
        "importance": "high",
        "createdAt": "ISO8601"
      }
    ],
    "characterArcs": [...],
    "settings": [...],
    "timeline": [...]
  },
  "consistencyCheck": {
    "issues": [
      {
        "type": "character_contradiction",
        "description": "Found 0 potential character contradictions"
      },
      {
        "type": "incomplete_character",
        "description": "Character 'Dr. Marcus Chen' is missing personality traits"
      }
    ]
  }
}
```

### 🔔 Notification Routes

#### `GET /api/notifications?unreadOnly=true`
**Description:** Fetch user notifications.

**Query Parameters:**
- `unreadOnly` (optional): Set to `true` to get only unread notifications

**Response:**
```json
{
  "notifications": [
    {
      "id": "notification-id",
      "userId": "string",
      "novelId": "string | null",
      "type": "generation_complete",
      "title": "Idea Development Complete",
      "message": "Your novel 'The Unfinished Manuscript' has been developed with genre, themes, and central conflict.",
      "read": false,
      "novel": {
        "id": "string",
        "title": "The Unfinished Manuscript",
        "currentTitle": "string"
      },
      "createdAt": "ISO8601"
    }
  ],
  "unreadCount": 5
}
```

#### `DELETE /api/notifications?clearRead=true`
**Description:** Clear all read notifications.

**Query Parameters:**
- `clearRead`: Set to `true` to delete only read notifications

**Response:**
```json
{
  "success": true
}
```

#### `POST /api/notifications/mark-read`
**Description:** Mark all notifications as read.

**Response:**
```json
{
  "success": true
}
```

#### `POST /api/notifications/[id]`
**Description:** Mark a specific notification as read.

**Response:**
```json
{
  "success": true
}
```

#### `DELETE /api/notifications/[id]`
**Description:** Delete a specific notification.

**Response:**
```json
{
  "success": true
}
```

### ⚙️ Settings Routes

#### `GET /api/settings`
**Description:** Fetch user settings.

**Response:**
```json
{
  "settings": {
    "id": "string",
    "userId": "string",
    "theme": "light",
    "defaultLanguage": "en",
    "autoSave": true,
    "emailNotifications": true,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
}
```

#### `PUT /api/settings`
**Description:** Update user settings.

**Request Body:**
```json
{
  "theme": "dark",
  "defaultLanguage": "en",
  "autoSave": true,
  "emailNotifications": false
}
```

**Response:**
```json
{
  "settings": {
    "id": "string",
    "theme": "dark",
    "defaultLanguage": "en",
    "autoSave": true,
    "emailNotifications": false,
    "updatedAt": "ISO8601"
  }
}
```

### 👤 User Routes

#### `GET /api/user`
**Description:** Fetch current user profile.

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "user@example.com",
    "name": "John Doe",
    "imageUrl": "https://...",
    "createdAt": "ISO8601",
    "settings": {...},
    "_count": {
      "novels": 3
    }
  }
}
```

#### `DELETE /api/user`
**Description:** Delete user account and all associated data.

**Warning:** This is irreversible. All novels, chapters, characters, and settings are permanently deleted.

**Response:**
```json
{
  "success": true
}
```

---

## 💾 Database Schema

NovelForge uses Prisma ORM with SQLite. The complete schema is defined in `prisma/schema.prisma`.

### Core Models

#### User
```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  image       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  relations
  novels          Novel[]
  notifications   Notification[]
  settings        UserSettings?
}
```

#### UserSettings
```prisma
model UserSettings {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  theme           String   @default("light")
  defaultLanguage String   @default("en")
  autoSave        Boolean  @default(true)
  emailNotifications Boolean  @default(true)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

#### Novel
```prisma
model Novel {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Basic Info
  title           String
  currentTitle    String?
  description     String?

  // AI-generated story foundation
  genre           String?
  themes          String?
  tone            String?
  centralConflict String?
  directionalEnding String?

  // Story structure
  outline         String?
  chapterCount    Int      @default(0)
  targetWordCount Int?

  // Writing progress
  currentChapter  Int      @default(1)
  totalWords      Int      @default(0)
  status          String   @default("idea")

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  relations
  chapters        Chapter[]
  characters      Character[]
  storyMemories  StoryMemory[]
  notifications   Notification[]
}
```

#### Chapter
```prisma
model Chapter {
  id              String   @id @default(cuid())
  novelId         String
  novel           Novel    @relation(fields: [novelId], references: [id], onDelete: Cascade)

  chapterNumber   Int
  title           String?
  summary         String?
  objectives      String?

  // Content
  content         String?
  wordCount       Int      @default(0)

  // Status tracking
  status          String   @default("pending")

  // AI generation tracking
  aiGenerated     Boolean  @default(false)
  aiContextUsed   String?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  relations
  versions        ChapterVersion[]
}

type ChapterStatus = "idea" | "outlined" | "writing" | "completed"
```

#### ChapterVersion
```prisma
model ChapterVersion {
  id           String   @id @default(cuid())
  chapterId    String
  chapter      Chapter  @relation(fields: [chapterId], references: [id], onDelete: Cascade)

  content      String
  wordCount    Int

  versionLabel String?
  isSnapshot   Boolean  @default(false)

  createdAt    DateTime @default(now())

  @@index([chapterId])
}
```

#### Character
```prisma
model Character {
  id       String   @id @default(cuid())
  novelId  String
  novel    Novel    @relation(fields: [novelId], references: [id], onDelete: Cascade)

  name     String
  role     String?
  age      String?
  physicalAppearance String?
  personalityTraits  String?
  backstory      String?
  goals          String?
  fears          String?
  relationships   String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([novelId])
}
```

#### StoryMemory
```prisma
model StoryMemory {
  id       String   @id @default(cuid())
  novelId  String
  novel    Novel    @relation(fields: [novelId], references: [id], onDelete: Cascade)

  type     String  // "plot_point" | "relationship" | "character_arc" | "setting" | "timeline"
  description String
  chapterContext String?
  importance  String   @default("normal")  // "low" | "normal" | "high"

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([novelId, type])
}
```

#### Notification
```prisma
model Notification {
  id       String   @id @default(cuid())
  userId   String
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  novelId  String?
  novel    Novel?   @relation(fields: [novelId], references: [id], onDelete: SetNull)

  type     String  // "generation_complete" | "milestone" | "system_update" | "chapter_completed" | "version_created"
  title    String
  message  String
  read      Boolean  @default(false)

  createdAt DateTime @default(now())

  @@index([userId, read])
  @@index([novelId])
}
```

### Relationship Overview

```
User
├── UserSettings (1:1)
├── Novel (1:N)
│   ├── Chapter (1:N)
│   │   └── ChapterVersion (1:N)
│   ├── Character (1:N)
│   ├── StoryMemory (1:N)
│   └── Notification (1:N, via novelId optional)
└── Notification (1:N, via userId)

Novel + StoryMemory = Complete narrative context
Chapter + ChapterVersion = Full version history
```

### Indexes for Performance

- `@@index([chapterId])` on ChapterVersion for fast version lookup
- `@@index([novelId])` on Chapter and StoryMemory for filtering by novel
- `@@index([novelId, type])` on StoryMemory for context queries
- `@@index([userId, read])` on Notification for unread queries
- `@@index([novelId])` on Notification for novel-specific notifications

---

## 🏗️ Architecture

### Application Structure

```
AETHERWRITE/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx         # Landing page
│   │   ├── sign-in/          # Clerk sign-in
│   │   ├── settings/         # User settings
│   │   ├── dashboard/        # Novel management
│   │   ├── novel/
│   │   │   └── [id]/      # Novel workspace
│   │   └── layout.tsx       # Root layout
│   │
│   ├── components/            # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── auth/            # Authentication components
│   │   └── pages/           # Page-specific components
│   │
│   ├── lib/                 # Utility libraries
│   │   ├── db.ts           # Prisma client
│   │   ├── utils.ts        # Helper functions
│   │   ├── story-memory/   # Story memory engine
│   │   ├── version-control.ts # Version control service
│   │   ├── export/         # Export services
│   │   ├── notifications.ts  # Notification service
│   │   └── clerk/          # Clerk helpers
│   │
│   └── middleware.ts        # Route protection (Clerk)
│
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/         # Database migrations
│
├── public/                 # Static assets
│   └── logo.svg
│
└── [Configuration Files]
```

### Architecture Patterns

**Server-Side Rendering (SSR):**
- Page routes use SSR by default
- Better SEO and initial page load
- Authentication check happens server-side

**Client-Side Interactivity:**
- `'use client'` directive for interactive components
- React hooks for local state
- Clerk hooks for authentication state

**API Route Handlers:**
- Server-side API functions in `app/api/`
- Direct database access (not client)
- Input validation with Zod

**Database Layer:**
- Prisma ORM for type-safe database queries
- Single `db` instance exported from `lib/db.ts`
- Connection pooling handled by Prisma

**Service Layer:**
- Business logic separated into service classes
- `StoryMemoryEngine` for consistency
- `VersionControl` for version management
- `ExportService` for file generation
- `NotificationService` for user alerts

**State Management:**
- Component-level state with React hooks (useState, useEffect)
- No global state library needed for simple use cases
- Server state via database for persistent data

### Data Flow

**Writing a Novel Flow:**
```
User Input → (Idea Input)
    ↓
AI Generation → (z-ai-web-dev-sdk)
    ↓
Story Memory → (Extract & Store)
    ↓
Database → (Prisma)
    ↓
Version Control → (Auto-save & Snapshots)
    ↓
Notifications → (User Alerts)
```

**Story Memory Context Flow:**
```
Chapter Generation Request
    ↓
Retrieve Context (Novel + Outline + Previous Chapters + Characters + Story Memory)
    ↓
Generate Context Prompt (Assemble into comprehensive prompt)
    ↓
Send to AI (z-ai-web-dev-sdk LLM)
    ↓
Return Generated Content
    ↓
Update Story Memory (New plot points, relationships, settings)
```

**Auto-Save Flow:**
```
User Types/Writes Content
    ↓
Debounce (300ms)
    ↓
Send to API (PUT /api/chapters/[id])
    ↓
Update Database (Chapter.content, wordCount)
    ↓
Create Version (If change >= 500 words)
    ↓
Notify (If marked complete)
```

### Security Architecture

**Authentication:**
- Clerk handles all authentication concerns
- Sessions managed securely server-side
- Protected routes via middleware
- JWT tokens for session management

**Data Privacy:**
- Each user's data isolated by `userId`
- No cross-user data access
- Database queries always scoped to user
- Clerk provides user context

**API Security:**
- All protected routes require authentication
- Server-side checks prevent client bypass
- Input validation prevents injection attacks
- SQL injection prevented by Prisma ORM

---

## 🛠️ Development Workflow

### Local Development Setup

**Prerequisites:**
- Bun or Node.js 18+
- Git for version control
- Clerk account (for authentication)

**Setup Steps:**
```bash
# 1. Clone repository
git clone https://github.com/NYXAETHER2010/AETHERWRITE.git
cd AETHERWRITE

# 2. Install dependencies
bun install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Initialize database
bun run db:push

# 5. Start development server
bun run dev
```

**Development Server:**
- URL: `http://localhost:3000`
- Hot reload enabled
- File changes trigger automatic recompilation
- TypeScript errors shown in terminal

### Code Quality Standards

**Linting:**
```bash
bun run lint
```
- ESLint configured with Next.js rules
- TypeScript strict mode enabled
- Custom rules for consistency

**TypeScript Configuration:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true
  }
}
```

### Database Migrations

**Schema Changes:**
1. Edit `prisma/schema.prisma`
2. Run `bun run db:push` to sync with database
3. Prisma automatically handles schema evolution

**Reset Database:**
```bash
# Clear all data (development only!)
bun run db:reset
```

### Adding New Features

**Feature Development Workflow:**
1. Update database schema if needed
2. Create service files in `lib/`
3. Create API routes in `app/api/`
4. Create or update UI components
5. Add to page routing
6. Test thoroughly
7. Update documentation

**Service Layer Pattern:**
```typescript
// Example: Creating a new service
class MyService {
  async doSomething(input: Input): Promise<Result> {
    try {
      // Business logic
      const result = await db.someQuery(input)
      return { success: true, data: result }
    } catch (error) {
      console.error('Service error:', error)
      return { success: false, error: error.message }
    }
  }
}

export const myService = new MyService()
```

### API Route Pattern

```typescript
// app/api/feature/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authentication check (via Clerk or session)
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Fetch data
    const data = await db.feature.findUnique({
      where: { id: params.id, userId }
    })

    if (!data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // 3. Return response
    return NextResponse.json({ data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Testing Strategy

**Manual Testing:**
1. Test happy paths for all features
2. Test error conditions (not found, unauthorized)
3. Test database operations
4. Test API responses
5. Test UI interactions
6. Cross-browser testing

**Testing Checklist:**
- [ ] Authentication flow works
- [ ] Novel CRUD operations
- [ ] Chapter writing with auto-save
- [ ] Version control restores correctly
- [ ] Story memory context generation
- [ ] Notifications appear and dismiss
- [ ] Settings persist and apply
- [ ] Export generates downloadable files
- [ ] Mobile responsive design
- [ ] Dark/light theme switching

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

**Prerequisites:**
- Vercel account
- GitHub repository connected to Vercel
- Environment variables configured in Vercel dashboard

**Deployment Steps:**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy update"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to vercel.com
   - Click "Add New Project"
   - Import from GitHub
   - Select repository

3. **Configure Environment Variables:**
   In Vercel project settings:
   ```
   DATABASE_URL=postgresql://...
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Production URL assigned (e.g., https://novelforge.vercel.app)

5. **Configure Custom Domain (Optional):**
   - Add domain in Vercel dashboard
   - Configure DNS records
   - Enable SSL certificate

**Build Configuration:**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,  // Minify production builds
  output: 'standalone',   // Optimize for production
}
```

### Environment Variables for Production

Required variables for production deployment:
```env
# Production Database (PostgreSQL recommended)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Clerk (Production)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=https://yourdomain.com/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=https://yourdomain.com/sign-up

# z-ai-web-dev-sdk
Z_AI_SDK_KEY=your_production_key

# Optional
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Production Optimization

**Performance:**
- Static generation for faster builds
- Image optimization enabled
- Font optimization enabled
- Compression enabled
- CDN edge caching

**SEO:**
- Dynamic meta tags
- Open Graph tags for social sharing
- Structured data for search engines
- Sitemap generation
- Robots.txt configuration

---

## 🤝 Contributing

We welcome contributions from the community!

### How to Contribute

**Reporting Bugs:**
1. Check existing issues first
2. Create detailed bug report with:
   - Title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment (browser, OS)
   - Screenshots if applicable
3. Submit issue on GitHub

**Feature Requests:**
1. Check roadmap and existing feature requests
2. Create detailed proposal with:
   - Problem statement
   - Proposed solution
   - Use cases
   - Design mockups (if applicable)
3. Submit feature request on GitHub

**Pull Requests:**
1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Write tests if applicable
5. Ensure code passes linting
6. Commit with clear messages
7. Submit pull request

**Code Style Guidelines:**
- Follow existing code structure
- Use TypeScript for all new code
- Add comments for complex logic
- Keep components focused and modular
- Follow Next.js and React best practices

**Development Setup:**
```bash
# 1. Fork repository
git fork https://github.com/NYXAETHER2010/AETHERWRITE.git

# 2. Clone fork
git clone https://github.com/YOUR_USERNAME/AETHERWRITE.git

# 3. Create feature branch
git checkout -b feature/your-feature-name

# 4. Make changes and commit
git add .
git commit -m "Add your feature"

# 5. Push to your fork
git push origin feature/your-feature-name

# 6. Create pull request on GitHub
```

---

## 📄 License

This project is licensed under the MIT License.

### Permissions
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ✅ Sublication

### Conditions
- Include the original license and copyright notice
- Provide attribution if required

Full license text available in the [LICENSE](LICENSE) file.

---

## 🆘 Support & Resources

### Documentation
- **GitHub Repository**: https://github.com/NYXAETHER2010/AETHERWRITE
- **Issue Tracker**: https://github.com/NYXAETHER2010/AETHERWRITE/issues
- **Discussions**: https://github.com/NYXAETHER2010/AETHERWRITE/discussions

### Key Technologies Documentation
- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **Clerk**: https://clerk.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs

### Community
- **Twitter**: [@NovelForgeApp](https://twitter.com/NovelForgeApp)
- **Discord**: Join our community server (link in repository)

---

## 🎉 Acknowledgments

Built with love by the NovelForge team.

### Core Technologies
- **Framework**: Next.js - The React Framework for the Web
- **UI Library**: shadcn/ui - Beautifully designed components
- **Database**: Prisma - Next-generation ORM
- **Styling**: Tailwind CSS - Rapid UI development
- **Authentication**: Clerk - User authentication and management
- **Icons**: Lucide - Beautiful & consistent icons

### Special Thanks
- To the open-source community for the amazing tools we build upon
- To our beta testers for invaluable feedback
- To the writers who inspired this platform's design

---

## 📞 Contact

Have questions? Need help?

- **Email**: support@novelforge.com
- **GitHub Issues**: https://github.com/NYXAETHER2010/AETHERWRITE/issues
- **Documentation**: https://github.com/NYXAETHER2010/AETHERWRITE#readme

---

**Built with ❤️ for writers, by writers**

*Happy writing! 📖✍️*
