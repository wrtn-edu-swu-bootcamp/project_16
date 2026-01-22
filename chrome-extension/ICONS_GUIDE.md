# Chrome Extension 아이콘 설정 가이드

TweetLingo Chrome Extension에는 세 가지 크기의 아이콘이 필요합니다.

## 필요한 아이콘

Extension이 작동하려면 다음 아이콘들이 필요합니다:

```
chrome-extension/
└── public/
    └── icons/
        ├── icon-16.png   (16x16 pixels)
        ├── icon-48.png   (48x48 pixels)
        └── icon-128.png  (128x128 pixels)
```

## 옵션 1: 임시 아이콘 사용 (테스트용)

개발 및 테스트 단계에서는 임시 아이콘을 사용할 수 있습니다.

### 방법 A: 온라인 아이콘 생성기 사용

1. https://favicon.io/favicon-generator/ 접속
2. 텍스트 입력: "TL" (TweetLingo 약자)
3. 배경색: #0EA5E9 (Sky Blue)
4. 텍스트 색: #FFFFFF (White)
5. 폰트: Arial Bold
6. "Download" 클릭
7. 다운로드한 파일 중 필요한 크기로 리사이즈

### 방법 B: Figma/Canva 사용

1. Figma 또는 Canva에서 새 프로젝트 시작
2. 캔버스 크기: 128x128 pixels
3. 디자인:
   - 배경: Sky Blue (#0EA5E9)
   - 텍스트: "TL" 또는 책 아이콘
4. Export:
   - 128x128 (원본)
   - 48x48 (축소)
   - 16x16 (축소)

### 방법 C: 무료 아이콘 사이트

1. https://www.flaticon.com/ 접속
2. "book" 또는 "language learning" 검색
3. 원하는 아이콘 다운로드 (PNG)
4. 온라인 리사이즈 도구 사용:
   - https://www.iloveimg.com/resize-image
   - 16x16, 48x48, 128x128 크기로 각각 생성

## 옵션 2: 프로페셔널 아이콘 의뢰

실제 서비스 출시 전에는 전문 디자이너에게 의뢰하는 것을 권장합니다.

### 디자인 요구사항

```
- 스타일: 모던, 미니멀
- 컬러: Sky Blue (#0EA5E9) + White (#FFFFFF)
- 컨셉: 책/학습 + 언어/글로벌
- 크기: 16x16, 48x48, 128x128 (PNG, 투명 배경)
```

## 폴더 구조 생성

PowerShell에서 실행:

```powershell
# chrome-extension 폴더로 이동
cd chrome-extension

# public/icons 폴더 생성
New-Item -ItemType Directory -Path "public\icons" -Force
```

## 아이콘 파일 배치

1. 생성한 아이콘들을 다음 위치에 복사:
   ```
   chrome-extension/public/icons/icon-16.png
   chrome-extension/public/icons/icon-48.png
   chrome-extension/public/icons/icon-128.png
   ```

2. 파일명이 정확한지 확인 (대소문자 구분)

## 테스트

아이콘이 제대로 설정되었는지 확인:

```powershell
# Extension 빌드
npm run build

# dist 폴더 확인
ls dist/icons
```

출력 예시:
```
icon-16.png
icon-48.png
icon-128.png
```

## 문제 해결

### "아이콘을 찾을 수 없습니다" 에러

1. 파일 경로 확인: `chrome-extension/public/icons/`
2. 파일명 확인: `icon-16.png` (정확히 일치해야 함)
3. 빌드 재실행: `npm run build`

### 아이콘이 흐릿하게 보임

- 각 크기별로 별도 파일 사용 (단순 리사이즈 X)
- 벡터 아이콘을 각 크기에 맞게 최적화

## 임시 해결책 (아이콘 없이 테스트)

아이콘이 아직 없다면 manifest.json에서 아이콘 섹션을 임시로 제거할 수 있습니다:

```json
// manifest.json에서 다음 섹션들을 주석 처리 또는 삭제
{
  // "action": {
  //   "default_icon": { ... }
  // },
  // "icons": { ... }
}
```

하지만 Chrome Web Store에 게시하려면 반드시 아이콘이 필요합니다.

---

## 참고 사항

- Chrome Extension은 PNG 형식만 지원
- 투명 배경 권장
- 각 크기별로 선명도 최적화 필요
- 128x128은 Chrome Web Store 스토어 페이지에도 사용됨
