# TweetLingo 코드 아키텍처

> 작성일: 2026년 1월 22일  
> 버전: 1.0  
> 기반 문서: [서비스_기획안.md](./서비스_기획안.md), [참고자료.md](./참고자료.md), [design_guide.md](./design_guide.md)

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [시스템 아키텍처](#3-시스템-아키텍처)
4. [프로젝트 구조](#4-프로젝트-구조)
5. [데이터베이스 스키마](#5-데이터베이스-스키마)
6. [API 설계](#6-api-설계)
7. [주요 기능별 구현 설계](#7-주요-기능별-구현-설계)
8. [상태 관리 전략](#8-상태-관리-전략)
9. [인증 및 보안](#9-인증-및-보안)
10. [성능 최적화](#10-성능-최적화)
11. [개발 환경 설정](#11-개발-환경-설정)
12. [배포 전략](#12-배포-전략)

---

## 1. 프로젝트 개요

### 1.1 서비스명

**TweetLingo** - X(트위터)에서 외국어 트윗을 읽을 때 단어를 자동 추출하고 학습할 수 있는 마이크로러닝 기반 언어 학습 도구

### 1.2 핵심 기능

1. **트윗 분석**: 트윗 URL 입력 시 주요 단어 자동 추출 (명사, 동사, 형용사, 부사)
2. **단어 정보 제공**: 뜻, 발음, 예문을 카드 형태로 제공
3. **단어장 관리**: 서비스 내 단어장에 저장 및 날짜별/언어별 필터링
4. **Notion 연동**: 사용자의 Notion 데이터베이스에 자동 저장 (선택사항)

### 1.3 지원 언어

- **1차 지원**: 영어, 일본어, 중국어
- **번역 방향**: 각 언어 ↔ 한국어 양방향

### 1.4 타겟 플랫폼

- **Phase 1 (MVP)**: 웹 애플리케이션 (반응형)
- **Phase 2**: iOS Share Extension, Chrome Extension
- **Phase 3**: 복습 알림, 학습 통계, 음성 발음

---

## 2. 기술 스택

### 2.1 프론트엔드

#### 핵심 프레임워크
```json
{
  "next": "15.2.x",
  "react": "19.0.x",
  "react-dom": "19.0.x",
  "typescript": "5.7.x"
}
```

**선택 이유:**
- **Next.js 15.2**: React 19 지원, App Router 안정화, Turbopack 개발 환경 지원
- **React 19**: Server Components, Suspense, useActionState 등 최신 기능
- **TypeScript 5.7**: 타입 안정성 및 개발 생산성 향상

#### UI 및 스타일링
```json
{
  "tailwindcss": "4.1.18",
  "@tailwindcss/typography": "^0.5.15",
  "framer-motion": "^11.11.x",
  "class-variance-authority": "^0.7.x",
  "clsx": "^2.1.x",
  "tailwind-merge": "^2.5.x"
}
```

**선택 이유:**
- **Tailwind CSS v4.1.18**: 최신 안정 버전, Apple-inspired 디자인 시스템 구현
- **Framer Motion**: 부드러운 애니메이션 및 트랜지션
- **CVA + clsx + tailwind-merge**: 컴포넌트 변형 및 스타일 유틸리티

#### 아이콘 및 폰트
```json
{
  "@heroicons/react": "^2.2.x",
  "next/font": "built-in"
}
```

**선택 이유:**
- **Heroicons**: Tailwind 제작사의 아이콘, SF Symbols 스타일
- **next/font**: 자동 폰트 최적화 (Pretendard, Noto Sans KR)

#### 상태 관리 및 데이터 페칭
```json
{
  "@tanstack/react-query": "^5.x",
  "zustand": "^5.0.x"
}
```

**선택 이유:**
- **TanStack Query v5**: 서버 상태 관리, Server Components 지원, 캐싱 및 동기화
- **Zustand**: 간단한 클라이언트 전역 상태 관리 (UI 상태, 사용자 설정 등)

### 2.2 백엔드

#### API 및 서버리스
```json
{
  "next": "15.2.x"
}
```

**선택 이유:**
- **Next.js API Routes**: Vercel 서버리스 함수로 자동 배포
- **App Router**: 파일 기반 라우팅, 서버 액션 지원

#### 데이터베이스 ORM
```json
{
  "prisma": "^6.x",
  "@prisma/client": "^6.x",
  "@prisma/adapter-neon": "^6.x"
}
```

**선택 이유:**
- **Prisma ORM 6**: TypeScript 우선, ESM 지원, Rust-free 클라이언트, Neon 어댑터 지원
- **Neon Adapter**: Vercel Postgres(Neon) 최적화

#### 데이터베이스
- **Vercel Postgres (Neon)**: 서버리스 Postgres, 오토스케일링, Free Tier 제공

### 2.3 인증

```json
{
  "@auth/core": "^0.37.x",
  "@auth/prisma-adapter": "^2.7.x",
  "next-auth": "^5.0.0-beta"
}
```

**선택 이유:**
- **Auth.js v5** (NextAuth.js 후속): App Router 완전 지원, 통합 `auth()` 메서드
- **OAuth 2.0**: Google, Notion 연동
- **Prisma Adapter**: 데이터베이스 세션 관리

### 2.4 외부 API

#### AI/NLP 및 번역
- **Google Gemini 2.0 Flash API**: 언어 감지, 품사 태깅, 단어 추출 ($0.10/1M input tokens)
- **Free Dictionary API**: 단어 정의 및 발음 (무료)

#### 소셜 미디어
- **X API v2**: 트윗 데이터 추출 (Free Tier: 100 reads/month)

#### 생산성 도구
- **Notion API v1**: 사용자 단어장 자동 저장 (OAuth 2.0)

### 2.5 배포 및 인프라

#### 호스팅
- **Vercel**: Next.js 최적화 플랫폼, 자동 CI/CD, Edge Functions 지원

#### 스토리지
- **Vercel Postgres (Neon)**: 메인 데이터베이스
- **Vercel Blob Storage**: 이미지 및 미디어 파일 (필요 시)
- **Vercel Edge Config**: 환경 설정 및 Feature Flags

#### 모니터링
- **Vercel Analytics**: 성능 및 사용자 분석
- **Vercel Logs**: 서버리스 함수 로그

### 2.6 개발 도구

```json
{
  "eslint": "^9.x",
  "eslint-config-next": "15.2.x",
  "prettier": "^3.x",
  "prettier-plugin-tailwindcss": "^0.6.x",
  "husky": "^9.x",
  "lint-staged": "^15.x"
}
```

**선택 이유:**
- **ESLint 9**: 최신 린팅 규칙
- **Prettier + Tailwind Plugin**: 일관된 코드 포맷팅
- **Husky + lint-staged**: Git hook 자동화

---

## 3. 시스템 아키텍처

### 3.1 전체 시스템 다이어그램

```mermaid
graph TB
    subgraph Client [클라이언트]
        Browser[웹 브라우저]
        Mobile[모바일 Safari/Chrome]
    end

    subgraph Vercel [Vercel Platform]
        subgraph Frontend [Frontend Edge]
            NextApp[Next.js 15 App]
            StaticAssets[정적 자산]
        end

        subgraph Backend [Serverless Functions]
            APIRoutes[API Routes]
            ServerActions[Server Actions]
        end

        subgraph Database [Data Layer]
            Postgres[(Vercel Postgres)]
            EdgeConfig[Edge Config]
        end
    end

    subgraph ExternalAPIs [외부 API]
        GeminiAPI[Google Gemini 2.0 Flash]
        XAPI[X API v2]
        DictAPI[Free Dictionary API]
        NotionAPI[Notion API v1]
    end

    Browser --> NextApp
    Mobile --> NextApp
    NextApp --> APIRoutes
    NextApp --> ServerActions
    
    APIRoutes --> Postgres
    ServerActions --> Postgres
    
    APIRoutes --> GeminiAPI
    APIRoutes --> XAPI
    APIRoutes --> DictAPI
    APIRoutes --> NotionAPI
    
    EdgeConfig --> APIRoutes
```

### 3.2 데이터 흐름도

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Web as Next.js App
    participant API as API Routes
    participant DB as Postgres
    participant Gemini as Gemini API
    participant Dict as Dictionary API
    participant Notion as Notion API

    User->>Web: 트윗 URL 입력
    Web->>API: POST /api/tweets/analyze
    API->>DB: 트윗 캐시 확인
    
    alt 캐시 없음
        API->>Gemini: 언어 감지 + 단어 추출
        Gemini-->>API: 단어 목록 (JSON)
        API->>Dict: 각 단어 정의/발음 조회
        Dict-->>API: 단어 정보
        API->>DB: 분석 결과 캐싱
    else 캐시 있음
        DB-->>API: 캐시된 결과
    end
    
    API-->>Web: 단어 목록 반환
    Web-->>User: 단어 카드 표시
    
    User->>Web: 단어 저장 요청
    Web->>API: POST /api/words/save
    API->>DB: 단어 저장
    
    opt Notion 연동 활성화
        API->>Notion: Create Page
        Notion-->>API: 성공
    end
    
    API-->>Web: 저장 완료
    Web-->>User: 성공 메시지
```

### 3.3 배포 아키텍처

```mermaid
graph LR
    subgraph GitHub
        Repo[Git Repository]
    end

    subgraph Vercel
        subgraph Production
            ProdEdge[Edge Network]
            ProdFunctions[Serverless Functions]
            ProdDB[(Postgres - Production)]
        end

        subgraph Preview
            PreviewEdge[Preview Deployment]
            PreviewFunctions[Preview Functions]
            PreviewDB[(Postgres - Preview)]
        end

        subgraph Development
            DevLocal[Local Development]
            DevDB[(Postgres - Dev)]
        end
    end

    Repo -->|Push to main| Production
    Repo -->|Pull Request| Preview
    DevLocal -->|npm run dev| DevDB

    ProdEdge --> ProdFunctions
    ProdFunctions --> ProdDB
    
    PreviewEdge --> PreviewFunctions
    PreviewFunctions --> PreviewDB
```

---

## 4. 프로젝트 구조

### 4.1 디렉토리 구조

```
tweetlingo/
├── .cursor/                 # Cursor IDE 설정
│   └── rules/
├── .github/                 # GitHub Actions (CI/CD)
│   └── workflows/
├── app/                     # Next.js 15 App Router
│   ├── (auth)/              # 인증 라우트 그룹
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (main)/              # 메인 앱 라우트 그룹
│   │   ├── analyze/         # 트윗 분석 페이지
│   │   │   └── page.tsx
│   │   ├── vocabulary/      # 단어장 페이지
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── settings/        # 설정 페이지
│   │   │   └── page.tsx
│   │   └── layout.tsx       # 메인 레이아웃
│   ├── api/                 # API Routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── tweets/
│   │   │   ├── analyze/
│   │   │   │   └── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── words/
│   │   │   ├── route.ts
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── save/
│   │   │       └── route.ts
│   │   └── notion/
│   │       ├── connect/
│   │       │   └── route.ts
│   │       ├── sync/
│   │       │   └── route.ts
│   │       └── disconnect/
│   │           └── route.ts
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 홈페이지
│   ├── error.tsx            # 에러 페이지
│   ├── loading.tsx          # 로딩 UI
│   └── not-found.tsx        # 404 페이지
├── components/              # React 컴포넌트
│   ├── ui/                  # 재사용 가능한 UI 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   └── spinner.tsx
│   ├── features/            # 기능별 컴포넌트
│   │   ├── tweet-analyzer/
│   │   │   ├── tweet-input.tsx
│   │   │   ├── word-card.tsx
│   │   │   └── word-list.tsx
│   │   ├── vocabulary/
│   │   │   ├── word-item.tsx
│   │   │   ├── filter-bar.tsx
│   │   │   └── vocabulary-stats.tsx
│   │   └── notion/
│   │       ├── notion-connect-button.tsx
│   │       └── notion-sync-status.tsx
│   └── layout/              # 레이아웃 컴포넌트
│       ├── header.tsx
│       ├── footer.tsx
│       ├── sidebar.tsx
│       └── navigation.tsx
├── lib/                     # 유틸리티 및 라이브러리
│   ├── api/                 # API 클라이언트
│   │   ├── gemini.ts
│   │   ├── x-api.ts
│   │   ├── dictionary.ts
│   │   └── notion.ts
│   ├── db/                  # 데이터베이스 유틸
│   │   ├── prisma.ts
│   │   └── queries/
│   │       ├── words.ts
│   │       ├── users.ts
│   │       └── tweets.ts
│   ├── hooks/               # Custom React Hooks
│   │   ├── use-tweet-analysis.ts
│   │   ├── use-vocabulary.ts
│   │   └── use-notion-sync.ts
│   ├── utils/               # 유틸리티 함수
│   │   ├── cn.ts            # className 병합
│   │   ├── date.ts          # 날짜 포맷팅
│   │   ├── language.ts      # 언어 감지/변환
│   │   └── validation.ts    # 입력 검증
│   ├── types/               # TypeScript 타입 정의
│   │   ├── api.ts
│   │   ├── word.ts
│   │   ├── tweet.ts
│   │   └── notion.ts
│   └── constants.ts         # 상수 정의
├── prisma/                  # Prisma 설정
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/                  # 정적 파일
│   ├── icons/
│   ├── images/
│   └── fonts/
├── styles/                  # 전역 스타일
│   └── globals.css
├── docs/                    # 문서
│   ├── architecture.md      # (이 파일)
│   ├── design_guide.md
│   ├── wireframe.md
│   ├── 서비스_기획안.md
│   └── 참고자료.md
├── .env.local               # 로컬 환경 변수
├── .env.example             # 환경 변수 예시
├── .eslintrc.json           # ESLint 설정
├── .prettierrc              # Prettier 설정
├── next.config.ts           # Next.js 설정
├── tailwind.config.ts       # Tailwind CSS 설정
├── tsconfig.json            # TypeScript 설정
├── package.json
└── README.md
```

### 4.2 파일 네이밍 규칙

#### 컴포넌트
- **PascalCase**: `WordCard.tsx`, `TweetInput.tsx`
- **kebab-case**: `word-card.tsx`, `tweet-input.tsx` (권장)

#### 유틸리티 및 훅
- **kebab-case**: `use-tweet-analysis.ts`, `cn.ts`

#### API 라우트
- **kebab-case**: `analyze/route.ts`

#### 타입 정의
- **kebab-case**: `word.ts`, `api.ts`
- **Interface/Type 이름**: PascalCase (`Word`, `ApiResponse`)

### 4.3 컴포넌트 구성 원칙

#### Server Components (기본)
```tsx
// app/(main)/vocabulary/page.tsx
import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { getVocabulary } from '@/lib/db/queries/words'
import { VocabularyList } from '@/components/features/vocabulary/word-list'

export default async function VocabularyPage() {
  const session = await auth()
  if (!session) redirect('/login')
  
  const words = await getVocabulary(session.user.id)
  
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <VocabularyList words={words} />
    </Suspense>
  )
}
```

#### Client Components (`'use client'`)
```tsx
// components/features/tweet-analyzer/tweet-input.tsx
'use client'

import { useState } from 'react'
import { useTweetAnalysis } from '@/lib/hooks/use-tweet-analysis'

export function TweetInput() {
  const [url, setUrl] = useState('')
  const { mutate, isPending } = useTweetAnalysis()
  
  // ...
}
```

---

## 5. 데이터베이스 스키마

### 5.1 Prisma 스키마

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../node_modules/.prisma/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 사용자 모델
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  words         Word[]
  tweets        Tweet[]
  notionIntegration NotionIntegration?
  settings      UserSettings?

  @@map("users")
}

// Auth.js 관련 모델
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// 트윗 모델
model Tweet {
  id        String   @id @default(cuid())
  tweetId   String   @unique // X API 트윗 ID
  url       String
  text      String   @db.Text
  author    String?
  language  Language
  analyzedAt DateTime @default(now())
  userId    String
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  words     Word[]

  @@index([userId])
  @@index([tweetId])
  @@map("tweets")
}

// 단어 모델
model Word {
  id            String       @id @default(cuid())
  lemma         String       // 원형 (finish)
  original      String       // 원문 (finished)
  language      Language
  partOfSpeech  PartOfSpeech
  translation   String       // 한국어 번역
  definition    String?      // 영문 정의 (선택)
  ipaNotation   String?      // IPA 발음 [ˈfɪnɪʃ]
  hangulNotation String?     // 한글 발음 (피니쉬)
  example       String       @db.Text // 예문 (원본 트윗)
  status        WordStatus   @default(LEARNING)
  savedAt       DateTime     @default(now())
  reviewDate    DateTime?    // 복습 날짜
  userId        String
  tweetId       String?
  
  user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  tweet         Tweet?       @relation(fields: [tweetId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([language])
  @@index([status])
  @@map("words")
}

// Notion 연동 정보
model NotionIntegration {
  id                 String   @id @default(cuid())
  userId             String   @unique
  accessToken        String   @db.Text // 암호화 저장
  workspaceId        String?
  workspaceName      String?
  databaseId         String?  // 연동된 데이터베이스 ID
  databaseName       String?
  isActive           Boolean  @default(true)
  autoSync           Boolean  @default(false)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  lastSyncAt         DateTime?

  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("notion_integrations")
}

// 사용자 설정
model UserSettings {
  id                    String   @id @default(cuid())
  userId                String   @unique
  targetLanguage        Language @default(KO) // 번역 대상 언어
  defaultSourceLanguage Language @default(EN) // 기본 학습 언어
  notificationsEnabled  Boolean  @default(true)
  reviewReminderTime    String?  // "09:00" 형식
  theme                 Theme    @default(LIGHT)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_settings")
}

// Enum 타입
enum Language {
  EN  // 영어
  JA  // 일본어
  ZH  // 중국어
  KO  // 한국어
}

enum PartOfSpeech {
  NOUN      // 명사
  VERB      // 동사
  ADJECTIVE // 형용사
  ADVERB    // 부사
}

enum WordStatus {
  LEARNING  // 학습중
  REVIEW    // 복습필요
  MASTERED  // 완료
}

enum Theme {
  LIGHT
  DARK
  SYSTEM
}
```

### 5.2 데이터베이스 관계 다이어그램

```mermaid
erDiagram
    User ||--o{ Account : has
    User ||--o{ Session : has
    User ||--o{ Word : saves
    User ||--o{ Tweet : analyzes
    User ||--|| NotionIntegration : has
    User ||--|| UserSettings : has
    Tweet ||--o{ Word : contains
    
    User {
        string id PK
        string email UK
        string name
        string image
        datetime createdAt
        datetime updatedAt
    }
    
    Account {
        string id PK
        string userId FK
        string provider
        string providerAccountId
        string access_token
        string refresh_token
    }
    
    Session {
        string id PK
        string userId FK
        string sessionToken UK
        datetime expires
    }
    
    Tweet {
        string id PK
        string tweetId UK
        string url
        string text
        Language language
        string userId FK
        datetime analyzedAt
    }
    
    Word {
        string id PK
        string lemma
        string original
        Language language
        PartOfSpeech partOfSpeech
        string translation
        string definition
        string ipaNotation
        string hangulNotation
        string example
        WordStatus status
        datetime savedAt
        datetime reviewDate
        string userId FK
        string tweetId FK
    }
    
    NotionIntegration {
        string id PK
        string userId FK UK
        string accessToken
        string databaseId
        boolean isActive
        boolean autoSync
        datetime lastSyncAt
    }
    
    UserSettings {
        string id PK
        string userId FK UK
        Language targetLanguage
        Language defaultSourceLanguage
        boolean notificationsEnabled
        string reviewReminderTime
        Theme theme
    }
```

### 5.3 인덱스 전략

```sql
-- 성능 최적화를 위한 인덱스
CREATE INDEX idx_words_user_id ON words(user_id);
CREATE INDEX idx_words_language ON words(language);
CREATE INDEX idx_words_status ON words(status);
CREATE INDEX idx_words_saved_at ON words(saved_at DESC);

CREATE INDEX idx_tweets_user_id ON tweets(user_id);
CREATE INDEX idx_tweets_tweet_id ON tweets(tweet_id);

-- 복합 인덱스
CREATE INDEX idx_words_user_status ON words(user_id, status);
CREATE INDEX idx_words_user_language ON words(user_id, language);
```

---

## 6. API 설계

### 6.1 RESTful API 엔드포인트

#### 인증 API

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/api/auth/session` | 현재 세션 조회 | - |
| POST | `/api/auth/signin` | 로그인 | - |
| POST | `/api/auth/signout` | 로그아웃 | Required |

#### 트윗 분석 API

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|----------|------|------|
| POST | `/api/tweets/analyze` | 트윗 URL 분석 | Required |
| GET | `/api/tweets/:id` | 분석된 트윗 조회 | Required |
| GET | `/api/tweets` | 분석 이력 조회 | Required |

#### 단어장 API

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/api/words` | 단어 목록 조회 (필터링 지원) | Required |
| POST | `/api/words/save` | 단어 저장 | Required |
| GET | `/api/words/:id` | 단어 상세 조회 | Required |
| PATCH | `/api/words/:id` | 단어 상태 업데이트 | Required |
| DELETE | `/api/words/:id` | 단어 삭제 | Required |

#### Notion 연동 API

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|----------|------|------|
| POST | `/api/notion/connect` | Notion OAuth 연동 시작 | Required |
| GET | `/api/notion/callback` | OAuth 콜백 처리 | Required |
| POST | `/api/notion/sync` | 단어장 동기화 | Required |
| DELETE | `/api/notion/disconnect` | Notion 연동 해제 | Required |

#### 설정 API

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/api/settings` | 사용자 설정 조회 | Required |
| PATCH | `/api/settings` | 사용자 설정 업데이트 | Required |

### 6.2 API 요청/응답 스펙

#### POST /api/tweets/analyze

**요청 Body:**
```typescript
{
  url: string // 트윗 URL
}
```

**응답 200:**
```typescript
{
  tweetId: string
  tweet: {
    id: string
    text: string
    author: string
    language: "EN" | "JA" | "ZH"
    url: string
  }
  words: Array<{
    lemma: string
    original: string
    partOfSpeech: "NOUN" | "VERB" | "ADJECTIVE" | "ADVERB"
    translation: string
    definition?: string
    pronunciation: {
      ipa?: string
      hangul?: string
    }
    example: string
  }>
  analyzedAt: string // ISO 8601
}
```

**에러 응답:**
```typescript
// 400 Bad Request
{
  error: "INVALID_URL" | "INVALID_TWEET" | "UNSUPPORTED_LANGUAGE"
  message: string
}

// 429 Too Many Requests
{
  error: "RATE_LIMIT_EXCEEDED"
  message: string
  retryAfter: number // seconds
}

// 500 Internal Server Error
{
  error: "API_ERROR" | "GEMINI_ERROR" | "DATABASE_ERROR"
  message: string
}
```

#### POST /api/words/save

**요청 Body:**
```typescript
{
  words: Array<{
    lemma: string
    original: string
    language: "EN" | "JA" | "ZH"
    partOfSpeech: "NOUN" | "VERB" | "ADJECTIVE" | "ADVERB"
    translation: string
    definition?: string
    ipaNotation?: string
    hangulNotation?: string
    example: string
    tweetId?: string
  }>
  syncToNotion?: boolean // Notion 동기화 여부
}
```

**응답 200:**
```typescript
{
  savedWords: Array<{
    id: string
    lemma: string
    savedAt: string
  }>
  notionSynced?: boolean
}
```

#### GET /api/words

**쿼리 파라미터:**
```typescript
{
  language?: "EN" | "JA" | "ZH" | "KO"
  status?: "LEARNING" | "REVIEW" | "MASTERED"
  sortBy?: "savedAt" | "lemma" | "reviewDate"
  order?: "asc" | "desc"
  page?: number
  limit?: number // 기본 20
}
```

**응답 200:**
```typescript
{
  words: Array<{
    id: string
    lemma: string
    original: string
    language: "EN" | "JA" | "ZH"
    partOfSpeech: "NOUN" | "VERB" | "ADJECTIVE" | "ADVERB"
    translation: string
    pronunciation: {
      ipa?: string
      hangul?: string
    }
    example: string
    status: "LEARNING" | "REVIEW" | "MASTERED"
    savedAt: string
    reviewDate?: string
    tweet?: {
      id: string
      url: string
      text: string
    }
  }>
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
```

### 6.3 API 라우트 구현 예시

#### app/api/tweets/analyze/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { analyzeTweet } from '@/lib/api/tweet-analyzer'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const analyzeSchema = z.object({
  url: z.string().url()
})

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      )
    }

    // 요청 검증
    const body = await request.json()
    const { url } = analyzeSchema.parse(body)

    // 트윗 분석
    const result = await analyzeTweet(url, session.user.id)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'INVALID_REQUEST', message: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('[API] Tweet analysis error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to analyze tweet' },
      { status: 500 }
    )
  }
}
```

---

## 7. 주요 기능별 구현 설계

### 7.1 트윗 분석 워크플로우

```mermaid
flowchart TD
    Start[사용자 트윗 URL 입력] --> Validate[URL 검증]
    Validate -->|Invalid| Error1[에러: 잘못된 URL]
    Validate -->|Valid| CheckCache{캐시 확인}
    
    CheckCache -->|Hit| ReturnCache[캐시된 결과 반환]
    CheckCache -->|Miss| FetchTweet[X API: 트윗 데이터 추출]
    
    FetchTweet -->|Success| DetectLang[Gemini: 언어 감지]
    FetchTweet -->|Error| Error2[에러: 트윗 로드 실패]
    
    DetectLang --> CheckSupported{지원 언어?}
    CheckSupported -->|No| Error3[에러: 미지원 언어]
    CheckSupported -->|Yes| ExtractWords[Gemini: 단어 추출 + 품사 태깅]
    
    ExtractWords --> CheckCount{단어 개수}
    CheckCount -->|< 3| Error4[에러: 학습 단어 부족]
    CheckCount -->|>= 3| EnrichWords[각 단어 정보 수집]
    
    EnrichWords --> DictAPI[Dictionary API: 정의/발음]
    DictAPI -->|Success| SaveCache[분석 결과 캐싱]
    DictAPI -->|Error| FallbackGemini[Gemini: 정의 생성]
    
    FallbackGemini --> SaveCache
    SaveCache --> ReturnResult[결과 반환]
    
    ReturnCache --> End[완료]
    ReturnResult --> End
```

#### 구현 코드 예시

```typescript
// lib/api/tweet-analyzer.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import { fetchTweet } from './x-api'
import { getDictionaryEntry } from './dictionary'
import { prisma } from '../db/prisma'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function analyzeTweet(url: string, userId: string) {
  // 1. 캐시 확인
  const tweetId = extractTweetId(url)
  const cached = await prisma.tweet.findUnique({
    where: { tweetId },
    include: { words: true }
  })
  
  if (cached && cached.userId === userId) {
    return formatResponse(cached)
  }

  // 2. 트윗 데이터 가져오기
  const tweetData = await fetchTweet(tweetId)
  if (!tweetData) {
    throw new Error('TWEET_NOT_FOUND')
  }

  // 3. Gemini로 언어 감지 및 단어 추출
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  
  const prompt = `
    Analyze the following tweet and extract key words:
    "${tweetData.text}"
    
    Tasks:
    1. Detect language (EN, JA, or ZH)
    2. Extract nouns, verbs, adjectives, and adverbs
    3. Exclude articles, prepositions, conjunctions, pronouns
    4. Return JSON: { "language": "EN", "words": [{"original": "finished", "lemma": "finish", "pos": "verb"}] }
  `
  
  const result = await model.generateContent(prompt)
  const analysis = JSON.parse(result.response.text())

  // 4. 각 단어 정보 수집
  const enrichedWords = await Promise.all(
    analysis.words.map(async (word: any) => {
      const dictEntry = await getDictionaryEntry(word.lemma, analysis.language)
      return {
        ...word,
        translation: dictEntry?.translation || await translateWithGemini(word.lemma),
        definition: dictEntry?.definition,
        ipa: dictEntry?.phonetics?.[0]?.text,
        example: tweetData.text
      }
    })
  )

  // 5. 데이터베이스에 저장
  const tweet = await prisma.tweet.create({
    data: {
      tweetId,
      url,
      text: tweetData.text,
      author: tweetData.author_id,
      language: analysis.language,
      userId,
      words: {
        create: enrichedWords.map(word => ({
          lemma: word.lemma,
          original: word.original,
          language: analysis.language,
          partOfSpeech: word.pos.toUpperCase(),
          translation: word.translation,
          definition: word.definition,
          ipaNotation: word.ipa,
          example: word.example,
          userId
        }))
      }
    },
    include: { words: true }
  })

  return formatResponse(tweet)
}
```

### 7.2 단어 추출 및 번역 로직

#### 단어 추출 프롬프트 (Gemini)

```typescript
// lib/api/prompts/word-extraction.ts
export const WORD_EXTRACTION_PROMPT = `
You are a language learning assistant. Analyze the tweet and extract vocabulary suitable for language learners.

Tweet: "{tweetText}"

Instructions:
1. Detect the language (EN, JA, or ZH)
2. Extract important words:
   - Include: nouns, verbs, adjectives, adverbs
   - Exclude: articles (a, an, the), prepositions (in, on, at), conjunctions (and, but, or), basic pronouns (I, you, he, she, it)
   - For each word, identify its base form (lemma)
3. For hashtags, remove # and treat as regular words
4. Ignore mentions (@username), emojis, numbers, URLs

Return JSON format:
{
  "language": "EN" | "JA" | "ZH",
  "words": [
    {
      "original": "reading",
      "lemma": "read",
      "pos": "verb"
    }
  ]
}

Requirements:
- Extract 3-15 words
- If less than 3 words, return empty array
- Prioritize context-relevant vocabulary
`

export function buildExtractionPrompt(tweetText: string): string {
  return WORD_EXTRACTION_PROMPT.replace('{tweetText}', tweetText)
}
```

#### 번역 로직

```typescript
// lib/api/translation.ts
export async function translateWord(
  word: string,
  sourceLang: Language,
  targetLang: Language = 'KO'
): Promise<string> {
  try {
    // Gemini로 번역 (문맥 기반)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    
    const prompt = `
      Translate the word "${word}" from ${sourceLang} to ${targetLang}.
      Provide the most common 1-2 meanings, separated by commas.
      Return only the translation, no explanation.
    `
    
    const result = await model.generateContent(prompt)
    return result.response.text().trim()
  } catch (error) {
    console.error('Translation error:', error)
    throw new Error('TRANSLATION_FAILED')
  }
}
```

### 7.3 Notion 연동 프로세스

```mermaid
sequenceDiagram
    participant User
    participant App
    participant API
    participant Notion
    participant DB

    User->>App: Notion 연동 클릭
    App->>API: POST /api/notion/connect
    API->>Notion: OAuth 인증 요청
    Notion-->>User: 로그인 및 권한 승인 페이지
    User->>Notion: 권한 승인
    Notion->>API: OAuth 콜백 + Access Token
    API->>DB: Access Token 암호화 저장
    API->>Notion: 데이터베이스 목록 조회
    API-->>App: 연동 완료 + DB 선택 UI
    App-->>User: 데이터베이스 선택

    User->>App: 단어 저장 + Notion 동기화
    App->>API: POST /api/words/save (syncToNotion: true)
    API->>DB: 단어 저장
    API->>DB: Notion Access Token 조회
    API->>Notion: Create Page in Database
    Notion-->>API: Success
    API->>DB: lastSyncAt 업데이트
    API-->>App: 저장 완료
    App-->>User: 성공 메시지
```

#### OAuth 연동 구현

```typescript
// app/api/notion/connect/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.redirect('/login')
  }

  const notionAuthUrl = new URL('https://api.notion.com/v1/oauth/authorize')
  notionAuthUrl.searchParams.set('client_id', process.env.NOTION_CLIENT_ID!)
  notionAuthUrl.searchParams.set('response_type', 'code')
  notionAuthUrl.searchParams.set('owner', 'user')
  notionAuthUrl.searchParams.set(
    'redirect_uri',
    `${process.env.NEXT_PUBLIC_APP_URL}/api/notion/callback`
  )

  return NextResponse.redirect(notionAuthUrl.toString())
}
```

```typescript
// app/api/notion/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { encrypt } from '@/lib/utils/encryption'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.redirect('/login')
  }

  const code = request.nextUrl.searchParams.get('code')
  if (!code) {
    return NextResponse.redirect('/settings?error=notion_auth_failed')
  }

  try {
    // Access Token 교환
    const tokenResponse = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
        ).toString('base64')}`
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/notion/callback`
      })
    })

    const tokenData = await tokenResponse.json()

    // Access Token 암호화하여 저장
    const encryptedToken = encrypt(tokenData.access_token)

    await prisma.notionIntegration.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        accessToken: encryptedToken,
        workspaceId: tokenData.workspace_id,
        workspaceName: tokenData.workspace_name,
        isActive: true
      },
      update: {
        accessToken: encryptedToken,
        workspaceId: tokenData.workspace_id,
        workspaceName: tokenData.workspace_name,
        isActive: true
      }
    })

    return NextResponse.redirect('/settings?notion_connected=true')
  } catch (error) {
    console.error('[Notion] OAuth error:', error)
    return NextResponse.redirect('/settings?error=notion_auth_failed')
  }
}
```

#### Notion 동기화 로직

```typescript
// lib/api/notion.ts
import { Client } from '@notionhq/client'
import { decrypt } from '../utils/encryption'
import { prisma } from '../db/prisma'

export async function syncWordToNotion(
  userId: string,
  word: {
    lemma: string
    translation: string
    pronunciation?: string
    example: string
    language: string
    partOfSpeech: string
    tweetUrl?: string
  }
) {
  // Notion 연동 정보 가져오기
  const integration = await prisma.notionIntegration.findUnique({
    where: { userId }
  })

  if (!integration || !integration.isActive || !integration.databaseId) {
    throw new Error('NOTION_NOT_CONNECTED')
  }

  const accessToken = decrypt(integration.accessToken)
  const notion = new Client({ auth: accessToken })

  // Notion 페이지 생성
  await notion.pages.create({
    parent: { database_id: integration.databaseId },
    properties: {
      '단어': {
        title: [{ text: { content: word.lemma } }]
      },
      '뜻': {
        rich_text: [{ text: { content: word.translation } }]
      },
      '발음': {
        rich_text: word.pronunciation
          ? [{ text: { content: word.pronunciation } }]
          : []
      },
      '예문': {
        rich_text: [{ text: { content: word.example } }]
      },
      '언어': {
        select: { name: getLanguageName(word.language) }
      },
      '품사': {
        select: { name: getPartOfSpeechName(word.partOfSpeech) }
      },
      '출처': word.tweetUrl
        ? {
            url: word.tweetUrl
          }
        : undefined,
      '학습 날짜': {
        date: { start: new Date().toISOString() }
      },
      '상태': {
        select: { name: '학습중' }
      }
    }
  })

  // 동기화 시간 업데이트
  await prisma.notionIntegration.update({
    where: { userId },
    data: { lastSyncAt: new Date() }
  })
}
```

### 7.4 단어장 관리

#### 필터링 및 정렬

```typescript
// lib/db/queries/words.ts
import { prisma } from '../prisma'
import { Language, WordStatus } from '@prisma/client'

export interface GetVocabularyOptions {
  userId: string
  language?: Language
  status?: WordStatus
  sortBy?: 'savedAt' | 'lemma' | 'reviewDate'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export async function getVocabulary(options: GetVocabularyOptions) {
  const {
    userId,
    language,
    status,
    sortBy = 'savedAt',
    order = 'desc',
    page = 1,
    limit = 20
  } = options

  const where: any = { userId }
  if (language) where.language = language
  if (status) where.status = status

  const [words, total] = await Promise.all([
    prisma.word.findMany({
      where,
      orderBy: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        tweet: {
          select: {
            id: true,
            url: true,
            text: true
          }
        }
      }
    }),
    prisma.word.count({ where })
  ])

  return {
    words,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export async function updateWordStatus(
  wordId: string,
  userId: string,
  status: WordStatus
) {
  return prisma.word.update({
    where: { id: wordId, userId },
    data: {
      status,
      reviewDate: status === 'REVIEW' ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) : null
    }
  })
}
```

---

## 8. 상태 관리 전략

### 8.1 서버 상태 (TanStack Query)

```typescript
// lib/hooks/use-tweet-analysis.ts
'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useTweetAnalysis() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (url: string) => {
      const response = await fetch('/api/tweets/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Analysis failed')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tweets'] })
    }
  })
}

export function useVocabulary(filters?: VocabularyFilters) {
  return useQuery({
    queryKey: ['vocabulary', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters as any)
      const response = await fetch(`/api/words?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch vocabulary')
      }
      
      return response.json()
    },
    staleTime: 1000 * 60 * 5 // 5분
  })
}
```

### 8.2 클라이언트 상태 (Zustand)

```typescript
// lib/store/ui-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  filterPanelOpen: boolean
  
  setTheme: (theme: UIState['theme']) => void
  toggleSidebar: () => void
  toggleFilterPanel: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarOpen: true,
      filterPanelOpen: false,
      
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleFilterPanel: () => set((state) => ({ filterPanelOpen: !state.filterPanelOpen }))
    }),
    {
      name: 'tweetlingo-ui'
    }
  )
)
```

```typescript
// lib/store/vocabulary-filter-store.ts
import { create } from 'zustand'
import { Language, WordStatus } from '@prisma/client'

interface VocabularyFilterState {
  language?: Language
  status?: WordStatus
  sortBy: 'savedAt' | 'lemma' | 'reviewDate'
  order: 'asc' | 'desc'
  
  setLanguage: (language?: Language) => void
  setStatus: (status?: WordStatus) => void
  setSortBy: (sortBy: VocabularyFilterState['sortBy']) => void
  setOrder: (order: VocabularyFilterState['order']) => void
  reset: () => void
}

export const useVocabularyFilterStore = create<VocabularyFilterState>((set) => ({
  sortBy: 'savedAt',
  order: 'desc',
  
  setLanguage: (language) => set({ language }),
  setStatus: (status) => set({ status }),
  setSortBy: (sortBy) => set({ sortBy }),
  setOrder: (order) => set({ order }),
  reset: () => set({ language: undefined, status: undefined, sortBy: 'savedAt', order: 'desc' })
}))
```

### 8.3 캐싱 전략

#### React Query 캐싱 설정

```typescript
// app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5분
            gcTime: 1000 * 60 * 30, // 30분 (이전 cacheTime)
            refetchOnWindowFocus: false,
            retry: 1
          },
          mutations: {
            retry: 0
          }
        }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

