"use client";

import { NewsItem } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import Image from "next/image";

interface NewsCardProps {
    news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
    const { language } = useLanguage();

    const title = language === "en" ? news.title_en : news.title_ta;
    const description = language === "en" ? news.description_en : news.description_ta;

    const displayTitle = title || news.title_en || news.title_ta;
    const displayDesc = description || news.description_en || news.description_ta;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
        >
            <div className="relative h-64 overflow-hidden flex-shrink-0">
                <Image
                    src={news.imageUrl || "/placeholder.jpg"} // basic fallback
                    alt={displayTitle || "News Image"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                    <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold tracking-wider text-white uppercase bg-blue-600 rounded-full">
                        {news.category}
                    </span>
                    <h3 className={`text-xl font-bold text-white leading-tight line-clamp-2 ${language === 'ta' ? 'font-tamil' : 'font-sans'}`}>
                        {displayTitle}
                    </h3>
                </div>
            </div>
            <div className="p-6 flex-grow flex flex-col justify-between">
                <p className={`text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 ${language === 'ta' ? 'font-tamil' : 'font-sans'}`}>
                    {displayDesc}
                </p>
                <button className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1 group/btn mt-auto">
                    {language === 'en' ? 'Read More' : 'மேலும் படிக்க'}
                    <span className="transform transition-transform group-hover/btn:translate-x-1">→</span>
                </button>
            </div>
        </motion.div>
    );
}
