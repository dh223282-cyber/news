"use client";

import { useLanguage } from "@/context/LanguageContext";
import NewsCard from "@/components/home/NewsCard";
import VideoSection from "@/components/home/VideoSection";
import { NewsItem } from "@/types";
import { motion } from "framer-motion";

// Mock data
const mockNews: NewsItem[] = [
  {
    id: "1",
    title_en: "Global Climate Summit Reaches Historic Agreement",
    title_ta: "உலக காலநிலை உச்சிமாநாடு வரலாற்று சிறப்புமிக்க ஒப்பந்தத்தை எட்டியது",
    description_en: "World leaders have agreed to a comprehensive plan to reduce carbon emissions by 50% by 2030, marking a significant turning point in the fight against climate change.",
    description_ta: "காலநிலை மாற்றத்திற்கு எதிரான போராட்டத்தில் ஒரு முக்கிய திருப்புமுனையை குறிக்கும் வகையில், 2030 ஆம் ஆண்டிற்குள் கார்பன் உமிழ்வை 50% குறைப்பதற்கான விரிவான திட்டத்திற்கு உலகத் தலைவர்கள் ஒப்புக்கொண்டுள்ளனர்.",
    imageUrl: "/news_placeholder.png", // Use local placeholder
    category: "World",
    createdAt: Date.now(),
  },
  {
    id: "2",
    title_en: "Tech Giant Unveils Revolutionary AI Assistant",
    title_ta: "தொழில்நுட்ப நிறுவனம் புரட்சிகர AI உதவியாளரை அறிமுகப்படுத்தியது",
    description_en: "The new AI model promises to transform how we interact with technology, featuring human-like reasoning and multimodal capabilities.",
    description_ta: "புதிய AI மாடல், மனிதனைப் போன்ற பகுத்தறிவு மற்றும் பல்திறன் திறன்களைக் கொண்டு, தொழில்நுட்பத்துடன் நாம் தொடர்பு கொள்ளும் விதத்தை மாற்றுவதாக உறுதியளிக்கிறது.",
    imageUrl: "/news_placeholder.png", // reusing for demo
    category: "Technology",
    createdAt: Date.now() - 100000,
  },
  {
    id: "3",
    title_en: "Local Festival Draws Record Crowds",
    title_ta: "உள்ளூர் திருவிழா சாதனை கூட்டத்தை ஈர்த்தது",
    description_en: "Thousands gathered to celebrate the annual cultural festival, featuring traditional music, dance, and cuisine from across the region.",
    description_ta: "பிராந்தியம் முழுவதிலும் இருந்து பாரம்பரிய இசை, நடனம் மற்றும் உணவு வகைகளைக் கொண்ட வருடாந்திர கலாச்சார விழாவைக் கொண்டாட ஆயிரக்கணக்கானோர் திரண்டனர்.",
    imageUrl: "/news_placeholder.png",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Free sample video
    category: "Culture",
    createdAt: Date.now() - 200000,
  },
  {
    id: "4",
    title_en: "SpaceX Successful Launch",
    title_ta: "SpaceX வெற்றிகரமான ஏவுதல்",
    description_en: "Another successful mission for SpaceX as they deploy new satellites into orbit.",
    description_ta: "SpaceX புதிய செயற்கைக்கோள்களை சுற்றுப்பாதையில் நிலைநிறுத்துவதன் மூலம் மற்றொரு வெற்றிகரமான பணியை முடித்துள்ளது.",
    imageUrl: "/news_placeholder.png",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    category: "Science",
    createdAt: Date.now() - 300000,
  },
];

export default function Home() {
  const { t, language } = useLanguage();

  const newsItems = mockNews;
  const videoItems = newsItems.filter(item => item.videoUrl);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-end">
        <div className="absolute inset-0 z-0">
          <img src="/news_placeholder.png" alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-slate-950 via-slate-900/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20">
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
              {language === 'en' ? newsItems[0].title_en : newsItems[0].title_ta}
            </h1>
            <p className={`text-xl text-gray-100 max-w-2xl line-clamp-3 text-shadow-sm ${language === 'ta' ? 'font-tamil' : 'font-sans'}`}>
              {language === 'en' ? newsItems[0].description_en : newsItems[0].description_ta}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className={`text-3xl font-bold border-l-4 border-blue-600 pl-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-gray-400 bg-clip-text text-transparent ${language === 'ta' ? 'font-tamil' : 'font-sans'}`}>
            {t("latestNews")}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map(item => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      </section>

      {/* Videos */}
      <VideoSection videos={videoItems} />
    </div>
  );
}