#### Vercel Edge Config (Feature Flags)

```typescript
// lib/config/edge-config.ts
import { get } from '@vercel/edge-config'

export async function getFeatureFlag(flag: string): Promise<boolean> {
  try {
    return await get(flag) ?? false
  } catch {
    return false
  }
}

// 사용 예시
export async function isNotionSyncEnabled(): Promise<boolean> {
  return getFeatureFlag('notion_sync_enabled')
}
```

---

## 9. 인증 및 보안

### 9.1 Auth.js v5 구현

```typescript
// lib/auth/config.ts
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '../db/prisma'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  session: {
    strategy: 'database' // 데이터베이스 세션 (즉시 revoke 가능)
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/error'
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    }
  }
} satisfies NextAuthConfig
```

```typescript
// lib/auth/index.ts
import NextAuth from 'next-auth'
import { authConfig } from './config'

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
```

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers
```

### 9.2 API 보안

#### API Route 미들웨어

```typescript
// lib/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function withAuth(
  handler: (req: NextRequest, context: { userId: string }) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      )
    }

    return handler(req, { userId: session.user.id })
  }
}
```

#### Rate Limiting

```typescript
// lib/middleware/rate-limit.ts
import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Upstash Redis를 사용한 Rate Limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m') // 1분에 10회
})

