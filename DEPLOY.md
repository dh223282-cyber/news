# Deploy to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

## Prerequisites

1.  **GitHub Account**: Ensure you have a GitHub account.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).

## Step 1: Push to GitHub

1.  Initialize Git (if not already done) and commit your changes:
    ```bash
    git add .
    git commit -m "Ready for deployment"
    ```
2.  Create a new repository on GitHub.
3.  Link your local project to GitHub:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

## Step 2: Deploy on Vercel

1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository (`7news-portal` etc).
4.  **Configure Environment Variables**:
    *   Expand the **"Environment Variables"** section.
    *   Add all the variables from your `.env.local` file:
        *   `NEXT_PUBLIC_FIREBASE_API_KEY`
        *   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
        *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
        *   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
        *   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
        *   `NEXT_PUBLIC_FIREBASE_APP_ID`
5.  Click **Deploy**.

## Step 3: Verify

Vercel will build your project and provide a live URL (e.g., `https://your-project.vercel.app`).
Visit the URL to see your live bilingual news portal!

---

## Alternative: Vercel CLI (Advanced)

If you have the Vercel CLI installed, you can deploy directly from your terminal:

```bash
npx vercel login
npx vercel
```

Follow the prompts to link the project and deploy.
