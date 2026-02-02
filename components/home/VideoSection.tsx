"use client";

import { useLanguage } from "@/context/LanguageContext";
import { NewsItem } from "@/types";
import { motion } from "framer-motion";

export default function VideoSection({ videos }: { videos: NewsItem[] }) {
    const { t, language } = useLanguage();

    if (videos.length === 0) return null;

    return (
        <section id="videos" className="py-20 bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className={`text-4xl font-bold mb-12 text-center bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent ${language === 'ta' ? 'font-tamil' : 'font-sans'}`}>
                    {t("videos")}
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map((video) => (
                        <motion.div
                            key={video.id}
                            className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="relative aspect-video bg-black">
                                <video
                                    src={video.videoUrl}
                                    controls
                                    poster={video.imageUrl}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="p-5">
                                <h3 className={`text-lg font-bold mb-2 line-clamp-2 ${language === 'ta' ? 'font-tamil' : 'font-sans'}`}>
                                    {language === 'en' ? video.title_en : video.title_ta}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