export async function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  identifier: (req: NextRequest) => string
) {
  return async (req: NextRequest) => {
    const id = identifier(req)
    const { success, limit, reset, remaining } = await ratelimit.limit(id)

    if (!success) {
      return NextResponse.json(
        {
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests',
          retryAfter: Math.ceil((reset - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString()
          }
        }
      )
    }

    return handler(req)
  }
}
```

#### CORS 설정

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // CORS 헤더 설정
  response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL!)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Security 헤더
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  )

  return response
}

export const config = {
  matcher: ['/api/:path*']
}
```

### 9.3 환경 변수 관리

```bash
# .env.example

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/tweetlingo"
DIRECT_URL="postgresql://user:password@localhost:5432/tweetlingo"

# Auth.js
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Notion OAuth
NOTION_CLIENT_ID=""
NOTION_CLIENT_SECRET=""

# External APIs
GEMINI_API_KEY=""
X_API_BEARER_TOKEN=""

# Rate Limiting (Optional)
UPSTASH_REDIS_URL=""
UPSTASH_REDIS_TOKEN=""

# Encryption
ENCRYPTION_KEY="generate-with-openssl-rand-hex-32"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### 환경 변수 검증

```typescript
// lib/config/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  GEMINI_API_KEY: z.string().min(1),
  X_API_BEARER_TOKEN: z.string().min(1),
  NOTION_CLIENT_ID: z.string().min(1),
  NOTION_CLIENT_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  ENCRYPTION_KEY: z.string().length(64),
  NEXT_PUBLIC_APP_URL: z.string().url()
})

