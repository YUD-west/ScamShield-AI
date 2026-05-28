# ScamShield AI - Run each step one by one (press Enter between steps)
$ErrorActionPreference = "Stop"
$root = "C:\Users\Administrator\scamshield-ai"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " STEP 1: Go to project folder" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
Set-Location $root
Write-Host "Current folder:" (Get-Location).Path -ForegroundColor Green
Read-Host "Press Enter to continue to Step 2"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " STEP 2: Remove old node_modules" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules
    Write-Host "Deleted node_modules" -ForegroundColor Green
} else {
    Write-Host "node_modules not found (skipped)" -ForegroundColor Yellow
}
Read-Host "Press Enter to continue to Step 3"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " STEP 3: npm install (may take 2-5 min)" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { Write-Host "npm install FAILED" -ForegroundColor Red; exit 1 }
Write-Host "npm install OK" -ForegroundColor Green
Read-Host "Press Enter to continue to Step 4"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " STEP 4: Copy .env.example to .env" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env file" -ForegroundColor Green
} else {
    Write-Host ".env already exists (skipped)" -ForegroundColor Yellow
}
Read-Host "Press Enter to continue to Step 5"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " STEP 5: Start dev server" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host "Opening http://localhost:3010 in browser (ScamShield AI)..." -ForegroundColor Green
Start-Process "http://localhost:3010"
npm run dev
