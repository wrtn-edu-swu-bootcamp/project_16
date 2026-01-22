# API 키 발급 가이드

TweetLingo를 실행하려면 다음 API 키들이 필요합니다. 각 서비스별로 단계별 가이드를 따라하세요.

---

## 📋 필요한 API 키 체크리스트

- [ ] Google Gemini API Key (필수)
- [ ] Google OAuth Client ID & Secret (필수)
- [ ] X/Twitter Bearer Token (선택사항 - 없어도 됨!)
- [ ] Notion Client ID & Secret (선택사항)

**예상 소요 시간**: 20-30분

> **Good News!** X API는 더 이상 필수가 아닙니다! Chrome Extension이 페이지에서 직접 트윗 텍스트를 추출하고, 웹앱에서는 텍스트를 직접 붙여넣을 수 있습니다.

---

## 1️⃣ Google Gemini API (필수)

AI 기반 단어 추출에 사용됩니다.

### 방법 A: Google AI Studio (추천 - 더 간단함)

1. **https://ai.google.dev/** 접속
2. "Get API key" 버튼 클릭
3. Google 계정으로 로그인
4. "Create API key" 클릭
5. 기존 프로젝트 선택 또는 새 프로젝트 생성
   - 프로젝트 이름: `TweetLingo`
6. **API 키 복사** → 안전한 곳에 저장

```
예시: AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q
```

⚠️ **무료 티어**: 분당 15회 요청 (개인 프로젝트에 충분)

### 방법 B: Google Cloud Console

1. **https://console.cloud.google.com/** 접속
2. 새 프로젝트 생성:
   - 프로젝트 이름: `TweetLingo`
3. 좌측 메뉴 → "API 및 서비스" → "라이브러리"
4. "Generative Language API" 검색
5. "사용" 버튼 클릭
6. 좌측 메뉴 → "사용자 인증 정보"
7. "+ 사용자 인증 정보 만들기" → "API 키" 선택
8. **API 키 복사** → 안전한 곳에 저장

---

## 2️⃣ Google OAuth (필수)

Google 로그인 기능에 사용됩니다.

### 단계별 가이드

#### A. Google Cloud Console 프로젝트 설정

1. **https://console.cloud.google.com/** 접속
2. 위에서 만든 `TweetLingo` 프로젝트 선택
3. 좌측 메뉴 → "API 및 서비스" → "사용자 인증 정보"

#### B. OAuth 동의 화면 구성

1. 좌측 메뉴에서 "OAuth 동의 화면" 클릭
2. **User Type**: "외부" 선택 → "만들기" 클릭
3. **앱 정보** 입력:
   ```
   앱 이름: TweetLingo
   사용자 지원 이메일: [본인 이메일 선택]
   앱 로고: [선택사항 - 나중에 추가 가능]
   ```
4. **앱 도메인** (나중에 추가 가능):
   ```
   애플리케이션 홈페이지: https://your-app.vercel.app
   (배포 후 입력)
   ```
5. **개발자 연락처 정보**: [본인 이메일 입력]
6. "저장 후 계속" 클릭
7. **범위** 페이지: 그냥 "저장 후 계속"
8. **테스트 사용자** 페이지: "저장 후 계속"
9. "대시보드로 돌아가기" 클릭

#### C. OAuth 클라이언트 ID 생성

1. "사용자 인증 정보" 탭으로 돌아가기
2. "+ 사용자 인증 정보 만들기" → "OAuth 클라이언트 ID" 선택
3. **애플리케이션 유형**: "웹 애플리케이션" 선택
4. **이름**: `TweetLingo Web App`
5. **승인된 JavaScript 원본** (선택사항):
   ```
   http://localhost:3000
   ```
6. **승인된 리디렉션 URI** (중요!):
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   
   💡 **배포 후 추가해야 할 URI**:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

7. "만들기" 클릭
8. **클라이언트 ID와 클라이언트 보안 비밀번호 복사** → 안전한 곳에 저장

```
클라이언트 ID: 123456789012-abc...xyz.apps.googleusercontent.com
클라이언트 보안 비밀번호: GOCSPX-abc...xyz
```

---

## 3️⃣ X/Twitter API (선택사항 - 건너뛰어도 됨!)

> ⚡ **중요**: X API는 더 이상 필수가 아닙니다!
> 
> TweetLingo는 X API 없이도 완전히 작동합니다:
> - **Chrome Extension**: X 페이지에서 트윗 텍스트를 직접 추출
> - **웹앱**: 트윗 텍스트를 직접 복사/붙여넣기
>
> X API 무료 티어는 제한이 많고, 유료 플랜은 $100/월이므로 **설정하지 않는 것을 권장합니다**.

### X API가 필요한 경우 (선택사항)

URL만 입력해서 트윗을 분석하고 싶다면 X API가 필요합니다.
하지만 무료 티어에서는 트윗 읽기가 제한될 수 있습니다.

<details>
<summary>X API 설정 방법 (접기/펼치기)</summary>