export const env = envSchema.parse(process.env)
```

---

## 10. 성능 최적화

### 10.1 React 19 Server Components 활용

```typescript
// app/(main)/vocabulary/page.tsx
import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { getVocabulary } from '@/lib/db/queries/words'
import { VocabularyList } from '@/components/features/vocabulary/word-list'
import { VocabularyListSkeleton } from '@/components/features/vocabulary/word-list-skeleton'

export default async function VocabularyPage({
  searchParams
}: {
  searchParams: { language?: string; status?: string }
}) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">내 단어장</h1>
      
      <Suspense fallback={<VocabularyListSkeleton />}>
        <VocabularyServerComponent 
          userId={session.user.id}
          filters={searchParams}
        />
      </Suspense>
    </div>
  )
}

async function VocabularyServerComponent({
  userId,
  filters
}: {
  userId: string
  filters: any
}) {
  const vocabulary = await getVocabulary({
    userId,
    language: filters.language,
    status: filters.status
  })

  return <VocabularyList words={vocabulary.words} />
}
```

### 10.2 이미지 최적화

```typescript
// components/ui/optimized-image.tsx
import Image from 'next/image'

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false
}: {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,..." // Low-quality placeholder
      quality={85}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
```

### 10.3 코드 스플리팅

```typescript
// app/(main)/analyze/page.tsx
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// 동적 import로 코드 스플리팅
const TweetAnalyzer = dynamic(
  () => import('@/components/features/tweet-analyzer').then(mod => mod.TweetAnalyzer),
  {
    loading: () => <AnalyzerSkeleton />,
    ssr: false // 클라이언트 전용 컴포넌트
  }
)

export default function AnalyzePage() {
  return (
    <div className="container">
      <Suspense fallback={<AnalyzerSkeleton />}>
        <TweetAnalyzer />
      </Suspense>
    </div>
  )
}
```

### 10.4 캐싱 전략 (Vercel Edge)

```typescript
// app/api/words/route.ts
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge' // Edge Functions 사용

export async function GET(request: NextRequest) {
  const response = await fetch('...')
  
  return new NextResponse(response.body, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
    }
  })
}
```

### 10.5 Database Query 최적화

```typescript
// lib/db/queries/words.ts
export async function getVocabularyWithStats(userId: string) {
  // 병렬 쿼리로 성능 향상
  const [words, stats] = await Promise.all([
    prisma.word.findMany({
      where: { userId },
      select: {
        id: true,
        lemma: true,
        translation: true,
        language: true,
        status: true,
        savedAt: true,
        // 필요한 필드만 선택
      },
      orderBy: { savedAt: 'desc' },
      take: 20
    }),
    prisma.word.groupBy({
      by: ['status'],
      where: { userId },
      _count: true
    })
  ])

  return { words, stats }
}
```

---

## 11. 개발 환경 설정

### 11.1 개발 도구 설정

#### ESLint 설정

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "react/no-unescaped-entities": "off",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

#### Prettier 설정

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

#### TypeScript 설정

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 11.2 Git Hooks (Husky + lint-staged)

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### 11.3 로컬 개발 환경 구성

#### package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset --force"
  }
}
```

