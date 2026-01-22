# TweetLingo Chrome Extension 빌드 스크립트
# Windows PowerShell에서 실행

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "TweetLingo Extension 빌드" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Extension 폴더로 이동
$extensionPath = "chrome-extension"

if (-not (Test-Path $extensionPath)) {
    Write-Host "✗ chrome-extension 폴더를 찾을 수 없습니다." -ForegroundColor Red
    exit 1
}

Set-Location $extensionPath

# 1. 아이콘 폴더 확인
Write-Host "[1/4] 아이콘 파일 확인 중..." -ForegroundColor Yellow
$iconsPath = "public\icons"
if (-not (Test-Path $iconsPath)) {
    Write-Host "⚠ 아이콘 폴더가 없습니다. 생성 중..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $iconsPath -Force | Out-Null
}

$requiredIcons = @("icon-16.png", "icon-48.png", "icon-128.png")
$missingIcons = @()

foreach ($icon in $requiredIcons) {
    if (-not (Test-Path "$iconsPath\$icon")) {
        $missingIcons += $icon
    }
}

if ($missingIcons.Count -gt 0) {
    Write-Host "⚠ 다음 아이콘 파일들이 없습니다:" -ForegroundColor Yellow
    foreach ($icon in $missingIcons) {
        Write-Host "  - $icon" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "ICONS_GUIDE.md 파일을 참고하여 아이콘을 생성해주세요." -ForegroundColor Yellow
    Write-Host ""
    
    $continue = Read-Host "아이콘 없이 계속하시겠습니까? (Y/N)"
    if ($continue -ne "Y" -and $continue -ne "y") {
        exit 1
    }
} else {
    Write-Host "✓ 모든 아이콘 파일이 존재합니다." -ForegroundColor Green
}
Write-Host ""

# 2. Node 모듈 확인
Write-Host "[2/4] Node 모듈 확인 중..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✓ Node 모듈이 설치되어 있습니다." -ForegroundColor Green
} else {
    Write-Host "Node 모듈 설치 중..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Node 모듈 설치에 실패했습니다." -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Node 모듈이 설치되었습니다." -ForegroundColor Green
}
Write-Host ""

# 3. 기존 빌드 삭제
Write-Host "[3/4] 기존 빌드 정리 중..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✓ 기존 빌드가 삭제되었습니다." -ForegroundColor Green
}
Write-Host ""

# 4. Extension 빌드
Write-Host "[4/4] Extension 빌드 중..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 빌드가 완료되었습니다!" -ForegroundColor Green
    Write-Host ""
    
    # dist 폴더 내용 확인
    Write-Host "빌드된 파일:" -ForegroundColor Cyan
    Get-ChildItem "dist" -Recurse -File | ForEach-Object {
        Write-Host "  $($_.FullName.Replace($pwd.Path + '\dist\', ''))" -ForegroundColor Gray
    }
    Write-Host ""
    
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "빌드 완료!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "다음 단계:" -ForegroundColor Cyan
    Write-Host "1. Chrome 브라우저를 엽니다" -ForegroundColor White
    Write-Host "2. chrome://extensions/ 를 입력합니다" -ForegroundColor White
    Write-Host "3. 우측 상단의 '개발자 모드'를 켭니다" -ForegroundColor White
    Write-Host "4. '압축 해제된 확장 프로그램을 로드합니다' 클릭" -ForegroundColor White
    Write-Host "5. chrome-extension\dist 폴더를 선택합니다" -ForegroundColor White
    Write-Host ""
    
    # Chrome Extensions 페이지 열기 제안
    $openChrome = Read-Host "Chrome Extensions 페이지를 여시겠습니까? (Y/N)"
    if ($openChrome -eq "Y" -or $openChrome -eq "y") {
        Start-Process "chrome://extensions/"
    }
    
} else {
    Write-Host "✗ 빌드에 실패했습니다." -ForegroundColor Red
    Write-Host "  에러 메시지를 확인해주세요." -ForegroundColor Yellow
    exit 1
}

# 원래 폴더로 복귀
Set-Location ..
