# Vercel Deployment Guide for 7news

## Prerequisites
- A Vercel account (sign up at https://vercel.com)
- Your code already has a Git remote set up

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub** (if you haven't already)
   ```bash
   git push -u origin master
   ```

2. **Go to Vercel Dashboard**
   - Visit https://vercel.com/new
   - Click "Import Project"
   - Select "Import Git Repository"
   - Connect your GitHub account if not already connected
   - Select the repository: `dh223282-cyber/news`

3. **Configure Project Settings**
   - Framework Preset: Next.js (should auto-detect)
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

4. **Add Environment Variables**
   Click on "Environment Variables" and add the following:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDd-djI4B2iyHkoqfxz8svTptJ7UUv7FRk
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=news-43a83.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=news-43a83
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=news-43a83.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=944662783584
   NEXT_PUBLIC_FIREBASE_APP_ID=1:944662783584:web:16259897a6abd4f7fe0505
   ```

   **Important:** Add each variable separately:
   - Variable Name: `NEXT_PUBLIC_FIREBASE_API_KEY`
   - Value: `AIzaSyDd-djI4B2iyHkoqfxz8svTptJ7UUv7FRk`
   - Environment: Select all (Production, Preview, Development)
   
   Repeat for all 6 variables.

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 1-3 minutes)
   - Your site will be live at a URL like: `https://news-[random-hash].vercel.app`

6. **Configure Custom Domain (Optional)**
   - Go to your project settings
   - Navigate to "Domains"
   - Add your custom domain if you have one

### Option 2: Deploy via Vercel CLI

1. **Login to Vercel**
   ```bash
   vercel login
   ```
   Follow the authentication prompts in your browser.

2. **Deploy**
   ```bash
   vercel
   ```
   
   Answer the prompts:
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N`
   - What's your project's name? `news` or `7news`
   - In which directory is your code located? `./`
   - Want to override the settings? `N`

3. **Add Environment Variables**
   After first deployment, add environment variables:
   ```bash
   vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
   ```
   
   When prompted, enter: `AIzaSyDd-djI4B2iyHkoqfxz8svTptJ7UUv7FRk`
   Select all environments (Production, Preview, Development)
   
   Repeat for all 6 environment variables listed above.

4. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

## Post-Deployment

### Verify Your Deployment
1. Visit your Vercel deployment URL
2. Test these features:
   - Homepage loads correctly
   - Language switcher works (English/Urdu)
   - News articles display properly
   - Admin login page is accessible
   - Firebase integration works

### Troubleshooting

**Build Failed?**
- Check the build logs in Vercel dashboard
- Ensure all environment variables are set correctly
- Verify your `.env.local.example` matches production needs

**Firebase Not Working?**
- Double-check all Firebase environment variables
- Ensure Firebase project allows your Vercel domain
- Update Firebase Authentication authorized domains:
  1. Go to Firebase Console
  2. Authentication → Settings → Authorized domains
  3. Add your Vercel domain (e.g., `news-[hash].vercel.app`)

**404 Errors?**
- Make sure your Next.js routing is configured correctly
- Check that all pages are in the correct directory structure

## Continuous Deployment

Once set up, Vercel will automatically:
- Deploy every push to `master` branch to production
- Create preview deployments for pull requests
- Run builds and checks automatically

## Environment Variables Reference

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID |

## Important Notes

⚠️ **Security Reminder**: 
- Never commit `.env.local` to Git (it's already in `.gitignore`)
- Store sensitive credentials securely
- Use Vercel's environment variable encryption

🎉 **After Successful Deployment**:
- Your site will be available at a Vercel URL
- You'll get automatic SSL certificate
- CDN distribution globally
- Automatic scaling and performance optimization