#### Docker Compose (로컬 Postgres)

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: tweetlingo
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: tweetlingo_dev
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 11.4 VS Code 설정

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  }
}
```

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "Prisma.prisma",
    "bradlc.vscode-tailwindcss"
  ]
}
```

---

## 12. 배포 전략

### 12.1 Vercel 배포 설정

#### vercel.json

```json
{
  "buildCommand": "prisma generate && next build",
  "devCommand": "next dev --turbo",
  "framework": "nextjs",
  "regions": ["icn1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "DIRECT_URL": "@direct-url",
    "AUTH_SECRET": "@auth-secret",
    "GEMINI_API_KEY": "@gemini-api-key",
    "X_API_BEARER_TOKEN": "@x-api-bearer-token",
    "NOTION_CLIENT_ID": "@notion-client-id",
    "NOTION_CLIENT_SECRET": "@notion-client-secret",
    "GOOGLE_CLIENT_ID": "@google-client-id",
    "GOOGLE_CLIENT_SECRET": "@google-client-secret"
  }
}
```

#### next.config.ts

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // 이미지 최적화
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com'
      }
    ]
  },
  
  // 서버리스 함수 설정
  serverExternalPackages: ['@prisma/client'],
  
  // 환경 변수
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
  },
  
  // 실험적 기능
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  }
}

