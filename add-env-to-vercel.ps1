# PowerShell script to add environment variables to Vercel
# Run this AFTER you've authenticated with `vercel login`

Write-Host "Adding Firebase environment variables to Vercel..." -ForegroundColor Cyan

# Set the project name (change if needed)
$projectName = "7news"

Write-Host "`nAdding NEXT_PUBLIC_FIREBASE_API_KEY..." -ForegroundColor Yellow
echo "AIzaSyDd-djI4B2iyHkoqfxz8svTptJ7UUv7FRk" | vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production

Write-Host "`nAdding NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN..." -ForegroundColor Yellow
echo "news-43a83.firebaseapp.com" | vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production

Write-Host "`nAdding NEXT_PUBLIC_FIREBASE_PROJECT_ID..." -ForegroundColor Yellow
echo "news-43a83" | vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production

Write-Host "`nAdding NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET..." -ForegroundColor Yellow
echo "news-43a83.firebasestorage.app" | vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production

Write-Host "`nAdding NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID..." -ForegroundColor Yellow
echo "944662783584" | vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production

Write-Host "`nAdding NEXT_PUBLIC_FIREBASE_APP_ID..." -ForegroundColor Yellow
echo "1:944662783584:web:16259897a6abd4f7fe0505" | vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production

Write-Host "`n✅ All environment variables added!" -ForegroundColor Green
Write-Host "`nNow deploying to production..." -ForegroundColor Cyan
vercel --prod

Write-Host "`n🎉 Deployment complete!" -ForegroundColor Green
