"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NewsItem } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ArrowLeft, Calendar, Share2 } from "lucide-react";

export default function NewsDetailPage() {
    const { id } = useParams();
    const { t, language } = useLanguage();
    const router = useRouter();
    const [news, setNews] = useState<NewsItem | null>(null);
    const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Main Article
                const docRef = doc(db, "news", id as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setNews({ id: docSnap.id, ...docSnap.data() } as NewsItem);
                } else {
                    console.error("No such document!");
                }

                // Fetch Related News (Limit 6)
                const q = query(collection(db, "news"), orderBy("createdAt", "desc"), limit(6));
                const querySnapshot = await getDocs(q);
                const items = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as NewsItem))
                    .filter(item => item.id !== id); // Exclude current

                setRelatedNews(items);

            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-slate-900">
                <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
            </div>
        );
    }

    if (!news) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center dark:bg-slate-900 text-center p-4">
                <h2 className="text-2xl font-bold dark:text-white mb-4">News Not Found</h2>
                <Link href="/" className="text-blue-600 hover:underline">Return Home</Link>
            </div>
        );
    }

    const title = language === 'en' ? news.title_en : news.title_ta;
    const description = language === 'en' ? news.description_en : news.description_ta;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 pb-20 pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6 hover:text-blue-600 transition"
                >
                    <ArrowLeft className="w-5 h-5" /> {t("back") || "Back"}
                </button>

                {/* Main Content */}
                <article className="prose dark:prose-invert max-w-none">
                    <h1 className={`text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight ${language === 'ta' ? 'font-tamil' : ''}`}>
                        {title}
                    </h1>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 border-b dark:border-slate-800 pb-6">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full font-medium">
                            {news.category}
                        </span>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(news.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="relative w-full h-[400px] md:h-[500px] mb-10 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src={news.imageUrl}
                            alt={title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className={`text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap ${language === 'ta' ? 'font-tamil' : ''}`}>
                        {description}
                    </div>
                </article>

                {/* Related News Section */}
                <div className="mt-20 border-t dark:border-slate-800 pt-10">
                    <h3 className="text-2xl font-bold mb-8 dark:text-white">{t("relatedNews") || "Related News"}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {relatedNews.map((item) => (
                            <Link href={`/news/${item.id}`} key={item.id} className="group block h-full">
                                <div className="bg-gray-50 dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition h-full flex flex-col">
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={item.imageUrl || "/placeholder.jpg"}
                                            alt={item.title_en}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2">{item.category}</div>
                                        <h4 className={`text-lg font-bold dark:text-white line-clamp-2 mb-2 ${language === 'ta' ? 'font-tamil' : ''}`}>
                                            {language === 'en' ? item.title_en : item.title_ta}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-grow">
                                            {language === 'en' ? item.description_en : item.description_ta}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