export default nextConfig
```

### 12.2 환경별 구성

#### Development
- **URL**: `http://localhost:3000`
- **DB**: 로컬 Postgres (Docker)
- **API Keys**: 테스트용 키

#### Preview (PR별 자동 배포)
- **URL**: `https://<branch>-<project>.vercel.app`
- **DB**: Vercel Postgres (Preview 브랜치)
- **API Keys**: Production과 동일

#### Production
- **URL**: `https://tweetlingo.com`
- **DB**: Vercel Postgres (Production)
- **API Keys**: Production 키
- **Region**: ICN1 (Seoul, Korea)

### 12.3 CI/CD 파이프라인

Vercel Git Integration으로 자동화:

```mermaid
graph LR
    A[Git Push] --> B{Branch?}
    B -->|main| C[Production Build]
    B -->|PR| D[Preview Build]
    B -->|other| E[Skip]
    
    C --> F[Run Tests]
    D --> G[Run Tests]
    
    F -->|Pass| H[Deploy to Production]
    F -->|Fail| I[Cancel Deploy]
    
    G -->|Pass| J[Deploy to Preview]
    G -->|Fail| K[Comment on PR]
    
    H --> L[Run Smoke Tests]
    L -->|Pass| M[Complete]
    L -->|Fail| N[Rollback]
```

