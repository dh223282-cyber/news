"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

export default function Navbar() {
    const { t, language, toggleLanguage } = useLanguage();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    // Hydration mismatch fix: render a placeholder or nothing until mounted
    // We can render the structure but avoid rendering the specific icon dependent state if strictly needed,
    // but usually 'mounted' approach returning null for the interactive part is safer or just use mounted to key the icon.

    return (
        <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center">
                            <Image src="/logo.png" alt="7news Logo" width={120} height={40} className="object-contain h-10 w-auto" priority />
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                            {t("home")}
                        </Link>
                        <Link href="/admin" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                            {t("upload")}
                        </Link>
                        <Link href="/#videos" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                            {t("videos")}
                        </Link>
                        <Link href="/admin/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                            {t("admin")}
                        </Link>

                        <button onClick={toggleLanguage} className="px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded-full text-sm font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition">
                            {t("switchLanguage")}
                        </button>

                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition">
                            {mounted && (resolvedTheme === "dark" ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />)}
                        </button>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 dark:text-gray-300">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-4 space-y-2 flex flex-col items-center">
                            <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-slate-900 w-full text-center">
                                {t("home")}
                            </Link>
                            <Link href="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-slate-900 w-full text-center">
                                {t("upload")}
                            </Link>
                            <Link href="/#videos" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-slate-900 w-full text-center">
                                {t("videos")}
                            </Link>
                            <Link href="/admin/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-slate-900 w-full text-center">
                                {t("admin")}
                            </Link>
                            <button onClick={() => { toggleLanguage(); setIsOpen(false); }} className="w-full mt-2 px-3 py-2 bg-gray-100 dark:bg-slate-800 rounded-lg font-medium text-sm">
                                {t("switchLanguage")}
                            </button>
                            <button onClick={toggleTheme} className="mt-2 p-2 w-full flex justify-center">
                                {mounted && (resolvedTheme === "dark" ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />)}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
