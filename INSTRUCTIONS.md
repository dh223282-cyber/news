# Premium Dual-Language News Portal

## Setup Instructions

1.  **Environment Setup**:
    -   Copy `.env.local.example` to `.env.local`.
    -   Fill in your Firebase config keys.

    ```bash
    cp .env.local.example .env.local
    ```

2.  **Firebase Setup**:
    -   Go to Firebase Console.
    -   Create a new project.
    -   Enable **Authentication** (Email/Password).
    -   Enable **Firestore** (Create Database).
    -   Enable **Storage**.
    -   Copy the configuration to `.env.local`.

3.  **Run Development Server**:

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000).

4.  **Admin Dashboard**:
    -   Navigate to `/admin`.
    -   Login using an account (you can create one in Firebase Auth console manually for the first admin).
    -   Upload/Manage news.

## Features implemented
-   **Next.js 14 App Router**
-   **Tailwind CSS V4** (Configured with `@theme`)
-   **Bilingual Support**: English & Tamil (Inter & Noto Sans Tamil fonts).
-   **Premium UI**: Glassmorphism, Animations (Framer Motion), Responsive.
-   **Video Section**: Dedicated section for video news.
-   **Admin Panel**: Protected route, CRUD operations, Image Upload.

Enjoy!