### 12.4 데이터베이스 마이그레이션

#### Production 마이그레이션 프로세스

```bash
# 1. 로컬에서 마이그레이션 생성
npx prisma migrate dev --name add_user_settings

# 2. 마이그레이션 검토
cat prisma/migrations/<timestamp>_add_user_settings/migration.sql

# 3. Production에 배포 (Vercel Build 시 자동 실행)
# vercel.json의 buildCommand에 포함:
# "prisma migrate deploy && next build"
```

```json
// package.json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

### 12.5 모니터링 및 로깅

#### Vercel Analytics

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

#### 에러 로깅 (Sentry - 선택사항)

```typescript
// lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // 민감 정보 필터링
    if (event.request?.headers?.authorization) {
      delete event.request.headers.authorization
    }
    return event
  }
})
```

### 12.6 롤백 전략

Vercel의 Instant Rollback 기능 활용:

1. **Vercel Dashboard**: Deployments → 이전 배포 선택 → "Promote to Production"
2. **CLI**: `vercel rollback <deployment-url>`
3. **자동 롤백**: 헬스체크 실패 시 자동 롤백 설정

---

## 13. 추가 고려사항

### 13.1 국제화 (i18n)

Phase 2 이후 다국어 지원:

```typescript
// next.config.ts
const nextConfig = {
  i18n: {
    locales: ['ko', 'en', 'ja'],
    defaultLocale: 'ko'
  }
}
```

### 13.2 PWA 지원

Phase 3에서 오프라인 단어장 지원:

```typescript
// next.config.ts
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
})

module.exports = withPWA({
  // ...기존 설정
})
```

### 13.3 테스트 전략

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test"
  },
  "devDependencies": {
    "jest": "^29.x",
    "@testing-library/react": "^15.x",
    "@playwright/test": "^1.x"
  }
}
```

---

## 문서 정보

- **작성일**: 2026년 1월 22일
- **버전**: 1.0
- **작성자**: 사용자와 AI의 협업
- **문서 유형**: 코드 아키텍처
- **기술 스택 기준**: 2026년 1월 최신 안정 버전
- **배포 플랫폼**: Vercel
- **참조 문서**:
  - [서비스_기획안.md](./서비스_기획안.md)
  - [참고자료.md](./참고자료.md)
  - [design_guide.md](./design_guide.md)

---

**Build with clarity, ship with confidence. 🚀**
