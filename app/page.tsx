"use client";

import { useLanguage } from "@/context/LanguageContext";
import NewsCard from "@/components/home/NewsCard";
import VideoSection from "@/components/home/VideoSection";
import { NewsItem } from "@/types";
import { motion } from "framer-motion";

import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
  const { t, language } = useLanguage();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log("Fetching news from collection 'news'...");
        const q = query(collection(db, "news"), orderBy("createdAt", "desc"), limit(10));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
        setNewsItems(items);
        console.log(`Fetched ${items.length} items.`);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const videoItems = newsItems.filter(item => item.videoUrl);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (newsItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-950">
        <h2 className="text-2xl font-bold dark:text-white">No News Found</h2>
      </div>
    );
  }

  const heroItem = newsItems[0];

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-end">
        <div className="absolute inset-0 z-0">
          <img src={heroItem?.imageUrl || "/news_placeholder.png"} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-slate-950 via-slate-900/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20">
          {heroItem && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1 mb-4 text-sm font-bold tracking-wider text-white uppercase bg-red-600 rounded shadow-lg backdrop-blur-sm">
                {t("trending")}
              </span>
              <h1
                className={`text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 max-w-5xl leading-tight drop-shadow-lg ${language === 'ta' ? 'font-tamil' : 'font-sans'}`}
              >
                {language === 'en' ? heroItem.title_en : heroItem.title_ta}
              </h1>
              <p className={`text-xl text-gray-100 max-w-2xl line-clamp-3 text-shadow-sm ${language === 'ta' ? 'font-tamil' : 'font-sans'}`}>
                {language === 'en' ? heroItem.description_en : heroItem.description_ta}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className={`text-3xl font-bold border-l-4 border-blue-600 pl-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-gray-400 bg-clip-text text-transparent ${language === 'ta' ? 'font-tamil' : 'font-sans'}`}>
            {t("latestNews")}
          </h2>
        </div>

        {newsItems.length === 0 ? (
          <div className="text-center py-20 bg-gray-100 dark:bg-slate-900 rounded-3xl">
            <p className="text-gray-500 dark:text-gray-400 text-xl font-medium">No news articles found. Please check back later!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map(item => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        )}
      </section>

      {/* Videos */}
      <VideoSection videos={videoItems} />
    </div>
  );
}
