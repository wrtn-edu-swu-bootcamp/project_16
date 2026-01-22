# TweetLingo 배포 가이드

> 이 가이드는 비개발자를 위한 단계별 배포 가이드입니다.
> Docker 없이 클라우드 DB만으로 운영합니다.

## 시작하기 전에

### 필요한 것들

- [ ] Google 계정
- [ ] GitHub 계정
- [ ] X/Twitter 계정
- [ ] 컴퓨터에 설치되어 있어야 할 것:
  - [ ] Node.js 18 이상
  - [ ] Git
  - [ ] VS Code (권장)

> **Note**: Docker는 필요하지 않습니다. 클라우드 PostgreSQL을 사용합니다.

---

## 📋 전체 진행 상황 체크리스트

진행하면서 완료한 항목에 체크하세요:

### Phase 1: 준비 단계
- [ ] API 키 발급 완료 (Gemini, Google OAuth, X API)
- [ ] Notion Integration 설정 완료 (선택사항)
- [ ] 클라우드 DB 설정 (Neon, Vercel Postgres, 또는 Supabase)
- [ ] .env.local 파일 생성 및 설정

### Phase 2: 로컬 테스트
- [ ] npm install 완료
- [ ] 데이터베이스 초기화 (npm run db:push)
- [ ] npm run dev로 서버 실행 성공
- [ ] 브라우저에서 http://localhost:3000 접속 확인

### Phase 3: Vercel 배포
- [ ] Vercel 계정 생성
- [ ] GitHub에 코드 푸시
- [ ] Vercel에서 프로젝트 import
- [ ] Vercel Postgres 데이터베이스 생성
- [ ] 환경 변수 설정
- [ ] 첫 배포 성공

### Phase 4: OAuth 설정
- [ ] Google OAuth Redirect URI 추가
- [ ] Notion Redirect URI 추가 (선택)
- [ ] Vercel 재배포

### Phase 5: Extension
- [ ] Chrome Extension 빌드
- [ ] Chrome에 Extension 로드
- [ ] Extension 테스트

### Phase 6: 최종 확인
- [ ] 웹앱 로그인 테스트
- [ ] 트윗 분석 테스트
- [ ] 단어 저장 테스트
- [ ] Extension 테스트

---

## ⚡ 빠른 시작 (로컬 개발)

### 1. 환경 변수 설정

```powershell
# .env.example을 복사하여 .env.local 생성
Copy-Item .env.example .env.local
```

`.env.local` 파일을 열어서 필요한 값들을 채우세요.

### 2. 보안 키 생성

PowerShell에서 실행:

```powershell
# AUTH_SECRET 생성
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# ENCRYPTION_KEY 생성
-join ((0..31 | ForEach-Object { '{0:x2}' -f (Get-Random -Maximum 256) }))
```

### 3. 클라우드 데이터베이스 설정

**Docker 없이** 클라우드 PostgreSQL을 사용합니다:

#### 옵션 A: Neon (추천 - 가장 간단)

1. https://neon.tech 접속
2. GitHub 또는 이메일로 가입
3. "Create a project" 클릭
4. Project name: `tweetlingo`
5. Region: `Asia Pacific (Singapore)` 선택
6. "Create project" 클릭
7. Connection string 복사 → `.env.local`에 붙여넣기:

```bash
DATABASE_URL="postgresql://user:pass@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

#### 옵션 B: Supabase

1. https://supabase.com 접속
2. GitHub으로 가입
3. "New Project" 클릭
4. Project name: `tweetlingo`
5. Database Password 설정 (저장해두기!)
6. Region: `Northeast Asia (Seoul)` 선택
7. Settings → Database → Connection string → URI 복사

### 4. 의존성 설치 및 DB 초기화

```powershell
# 의존성 설치
npm install

# Prisma 클라이언트 생성 및 DB 스키마 적용
npm run db:push
```

### 5. 개발 서버 실행

```powershell
npm run dev
```

브라우저에서 http://localhost:3000 접속

---

## 🔑 API 키 발급 가이드

### 1. Google Cloud (Gemini API + OAuth)

**Gemini API:**
1. https://ai.google.dev/ 접속
2. "Get API key" 클릭
3. 새 프로젝트 생성
4. API 키 복사

**Google OAuth:**
1. https://console.cloud.google.com/apis/credentials 접속
2. "사용자 인증 정보 만들기" → "OAuth 클라이언트 ID"
3. 동의 화면 구성 (외부, 앱 이름: TweetLingo)
4. 웹 애플리케이션 유형 선택
5. 승인된 리디렉션 URI:
   - 로컬: `http://localhost:3000/api/auth/callback/google`
   - 프로덕션: `https://your-app.vercel.app/api/auth/callback/google` (배포 후 추가)

### 2. X/Twitter API

1. https://developer.x.com 접속
2. 개발자 계정 신청 (무료)
3. 새 앱 생성
4. "Keys and tokens" → Bearer Token 생성
5. ⚠️ 무료: 월 100 트윗 제한

