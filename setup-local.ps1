# TweetLingo 로컬 개발 환경 설정 스크립트
# Windows PowerShell에서 실행

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "TweetLingo 로컬 환경 설정 시작" -ForegroundColor Cyan
Write-Host "(Cloud DB 기반 - Docker 불필요)" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 1. .env.local 파일 존재 확인
Write-Host "[1/5] 환경 변수 파일 확인 중..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "✓ .env.local 파일이 이미 존재합니다." -ForegroundColor Green
    $continue = Read-Host "기존 파일을 유지하시겠습니까? (Y/N)"
    if ($continue -eq "N" -or $continue -eq "n") {
        Copy-Item .env.example .env.local -Force
        Write-Host "✓ .env.local 파일이 생성되었습니다." -ForegroundColor Green
        Write-Host "⚠ .env.local 파일을 열어서 API 키들을 입력해주세요!" -ForegroundColor Yellow
    }
} else {
    Copy-Item .env.example .env.local
    Write-Host "✓ .env.local 파일이 생성되었습니다." -ForegroundColor Green
    Write-Host "⚠ .env.local 파일을 열어서 API 키들을 입력해주세요!" -ForegroundColor Yellow
}
Write-Host ""

# 2. 보안 키 생성
Write-Host "[2/5] 보안 키 생성 중..." -ForegroundColor Yellow
$authSecret = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
$encryptionKey = -join ((0..31 | ForEach-Object { '{0:x2}' -f (Get-Random -Maximum 256) }))

Write-Host "생성된 키들을 .env.local에 복사하세요:" -ForegroundColor Cyan
Write-Host ""
Write-Host "AUTH_SECRET=" -NoNewline -ForegroundColor Gray
Write-Host $authSecret -ForegroundColor Green
Write-Host "ENCRYPTION_KEY=" -NoNewline -ForegroundColor Gray
Write-Host $encryptionKey -ForegroundColor Green
Write-Host ""

# 클립보드에 복사 (선택사항)
$copyToClipboard = Read-Host "AUTH_SECRET을 클립보드에 복사하시겠습니까? (Y/N)"
if ($copyToClipboard -eq "Y" -or $copyToClipboard -eq "y") {
    Set-Clipboard -Value $authSecret
    Write-Host "✓ 클립보드에 복사되었습니다!" -ForegroundColor Green
}
Write-Host ""

# 3. 클라우드 DB 설정 안내
Write-Host "[3/5] 클라우드 데이터베이스 설정 안내..." -ForegroundColor Yellow
Write-Host ""
Write-Host "클라우드 PostgreSQL을 설정해야 합니다. (무료 옵션)" -ForegroundColor Cyan
Write-Host ""
Write-Host "  옵션 1: Neon (추천 - 가장 간단)" -ForegroundColor White
Write-Host "    → https://neon.tech 에서 무료 계정 생성" -ForegroundColor Gray
Write-Host "    → 새 프로젝트 생성 후 Connection string 복사" -ForegroundColor Gray
Write-Host ""
Write-Host "  옵션 2: Vercel Postgres" -ForegroundColor White
Write-Host "    → https://vercel.com 에서 Storage 생성" -ForegroundColor Gray
Write-Host ""
Write-Host "  옵션 3: Supabase" -ForegroundColor White
Write-Host "    → https://supabase.com 에서 무료 계정 생성" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠ .env.local의 DATABASE_URL과 DIRECT_URL에 연결 문자열을 입력하세요!" -ForegroundColor Yellow
Write-Host ""

$dbReady = Read-Host "클라우드 DB가 설정되었습니까? (Y/N)"
if ($dbReady -ne "Y" -and $dbReady -ne "y") {
    Write-Host ""
    Write-Host "클라우드 DB 설정 후 이 스크립트를 다시 실행하세요." -ForegroundColor Yellow
    Write-Host "또는 수동으로 다음 명령어들을 실행하세요:" -ForegroundColor Yellow
    Write-Host "  npm install" -ForegroundColor White
    Write-Host "  npm run db:push" -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
    exit 0
}
Write-Host ""

# 4. Node 모듈 확인 및 설치
Write-Host "[4/5] Node 모듈 확인 중..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✓ Node 모듈이 이미 설치되어 있습니다." -ForegroundColor Green
} else {
    Write-Host "Node 모듈 설치 중... (시간이 걸릴 수 있습니다)" -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Node 모듈이 설치되었습니다." -ForegroundColor Green
    } else {
        Write-Host "✗ Node 모듈 설치에 실패했습니다." -ForegroundColor Red
        exit 1
    }
}
Write-Host ""

# 5. 데이터베이스 초기화
Write-Host "[5/5] 데이터베이스 초기화 중..." -ForegroundColor Yellow
npm run db:push
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 데이터베이스가 초기화되었습니다." -ForegroundColor Green
} else {
    Write-Host "✗ 데이터베이스 초기화에 실패했습니다." -ForegroundColor Red
    Write-Host "  .env.local 파일의 DATABASE_URL이 올바르게 설정되었는지 확인해주세요." -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# 완료
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "설정 완료!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Cyan
Write-Host "1. .env.local 파일에서 API 키들이 모두 입력되었는지 확인하세요" -ForegroundColor White
Write-Host "2. 'npm run dev' 명령어로 개발 서버를 시작하세요" -ForegroundColor White
Write-Host "3. 브라우저에서 http://localhost:3000 에 접속하세요" -ForegroundColor White
Write-Host ""

# 개발 서버 실행 여부 물어보기
$runServer = Read-Host "지금 개발 서버를 시작하시겠습니까? (Y/N)"
if ($runServer -eq "Y" -or $runServer -eq "y") {
    Write-Host ""
    Write-Host "개발 서버 시작 중..." -ForegroundColor Cyan
    Write-Host "종료하려면 Ctrl+C를 누르세요" -ForegroundColor Yellow
    Write-Host ""
    npm run dev
}
