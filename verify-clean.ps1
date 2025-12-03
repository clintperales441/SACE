# Verify that target/ is removed from git history
Write-Host "Checking if backend/target exists in git history..." -ForegroundColor Yellow

$result = git log --all --full-history -- "backend/target" 2>&1
if ($result -match "fatal" -or $result.Count -eq 0) {
    Write-Host "✅ SUCCESS: backend/target is no longer in git history!" -ForegroundColor Green
} else {
    Write-Host "❌ FAILED: backend/target still exists in history" -ForegroundColor Red
    Write-Host $result
}

Write-Host "`nChecking for the specific commit with secrets..." -ForegroundColor Yellow
$commit = "eed6d1c9424a786c7b6624516e9d8813b27469ad"
$exists = git cat-file -e $commit 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "⚠️  Commit still exists. Checking if it has the file..." -ForegroundColor Yellow
    $fileCheck = git show "$commit`:backend/target/classes/application.properties" 2>&1
    if ($fileCheck -match "fatal" -or $fileCheck.Count -eq 0) {
        Write-Host "✅ File removed from commit!" -ForegroundColor Green
    } else {
        Write-Host "❌ File still in commit" -ForegroundColor Red
    }
} else {
    Write-Host "✅ Commit removed or rewritten!" -ForegroundColor Green
}

Write-Host "`nCurrent commit hashes:" -ForegroundColor Cyan
git log --oneline -5

