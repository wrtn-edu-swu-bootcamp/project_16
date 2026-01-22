# TweetLingo Development Guide

## Quick Start

### 1. Setup Environment

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Generate Prisma Client
npx prisma generate
```

### 2. Database Setup

**Option A: Local Postgres (Docker)**
```bash
docker-compose up -d
```

**Option B: Vercel Postgres**
- Create a Vercel Postgres database
- Copy DATABASE_URL and DIRECT_URL to .env.local

**Push schema:**
```bash
npx prisma db push
```

### 3. API Keys Setup

Get your API keys:

1. **Google Gemini API**: https://ai.google.dev/
2. **X API Bearer Token**: https://developer.twitter.com/
3. **Notion OAuth**: https://www.notion.so/my-integrations
4. **Google OAuth**: https://console.cloud.google.com/

Add them to `.env.local`:
```bash
GEMINI_API_KEY="your-key-here"
X_API_BEARER_TOKEN="your-token-here"
NOTION_CLIENT_ID="your-id-here"
NOTION_CLIENT_SECRET="your-secret-here"
GOOGLE_CLIENT_ID="your-id-here"
GOOGLE_CLIENT_SECRET="your-secret-here"
```

Generate secrets:
```bash
# AUTH_SECRET
openssl rand -base64 32

# ENCRYPTION_KEY
openssl rand -hex 32
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
tweetlingo/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/page.tsx        # Login with Google
│   │   └── signup/page.tsx       # Signup redirect
│   ├── (main)/                   # Protected routes
│   │   ├── analyze/page.tsx      # Tweet analysis
│   │   ├── vocabulary/page.tsx   # Saved words
│   │   ├── settings/page.tsx     # User settings
│   │   └── layout.tsx            # Protected layout
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth routes
│   │   ├── tweets/               # Tweet analysis API
│   │   ├── words/                # Vocabulary API
│   │   └── notion/               # Notion integration API
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   ├── error.tsx                 # Error boundary
│   ├── not-found.tsx             # 404 page
│   └── loading.tsx               # Loading state
├── components/
│   ├── ui/                       # Reusable components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   └── spinner.tsx
│   ├── features/                 # Feature components
│   │   ├── tweet-analyzer/
│   │   ├── vocabulary/
│   │   └── notion/
│   └── layout/                   # Layout components
│       ├── header.tsx
│       └── footer.tsx
├── lib/
│   ├── api/                      # External API clients
│   │   ├── gemini.ts             # Google Gemini
│   │   ├── x-api.ts              # X (Twitter)
│   │   ├── dictionary.ts         # Free Dictionary
│   │   └── notion.ts             # Notion
│   ├── auth/                     # Auth.js config
│   ├── db/                       # Database
│   ├── hooks/                    # React hooks
│   ├── types/                    # TypeScript types
│   └── utils/                    # Utilities
├── prisma/
│   └── schema.prisma             # Database schema
└── docs/                         # Documentation
```

## Key Features Implementation

### 1. Tweet Analysis Flow

1. User enters tweet URL
2. Extract tweet ID from URL
3. Fetch tweet content from X API
4. Use Gemini to detect language and extract words
5. For each word:
   - Translate to Korean (Gemini)
   - Get definition and pronunciation (Dictionary API)
6. Cache results in database
7. Display word cards with expand/collapse

### 2. Word Saving

1. User selects words to save
2. POST to `/api/words/save`
3. Store in Postgres database
4. Optional: Sync to Notion

### 3. Notion Integration

1. User clicks "Connect Notion" in settings
2. OAuth flow redirects to Notion
3. Store encrypted access token
4. User selects or creates database
5. Auto-sync new words to Notion

## Development Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format with Prettier
npm run type-check      # TypeScript validation

# Database
npm run db:push         # Push schema changes
npm run db:migrate      # Create migration
npm run db:studio       # Open Prisma Studio
npm run db:reset        # Reset database

# Git Hooks
npm run prepare         # Setup Husky hooks
```

## Testing Locally

1. **Login Flow**:
   - Go to http://localhost:3000
   - Click "시작하기"
   - Login with Google

2. **Tweet Analysis**:
   - Go to "분석" page
   - Enter a tweet URL (e.g., https://x.com/elonmusk/status/...)
   - Click "분석하기"
   - View extracted words

3. **Save Words**:
   - Click on word cards to expand
   - Click "저장하기" on individual words
   - Or click "전체 저장" to save all

4. **View Vocabulary**:
   - Go to "단어장" page
   - Filter by language or status
   - Click on words to view details

5. **Notion Integration**:
   - Go to "설정" page
   - Click "Notion 연동하기"
   - Complete OAuth flow
   - Save words and check they appear in Notion

## Deployment

### Vercel Deployment

1. **Create Vercel Project**:
```bash
vercel
```

2. **Setup Vercel Postgres**:
   - In Vercel dashboard, go to Storage
   - Create new Postgres database
   - Connect to your project

3. **Environment Variables**:
   - Add all env vars from `.env.local` to Vercel
   - Use Vercel CLI or dashboard

4. **Deploy**:
```bash
git push origin main
```

Vercel will automatically:
- Run `prisma generate`
- Run `prisma migrate deploy`
- Build Next.js app
- Deploy to production

### Post-Deployment

1. **Database Migration**:
   - Migrations run automatically on deploy
   - Check Vercel logs for errors

2. **Test Production**:
   - Visit your production URL
   - Test login flow
   - Test tweet analysis
   - Test Notion integration

3. **Monitor**:
   - Check Vercel Analytics
   - Monitor API response times
   - Watch for errors in logs

## Troubleshooting

### Common Issues

**1. Prisma Client not found**
```bash
npx prisma generate
```

**2. Database connection error**
- Check DATABASE_URL in .env.local
- Ensure database is running (Docker or Vercel)

**3. Gemini API error**
- Verify GEMINI_API_KEY is valid
- Check quota limits

**4. X API authentication failed**
- Verify X_API_BEARER_TOKEN
- Check API permissions

**5. Notion OAuth fails**
- Verify redirect URI matches your app URL
- Check NOTION_CLIENT_ID and NOTION_CLIENT_SECRET

## Performance Targets

- Tweet analysis: < 2 seconds
- Page load: < 1 second
- Notion sync: < 3 seconds
- Word extraction accuracy: > 90%

## Next Steps (Phase 2)

- iOS Share Extension
- Chrome Extension
- Auto-save and advanced filtering
- Review notifications
- Learning statistics

---

Built with Next.js 15, React 19, and TypeScript
