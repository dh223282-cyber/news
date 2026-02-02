# How to Connect Firebase

To connect your News Portal to Firebase, follow these step-by-step instructions.

## 1. Create a Firebase Project
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Create a project"**.
3.  Name your project (e.g., `tamil-news-portal`) and click **Continue**.
4.  (Optional) Disable Google Analytics for now to save time, then click **Create project**.
5.  Wait for the project to be ready and click **Continue**.

## 2. Register Your App
1.  In the Project Overview page, click the **Web icon (`</>`)** to add a web app.
2.  App nickname: `News Portal`.
3.  Click **Register app**.
4.  **Important**: You will see a `firebaseConfig` object with `apiKey`, `authDomain`, etc. **Keep this tab open** or copy these values.

## 3. Configure Environment Variables
I have already created a `.env.local` file in your project root. You need to paste the values from step 2 into this file.

Open `e:\news\.env.local` and replace the placeholders:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abcdef
```

## 4. Enable Firebase Services
For the app to work, you must enable three services in the Firebase Console:

### A. Authentication (Admin Login)
1.  Go to **Build > Authentication** in the left sidebar.
2.  Click **Get started**.
3.  Select **Email/Password** as the Sign-in provider.
4.  Enable the **Email/Password** switch and click **Save**.
5.  **Create an Admin User**:
    -   Click the **Users** tab.
    -   Click **Add user**.
    -   Enter an email (e.g., `admin@test.com`) and a password.
    -   *You will use this to log in to the /admin dashboard.*

### B. Firestore Database (News Data)
1.  Go to **Build > Firestore Database**.
2.  Click **Create database**.
3.  Choose a location (e.g., `nam5 (us-central)`) and click **Next**.
4.  **Start in Test Mode** (for now, to avoid permission issues while developing).
    -   Select "Start in 
    **test mode**".
    -   Click **Create**.

### C. Storage (Images/Videos)
1.  Go to **Build > Storage**.
2.  Click **Get started**.
3.  Start in **Test Mode** and click **Next**.
4.  Click **Done**.

## 5. Restart Development Server
Since you added environment variables, you must restart your Next.js server.

1.  Go to your terminal where `npm run dev` is running.
2.  Press `Ctrl + C` to stop it.
3.  Run `npm run dev` again.

You are now connected!
