$tempDir = "temp-ghpages"

if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}

New-Item -ItemType Directory -Path $tempDir
Set-Location $tempDir

git init
git config user.email "actions@github.com"
git config user.name "GitHub Actions"

Copy-Item -Path "../dist/*" -Destination "." -Recurse

New-Item -ItemType File -Name ".nojekyll"

git add .
git commit -m "Deploy to gh-pages"

git remote add origin https://github.com/xz878787/vibecodingFullStack.git
git push origin master:gh-pages -f

Set-Location ..
Remove-Item -Recurse -Force $tempDir

Write-Host "Deployment completed successfully!"
