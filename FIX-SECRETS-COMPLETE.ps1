# Complete fix for removing secrets from git history
# Run this script to clean your git history

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Removing Secrets from Git History" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Remove entire backend/target directory from all commits
Write-Host "Step 1: Removing backend/target/ from all commits..." -ForegroundColor Yellow
python -m git_filter_repo --path backend/target --invert-paths --force

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error running git-filter-repo" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Step 1 complete" -ForegroundColor Green
Write-Host ""

# Step 2: Clean up git
Write-Host "Step 2: Cleaning up git repository..." -ForegroundColor Yellow
git reflog expire --expire=now --all
git gc --prune=now --aggressive

Write-Host "✅ Step 2 complete" -ForegroundColor Green
Write-Host ""

# Step 3: Verify
Write-Host "Step 3: Verifying removal..." -ForegroundColor Yellow
$check = git log --all --full-history -- "backend/target" 2>&1
if ($check -match "fatal" -or $check.Count -eq 0) {
    Write-Host "✅ Verification passed - target/ removed from history" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: target/ may still exist in some commits" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Show next steps
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Review the changes:" -ForegroundColor Yellow
Write-Host "   git log --oneline -10" -ForegroundColor White
Write-Host ""
Write-Host "2. Force push to overwrite remote history:" -ForegroundColor Yellow
Write-Host "   git push origin main --force" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  WARNING: Force push will overwrite remote history!" -ForegroundColor Red
Write-Host "   Make sure no one else is working on this repo, or" -ForegroundColor Red
Write-Host "   they will need to re-clone." -ForegroundColor Red
Write-Host ""
Write-Host "3. After pushing, ROTATE your Google OAuth credentials" -ForegroundColor Yellow
Write-Host "   since they were exposed in git history." -ForegroundColor Yellow
Write-Host ""

