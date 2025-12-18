# AetherWrite - AI Fiction Novel Writing SaaS

A comprehensive AI-powered platform for fiction novel writing with multi-tool dashboard.

## 🚀 Features

### ✅ Live Features
- **AI Novel Writer** - Complete 5-step novel writing workflow
  - Book Idea Generator
  - Title Generator  
  - Outline Generator
  - Cover Prompt Generator
  - Chapter-by-Chapter Writer

### 🚧 Coming Soon (UI Only)
- Short Story Writer
- Screenplay Writer
- Manga Script Writer
- Poetry Generator
- Character Builder
- World Builder
- Cover Art Generator

## 🛠 Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM with SQLite
- **Authentication**: NextAuth.js
- **AI**: z-ai-web-dev-sdk (Meta-LLaMA 3.3 70B Instruct)
- **UI**: Tailwind CSS + shadcn/ui
- **State**: Zustand + TanStack Query

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/
│   ├── tools/
│   │   ├── novel-writer/
│   │   │   ├── idea/
│   │   │   ├── title/
│   │   │   ├── outline/
│   │   │   ├── cover/
│   │   │   └── write/
│   │   └── [...tool]/
│   ├── novels/[id]/
│   └── api/
│       ├── auth/[...nextauth]/
│       ├── novels/
│       ├── ai/
│       │   ├── generate-idea/
│       │   ├── generate-titles/
│       │   ├── generate-outline/
│       │   ├── generate-cover-prompt/
│       │   └── generate-chapter/
│       └── chapters/
├── components/
│   ├── ui/
│   └── providers.tsx
└── lib/
    ├── auth.ts
    ├── ai-service.ts
    ├── db.ts
    └── utils.ts
```

## 🗄 Database Schema

### Users
- id, email, name, timestamps

### Novels  
- id, userId, title, ideaInput, mainIdea, genre, characters, styleTone, outline, coverPrompt, timestamps

### Chapters
- id, novelId, chapterNumber, chapterType, content, createdAt

### Prompts
- id, toolName, stepName, promptTemplate, version, updatedAt

## 🔐 Authentication

Simple email/password authentication using NextAuth.js with Prisma adapter. Users can create accounts or sign in with existing credentials.

## 🤖 AI Integration

Server-side AI generation using z-ai-web-dev-sdk with structured prompts for each step:

- **Idea Generation**: Develops concepts from user input
- **Title Generation**: Creates 5-8 title options
- **Outline Generation**: Builds 3-act structure with chapters
- **Cover Prompt**: Generates detailed image prompts
- **Chapter Writing**: Creates individual chapters with context

## 🎨 UI/UX

- Dark mode support with next-themes
- Responsive design (mobile-first)
- Progress indicators for multi-step flows
- Loading states and error handling
- Toast notifications for user feedback
- Inspired by Notion + Linear design

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   bun install
   ```

2. **Set up environment variables**
   ```bash
   # Copy .env.example to .env and configure:
   DATABASE_URL=file:./db/custom.db
   OPENROUTER_API_KEY=your_api_key
   AI_MODEL=meta-llama/llama-3.3-70b-instruct
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret
   ```

3. **Set up database**
   ```bash
   bun run db:push
   ```

4. **Start development server**
   ```bash
   bun run dev
   ```

5. **Access application**
   - Open http://localhost:3000
   - Create account or sign in
   - Start using AI Novel Writer

## 📱 User Flow

1. **Landing Page** → Sign up/Login
2. **Dashboard** → Tool Grid + My Novels
3. **AI Novel Writer** (5 steps):
   - Step 1: Enter book idea → Generate concept
   - Step 2: Generate/select title options
   - Step 3: Generate/edit 3-act outline
   - Step 4: Generate cover prompt
   - Step 5: Write chapters with AI assistance
4. **Novel View** → Read complete novel, continue writing

## 🎯 MVP Success Criteria

✅ User can create and continue novels  
✅ All content persists in database  
✅ Mobile-friendly responsive design  
✅ No console errors  
✅ Complete novel writing workflow  
✅ Authentication system  
✅ AI integration for all steps  
✅ Error handling and loading states  

## 🔧 Development Commands

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run db:push      # Push schema to database
bun run db:generate  # Generate Prisma client
```

## 🚦 MVP Boundaries (Not Implemented)

- ❌ Billing system
- ❌ Usage limits
- ❌ Export functionality  
- ❌ Background autosave with conflict resolution
- ❌ Collaboration features
- ❌ Admin UI
- ❌ Notifications

## 📈 Next Steps (Post-MVP)

1. Add billing and subscription tiers
2. Implement export options (PDF, DOCX, etc.)
3. Add collaboration features
4. Build out additional writing tools
5. Implement advanced AI features
6. Add user analytics and insights

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Run tests and linting
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details