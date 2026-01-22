# TweetLingo

> Microlearning-based language learning from X (Twitter) tweets

X(트위터)에서 외국어 트윗을 읽을 때, 모르는 단어를 자동으로 추출하고 학습할 수 있도록 돕는 마이크로러닝 기반 실시간 언어 학습 도구입니다.

## ✨ Features

### Phase 1 (MVP) ✅
- 🔍 **트윗 분석**: X/Twitter 트윗에서 주요 단어 자동 추출
- 📚 **단어 정보**: 뜻, 발음, 예문을 카드 형태로 제공
- 💾 **단어장 관리**: 언어별, 상태별 필터링 및 검색
- 🔄 **Notion 연동**: 사용자의 Notion 데이터베이스에 자동 동기화
- 🌐 **다국어 지원**: 영어, 일본어, 중국어 ↔ 한국어

### Phase 2 (Current) ✅
- 🎯 **Chrome Extension**: 트윗을 읽으면서 바로 분석
- 💾 **자동 저장**: 설정한 조건에 따라 단어 자동 저장
- ⚙️ **고급 설정**: 언어별, 최소 단어 개수 설정
- 🚀 **One-Click Analysis**: X 페이지에서 버튼 클릭으로 즉시 분석

## 🚀 Quick Start

### Web App

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Visit http://localhost:3000

### Chrome Extension

```bash
# Navigate to extension directory
cd chrome-extension

# Install dependencies
npm install

# Build extension
npm run build

# Load in Chrome
# 1. Go to chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select chrome-extension/dist folder
```

## 🏗️ Tech Stack

### Frontend
- **Next.js 15.2** - React framework with App Router
- **React 19** - UI library with Server Components
- **TypeScript 5.7** - Type-safe development
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **TanStack Query v5** - Server state management
- **Zustand v5** - Client state management
- **Framer Motion 11** - Animation library

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma ORM 6** - Database ORM
- **Auth.js v5** - Authentication (Google OAuth)
- **PostgreSQL** - Main database (Vercel Postgres)

### Chrome Extension
- **React 19** - UI components
- **Vite 5** - Fast build tool
- **Manifest V3** - Latest Chrome Extension standard
- **TypeScript 5.7** - Type safety

### External APIs
- **Google Gemini 2.0 Flash** - NLP and word extraction
- **X API v2** - Tweet data extraction
- **Free Dictionary API** - Word definitions and pronunciation
- **Notion API v1** - Notion integration (OAuth 2.0)

## 📦 Project Structure

```
project_16/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── (main)/            # Protected pages (analyze, vocabulary, settings)
│   └── api/               # API routes
│       ├── auth/          # NextAuth routes
│       ├── tweets/        # Tweet analysis API
│       ├── words/         # Vocabulary API
│       ├── notion/        # Notion integration API
│       ├── settings/      # User settings API
│       └── extension/     # Extension auth API
├── chrome-extension/       # Chrome Extension
│   ├── src/
│   │   ├── background/    # Service Worker
│   │   ├── content-script/# X page integration
│   │   ├── popup/         # Extension popup UI
│   │   ├── sidebar/       # Side panel UI
│   │   └── shared/        # Shared utilities
│   ├── manifest.json      # Extension manifest
│   └── vite.config.ts     # Build configuration
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── features/         # Feature-specific components
│   └── layout/           # Layout components
├── lib/                  # Utilities and libraries
│   ├── api/             # External API clients
│   ├── auth/            # Auth.js configuration
│   ├── db/              # Database utilities
│   ├── hooks/           # React hooks
│   └── utils/           # Helper functions
├── prisma/              # Database schema and migrations
└── docs/                # Documentation
```

## 🔑 Environment Variables

Required environment variables (see `.env.example`):

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Auth
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"

# OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
NOTION_CLIENT_ID=""
NOTION_CLIENT_SECRET=""

# External APIs
GEMINI_API_KEY=""
X_API_BEARER_TOKEN=""

# Encryption
ENCRYPTION_KEY="generate-with-openssl-rand-hex-32"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🛠️ Development Commands

### Web App
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run type-check   # TypeScript validation

# Database
npm run db:push      # Push schema changes
npm run db:migrate   # Create migration
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database
```

### Chrome Extension
```bash
cd chrome-extension

npm run dev          # Watch mode for development
npm run build        # Production build
npm run type-check   # TypeScript validation
```

## 📖 Documentation

- [Development Guide](DEVELOPMENT.md) - Comprehensive development documentation
- [Architecture](docs/architecture.md) - System architecture and design patterns
- [Service Plan](docs/서비스_기획안.md) - Service specification (Korean)
- [Design Guide](docs/design_guide.md) - Design system and UI specifications
- [Wireframes](docs/wireframe.md) - UI wireframes and user flows

## 🎯 Roadmap

### Phase 1 (MVP) ✅ Completed
- [x] Web application with responsive design
- [x] Tweet analysis with Gemini AI
- [x] Vocabulary management system
- [x] Notion OAuth integration
- [x] Google authentication
- [x] Apple-inspired UI design

### Phase 2 (Extensions) ✅ Completed
- [x] Chrome Extension with Manifest V3
- [x] Content script for X/Twitter pages
- [x] Auto-save functionality
- [x] Extension popup and side panel
- [x] Settings page with auto-save options
- [x] One-click tweet analysis

### Phase 3 (Advanced) 🔜 Planned
- [ ] iOS Share Extension
- [ ] Advanced filtering and search
- [ ] Review notification system
- [ ] Learning statistics dashboard
- [ ] Spaced repetition algorithm
- [ ] Audio pronunciation playback
- [ ] Export vocabulary to CSV/JSON
- [ ] Multi-user support and sharing

## 🎨 Design System

Apple-inspired design principles:
- **Clarity**: Content-first, minimal decoration
- **Deference**: Interface doesn't overshadow content
- **Depth**: Subtle shadows and layered information

**Colors:**
- Primary: Sky Blue (#0EA5E9)
- Success: Green (#34C759)
- Error: Red (#FF3B30)
- Neutrals: System grays

**Typography:**
- Font: SF Pro Display system font stack
- Scale: 12px - 34px
- Weights: 400 (Regular), 600 (Semibold), 700 (Bold)

**Spacing:**
- 8pt grid system
- Consistent padding and margins

## 🔐 Security

- **Authentication**: Google OAuth 2.0 via Auth.js v5
- **Token Encryption**: AES-256-GCM for Notion access tokens
- **API Security**: Input validation with Zod
- **CORS**: Proper CORS headers for extension
- **Environment Variables**: Sensitive data in environment variables

## 📊 Performance

- **Tweet Analysis**: < 2 seconds target
- **Page Load**: < 1 second
- **Notion Sync**: < 3 seconds
- **Word Extraction Accuracy**: > 90%

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📧 Support

For questions or feedback:
- Open an issue on GitHub
- Check the [Development Guide](DEVELOPMENT.md)
- Review the [Architecture docs](docs/architecture.md)

---

**Built with ❤️ for language learners**
#   p r o j e c t _ 1 6 
 
 