### 3. Notion Integration (선택)

1. https://www.notion.so/my-integrations 접속
2. "New integration" 생성
3. Public integration 선택
4. OAuth 설정:
   - 로컬: `http://localhost:3000/api/notion/callback`
   - 프로덕션: `https://your-app.vercel.app/api/notion/callback` (배포 후 추가)

---

## 🌐 Vercel 배포 가이드

### 1. GitHub에 코드 올리기

```powershell
# GitHub에서 새 저장소 생성 (https://github.com/new)
# 저장소 이름: tweetlingo
# Private 선택

# 로컬에서 푸시
git remote add origin https://github.com/당신의유저명/tweetlingo.git
git branch -M main
git push -u origin main
```

### 2. Vercel 설정

1. https://vercel.com 가입 (GitHub 연동)
2. "New Project" → GitHub 저장소 선택
3. Framework: Next.js (자동 감지)
4. "Deploy" 클릭하지 말고 먼저 Storage 설정

### 3. Vercel Postgres 생성

1. "Storage" 탭 클릭
2. "Create Database" → "Postgres"
3. Database name: `tweetlingo-db`
4. Region: Singapore (한국과 가까움)
5. "Create"

### 4. 환경 변수 설정

"Settings" → "Environment Variables"에서 다음 변수들 추가:

- `DATABASE_URL`: `${POSTGRES_PRISMA_URL}` (자동 생성됨)
- `DIRECT_URL`: `${POSTGRES_URL_NON_POOLING}` (자동 생성됨)
- `AUTH_SECRET`: .env.local에서 복사
- `AUTH_URL`: `https://your-app.vercel.app` (배포 후 실제 URL로 변경)
- `GOOGLE_CLIENT_ID`: Google Cloud에서 복사
- `GOOGLE_CLIENT_SECRET`: Google Cloud에서 복사
- `GEMINI_API_KEY`: Google AI에서 복사
- `X_API_BEARER_TOKEN`: X Developer Portal에서 복사
- `NOTION_CLIENT_ID`: Notion에서 복사 (선택)
- `NOTION_CLIENT_SECRET`: Notion에서 복사 (선택)
- `ENCRYPTION_KEY`: .env.local에서 복사
- `NEXT_PUBLIC_APP_URL`: `https://your-app.vercel.app` (배포 후 실제 URL로 변경)

### 5. 배포

1. "Deployments" 탭
2. "Deploy" 클릭
3. 빌드 완료 기다리기 (1-2분)
4. 배포 URL 확인
5. Google/Notion에서 Redirect URI 업데이트
6. Vercel에서 `AUTH_URL`과 `NEXT_PUBLIC_APP_URL` 업데이트
7. 재배포 (Redeploy 버튼)

---

## 🔧 Chrome Extension 빌드

```powershell
# Extension 폴더로 이동
cd chrome-extension

# 의존성 설치
npm install

# 빌드
npm run build

# Chrome에 로드
# 1. chrome://extensions/ 접속
# 2. 개발자 모드 켜기
# 3. "압축 해제된 확장 프로그램 로드"
# 4. chrome-extension/dist 폴더 선택
```

---

## 🐛 문제 해결

### "MODULE_NOT_FOUND" 에러

```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### DB 연결 실패

```powershell
# .env.local의 DATABASE_URL 확인
# 클라우드 DB 대시보드에서 연결 상태 확인
npm run db:push
```

### OAuth "redirect_uri_mismatch"

- Google Cloud Console에서 Redirect URI 정확히 확인
- http vs https 구분 (로컬은 http, 프로덕션은 https)
- 끝에 슬래시(/) 없어야 함

### Vercel 빌드 실패

1. 빌드 로그 확인
2. 환경 변수 누락 확인
3. 로컬에서 `npm run build` 테스트

---

## 📊 예상 비용

| 서비스 | 무료 티어 | 비고 |
|--------|----------|------|
| Vercel Hosting | 100GB/월 | 소규모 충분 |
| Vercel Postgres | 60시간/월 | 개인 프로젝트 충분 |
| Neon Postgres | 3GB storage | 개인 프로젝트 충분 |
| Gemini API | 15 RPM | 무료 티어 |
| X API | 100 트윗/월 | 테스트용 충분 |
| Notion API | 무제한 | 완전 무료 |

**총계: $0/월** (무료 티어 범위 내 사용)

---

## 📞 도움 요청

막히는 부분이 있다면:

1. 에러 메시지 전체 복사
2. 어느 단계에서 막혔는지 설명
3. 스크린샷 첨부

이 정보와 함께 질문하면 정확한 해결책을 받을 수 있습니다!

---

## ✅ 배포 완료 후

- [ ] 웹앱에서 로그인 테스트
- [ ] 트윗 분석 테스트
- [ ] 단어 저장 및 단어장 확인
- [ ] Notion 연동 테스트 (선택)
- [ ] Chrome Extension 테스트
- [ ] 자동 저장 기능 테스트

축하합니다! TweetLingo가 성공적으로 배포되었습니다! 🎉