#### A. X Developer 계정 신청

1. **https://developer.x.com/** 접속
2. X/Twitter 계정으로 로그인
3. "Sign up for Free Account" 클릭
4. 전화번호 인증 완료
5. 약관 동의 및 제출

#### B. Bearer Token 발급

1. 앱 생성 후 "Keys and tokens" 탭
2. Bearer Token 생성 및 복사

⚠️ **무료 티어 제한**: 매우 제한적, 트윗 읽기가 불가능할 수 있음

</details>

### 권장 사용 방법

`.env.local`에서 X API 토큰을 **비워두세요**:
```bash
X_API_BEARER_TOKEN=""
```

그리고 다음 방법 중 하나를 사용하세요:
1. **Chrome Extension 사용** (추천): X 페이지에서 "Learn" 버튼 클릭
2. **웹앱에서 텍스트 입력**: 트윗 내용을 복사해서 붙여넣기

---

## 4️⃣ Notion Integration (선택사항)

Notion 단어장 동기화 기능에 사용됩니다. **나중에 추가해도 됩니다**.

### 단계별 가이드

#### A. Notion Integration 생성

1. **https://www.notion.so/my-integrations** 접속
2. Notion 계정으로 로그인
3. "+ New integration" 클릭
4. **Basic Information**:
   ```
   Name: TweetLingo
   Logo: [선택사항]
   Associated workspace: [본인 워크스페이스 선택]
   ```
5. "Submit" 클릭

#### B. Integration Type 설정

1. **Capabilities** 탭:
   - "Read content" ✓
   - "Update content" ✓
   - "Insert content" ✓
2. **Integration type**: "Public" 선택
3. "Save changes" 클릭

#### C. OAuth 설정

1. **Distribution** 탭 클릭
2. **OAuth Domain & URIs**:
   - **Redirect URIs** (로컬):
     ```
     http://localhost:3000/api/notion/callback
     ```
   - **Redirect URIs** (프로덕션 - 배포 후 추가):
     ```
     https://your-app.vercel.app/api/notion/callback
     ```
3. "Save changes" 클릭

#### D. Secrets 확인

1. **Secrets** 탭 클릭
2. **OAuth client ID** 복사 → 안전한 곳에 저장
3. **OAuth client secret** 복사 → 안전한 곳에 저장

```
Client ID: 12345678-1234-1234-1234-123456789012
Client Secret: secret_abc...xyz
```

---

## ✅ 발급 완료 체크리스트

필수 키만 발급받으면 됩니다:

```
[필수] GEMINI_API_KEY: AIzaSyA...
[필수] GOOGLE_CLIENT_ID: 123456789012-abc...xyz.apps.googleusercontent.com
[필수] GOOGLE_CLIENT_SECRET: GOCSPX-abc...xyz
[선택] X_API_BEARER_TOKEN: (비워두세요 - 없어도 됩니다!)
[선택] NOTION_CLIENT_ID: 12345678-...
[선택] NOTION_CLIENT_SECRET: secret_abc...
```

> 💡 **최소 설정**: Gemini API + Google OAuth만 있으면 서비스가 작동합니다!

---

## 📝 다음 단계

API 키 발급을 완료했다면:

1. `.env.local` 파일 생성:
   ```powershell
   Copy-Item .env.example .env.local
   ```

2. `.env.local` 파일을 열어서 위에서 발급받은 키들을 입력

3. `setup-local.ps1` 스크립트 실행:
   ```powershell
   .\setup-local.ps1
   ```

---

## 🔒 보안 주의사항

- ⚠️ **API 키는 절대 공개하지 마세요**
- ⚠️ **GitHub에 올리지 마세요** (.env.local은 .gitignore에 포함됨)
- ⚠️ **스크린샷 공유 시 키를 가리세요**
- 💡 키가 노출되었다면 즉시 재발급하세요

---

## 🆘 문제 해결

### Google OAuth "redirect_uri_mismatch" 에러
- Redirect URI 정확히 확인: `http://localhost:3000/api/auth/callback/google`
- http vs https 구분 (로컬은 http)
- 끝에 슬래시(/) 없어야 함

### X API "Unauthorized" 에러
- Bearer Token이 정확한지 확인
- X Developer Portal에서 앱 상태 확인
- 무료 티어 한도 확인 (월 100회)

### Gemini API "API key not valid" 에러
- API 키 정확히 복사했는지 확인
- "Generative Language API"가 활성화되어 있는지 확인
- 프로젝트가 올바른지 확인

### Notion "invalid_client" 에러
- Client ID와 Secret이 정확한지 확인
- Redirect URI가 정확히 설정되었는지 확인
- Integration이 "Public"으로 설정되었는지 확인

---

## 📞 도움 요청

문제가 해결되지 않으면:
1. 에러 메시지 전체 복사
2. 어떤 API에서 문제가 발생했는지 명시
3. 스크린샷 첨부 (키는 가리고)
