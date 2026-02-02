import type { Metadata } from "next";
import { Inter, Noto_Sans_Tamil } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/ui/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansTamil = Noto_Sans_Tamil({
  variable: "--font-noto-sans-tamil",
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "7news",
  description: "Latest bilingual news in English and Tamil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${notoSansTamil.variable} antialiased min-h-screen bg-gray-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300`}
      >
        <LanguageProvider>
          <Navbar />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
