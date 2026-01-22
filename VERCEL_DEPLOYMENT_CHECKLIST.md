# Vercel 배포 체크리스트

이 문서는 TweetLingo를 Vercel에 배포하기 전 확인해야 할 사항들을 정리한 것입니다.

---

## 📋 배포 전 확인사항

### 1. API 키 발급 완료

- [ ] Google Gemini API Key
- [ ] Google OAuth Client ID & Secret  
- [ ] X/Twitter Bearer Token
- [ ] Notion Client ID & Secret (선택사항)

> 가이드: [`API_KEYS_GUIDE.md`](API_KEYS_GUIDE.md)

### 2. 로컬 테스트 완료

- [ ] `npm run dev`로 서버가 정상 실행됨
- [ ] http://localhost:3000 접속 가능
- [ ] Google 로그인 작동 확인
- [ ] 트윗 분석 기능 테스트 완료
- [ ] 단어 저장 기능 테스트 완료
- [ ] Chrome Extension 빌드 성공

### 3. Git 저장소 준비

- [ ] GitHub 계정 있음
- [ ] 새 저장소 생성 (Private 권장)
- [ ] 로컬 코드를 GitHub에 푸시 완료

### 4. Vercel 계정 준비

- [ ] Vercel 계정 생성 (https://vercel.com)
- [ ] GitHub 연동 완료

---

## 🚀 배포 단계

### Step 1: GitHub에 코드 푸시

```powershell
# GitHub에서 새 저장소 생성
# https://github.com/new
# 저장소 이름: tweetlingo
# Private 선택 (개인정보 보호)

# 로컬에서 원격 저장소 추가 및 푸시
git remote add origin https://github.com/당신의유저명/tweetlingo.git
git branch -M main
git push -u origin main
```

### Step 2: Vercel 프로젝트 생성

1. Vercel 대시보드 접속: https://vercel.com/dashboard
2. "Add New..." → "Project" 클릭
3. GitHub 저장소에서 `tweetlingo` 찾기
4. "Import" 클릭
5. **아직 Deploy하지 마세요!** 먼저 데이터베이스 설정

### Step 3: Vercel Postgres 생성

1. 프로젝트 설정 페이지에서 "Storage" 탭 클릭
2. "Create Database" 클릭
3. "Postgres" 선택
4. 설정:
   ```
   Database Name: tweetlingo-db
   Region: Singapore (iad1) - 한국과 가까움
   ```
5. "Create" 클릭
6. 자동으로 환경 변수가 추가됨:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`

### Step 4: 환경 변수 설정

1. "Settings" 탭 → "Environment Variables" 메뉴
2. 다음 변수들을 **하나씩** 추가:

#### 데이터베이스 (자동 생성됨)
```
DATABASE_URL = ${POSTGRES_PRISMA_URL}
DIRECT_URL = ${POSTGRES_URL_NON_POOLING}
```

#### 인증
```
AUTH_SECRET = [.env.local에서 복사]
AUTH_URL = https://your-app-name.vercel.app (배포 후 확인)
```

#### Google OAuth
```
GOOGLE_CLIENT_ID = [Google Cloud에서 복사]
GOOGLE_CLIENT_SECRET = [Google Cloud에서 복사]
```

#### AI 및 API
```
GEMINI_API_KEY = [Google AI에서 복사]
X_API_BEARER_TOKEN = [X Developer Portal에서 복사]
```

#### Notion (선택사항)
```
NOTION_CLIENT_ID = [Notion에서 복사]
NOTION_CLIENT_SECRET = [Notion에서 복사]
```

#### 암호화
```
ENCRYPTION_KEY = [.env.local에서 복사]
```

#### 앱 URL
```
NEXT_PUBLIC_APP_URL = https://your-app-name.vercel.app (배포 후 확인)
```

### Step 5: 첫 배포

1. "Deployments" 탭으로 이동
2. "Deploy" 버튼 클릭
3. 빌드 로그 확인 (1-2분 소요)
4. **배포 URL 확인** 및 복사
   - 예: `https://tweetlingo-abc123.vercel.app`

### Step 6: 배포 URL 업데이트

1. Vercel에서 방금 확인한 URL을 메모
2. "Settings" → "Environment Variables"로 이동
3. 다음 변수들 업데이트:
   ```
   AUTH_URL = https://your-app-name.vercel.app
   NEXT_PUBLIC_APP_URL = https://your-app-name.vercel.app
   ```

### Step 7: Google OAuth Redirect URI 추가

1. Google Cloud Console 접속
   - https://console.cloud.google.com/apis/credentials
2. OAuth 클라이언트 ID 클릭 (TweetLingo Web App)
3. "승인된 리디렉션 URI" 섹션에 **추가**:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```
4. "저장" 클릭

### Step 8: Notion Redirect URI 추가 (선택사항)

1. Notion Integration 페이지 접속
   - https://www.notion.so/my-integrations
2. TweetLingo Integration 클릭
3. "Distribution" 탭
4. "Redirect URIs"에 **추가**:
   ```
   https://your-app-name.vercel.app/api/notion/callback
   ```
5. "Save changes" 클릭

### Step 9: 재배포

환경 변수와 Redirect URI를 업데이트했으므로 재배포 필요:

**방법 A: Vercel 대시보드에서**
1. "Deployments" 탭
2. 최신 배포에서 "..." 메뉴
3. "Redeploy" 클릭

**방법 B: Git Push로**
```powershell
git commit --allow-empty -m "Update env vars and OAuth URIs"
git push
```

### Step 10: 배포 확인

1. 재배포 완료 대기 (1-2분)
2. 배포 URL 접속
3. 기능 테스트:
   - [ ] 홈페이지 로드 확인
   - [ ] Google 로그인 작동
   - [ ] 트윗 분석 기능
   - [ ] 단어 저장 기능
   - [ ] Notion 연동 (선택사항)

---

## ✅ 배포 완료 체크리스트

- [ ] Vercel 프로젝트 생성 완료
- [ ] Vercel Postgres 데이터베이스 생성
- [ ] 모든 환경 변수 설정 완료
- [ ] Google OAuth Redirect URI 추가
- [ ] Notion Redirect URI 추가 (선택)
- [ ] 첫 배포 성공
- [ ] URL 업데이트 및 재배포
- [ ] 웹앱 로그인 테스트 성공
- [ ] 트윗 분석 테스트 성공
- [ ] Chrome Extension API URL 업데이트

---

## 🔧 Chrome Extension API URL 업데이트

Extension이 프로덕션 API와 통신하려면:

1. `chrome-extension/src/shared/api-client.ts` 열기
2. API URL 변경:
   ```typescript
   const API_BASE_URL = 'https://your-app-name.vercel.app'
   ```
3. Extension 재빌드:
   ```powershell
   cd chrome-extension
   npm run build
   ```
4. Chrome에서 Extension 새로고침

---

## 📊 배포 후 모니터링

### Vercel Analytics (무료)

1. 프로젝트 대시보드 → "Analytics" 탭
2. 방문자 수, 페이지뷰, 성능 지표 확인

### 로그 확인

1. "Deployments" 탭
2. 특정 배포 클릭
3. "Functions" 탭에서 서버리스 함수 로그 확인

### 데이터베이스 확인

1. "Storage" 탭
2. Postgres 데이터베이스 클릭
3. "Data" 탭에서 데이터 확인
4. "Insights" 탭에서 쿼리 성능 확인

---

## 🐛 배포 트러블슈팅

### 문제 1: "Build Failed"

**확인사항:**
- [ ] 모든 환경 변수가 설정되었는지
- [ ] `POSTGRES_PRISMA_URL`이 `DATABASE_URL`로 매핑되었는지
- [ ] 로컬에서 `npm run build` 성공하는지

**해결책:**
1. Vercel 빌드 로그 상세 확인
2. 에러 메시지 검색 또는 질문
3. 환경 변수 다시 확인

### 문제 2: "Database Connection Failed"

**확인사항:**
- [ ] Vercel Postgres가 생성되었는지
- [ ] `DATABASE_URL`과 `DIRECT_URL`이 설정되었는지
- [ ] `${POSTGRES_PRISMA_URL}` 형식으로 참조했는지

**해결책:**
1. Storage 탭에서 데이터베이스 상태 확인
2. 환경 변수 재설정
3. 재배포

### 문제 3: "Google OAuth Error"

**확인사항:**
- [ ] Redirect URI가 정확한지 (`https://` 필수)
- [ ] `AUTH_URL`이 올바른 도메인인지
- [ ] Google Cloud Console에서 URI 저장했는지

**해결책:**
1. Redirect URI 정확히 확인 (끝에 / 없어야 함)
2. https vs http 확인 (프로덕션은 반드시 https)
3. Google Cloud Console에서 변경사항 저장

### 문제 4: "500 Internal Server Error"

**확인사항:**
- [ ] Function 로그 확인
- [ ] 환경 변수 누락 확인
- [ ] API 키 유효성 확인

**해결책:**
1. Vercel 대시보드 → Deployments → 로그 확인
2. 에러 스택 트레이스 분석
3. 로컬에서 같은 조건 재현

---

## 💰 비용 예상

### Vercel 무료 티어

- ✅ 100GB 대역폭/월
- ✅ 1000 빌드 분/월
- ✅ Postgres 60시간 컴퓨팅/월
- ✅ 512MB 스토리지

**소규모 프로젝트에 충분합니다!**

### API 비용

- Gemini API: 무료 티어 (15 RPM)
- X API: 무료 티어 (100 트윗/월)
- Notion API: 완전 무료

**총 예상 비용: $0/월**

---

## 🎉 배포 완료!

축하합니다! TweetLingo가 성공적으로 배포되었습니다.

### 다음 단계

1. 실제 사용해보기
2. 친구들과 공유
3. 피드백 수집
4. Phase 3 기능 추가 고려

### 도메인 연결 (선택사항)

커스텀 도메인을 사용하려면:

1. 도메인 구입 (Namecheap, GoDaddy 등)
2. Vercel 프로젝트 → "Settings" → "Domains"
3. 도메인 추가 및 DNS 설정
4. Google OAuth와 Notion에서 도메인 업데이트

---

## 📞 도움 요청

문제가 발생하면:

1. 에러 메시지 전체 복사
2. Vercel 빌드 로그 확인
3. 어떤 단계에서 막혔는지 설명
4. 스크린샷 첨부

함께 해결해봅시다!
