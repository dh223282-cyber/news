"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ta";

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
    en: {
        home: "Home",
        videos: "Videos",
        admin: "Admin Log In",
        readMore: "Read More",
        latestNews: "Latest News",
        trending: "Trending",
        switchLanguage: "தமிழ்", // Button text to switch TO Tamil
        login: "Login",
        logout: "Logout",
        dashboard: "Dashboard",
        uploadNews: "Upload News",
        upload: "Upload",
        title: "Title",
        description: "Description",
        category: "Category",
        submit: "Submit",
        loading: "Loading...",
        newsPortal: "7news",
    },
    ta: {
        home: "முகப்பு",
        videos: "காணொளிகள்",
        admin: "நிர்வாகப் பக்கம்",
        readMore: "மேலும் படிக்க",
        latestNews: "சமீபத்திய செய்திகள்",
        trending: "டிரெண்டிங்",
        switchLanguage: "English", // Button text to switch TO English
        login: "உள்நுழை",
        logout: "வெளியேறு",
        dashboard: "முகப்பு பலகை",
        uploadNews: "செய்தியைப் பதிவேற்றவும்",
        upload: "பதிவேற்று",
        title: "தலைப்பு",
        description: "விளக்கம்",
        category: "வகை",
        submit: "சமர்ப்பிக்க",
        loading: "ஏற்றுகிறது...",
        newsPortal: "7news",
    },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>("en");

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "ta" : "en"));
    };

    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
