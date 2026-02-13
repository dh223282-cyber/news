"use client";

import { useEffect, useState, useRef } from "react";
import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useLanguage } from "@/context/LanguageContext";
import { NewsItem } from "@/types";
import { Plus, Edit, Trash, LogOut, Upload, X, Loader2 } from "lucide-react";

export default function AdminDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const { t } = useLanguage();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<NewsItem>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Check for critical environment variables
        const requiredVars = [
            'NEXT_PUBLIC_FIREBASE_API_KEY',
            'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
            'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'
        ];
        const missing = requiredVars.filter(v => !process.env[v]);
        if (missing.length > 0) {
            console.error("Missing Env Vars:", missing);
            alert(`Configuration Error: Missing environment variables: ${missing.join(', ')}. Please add them to Vercel.`);
        }

        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (!u) {
                router.push("/admin/login");
            } else {
                setUser(u);
                fetchNews();
            }
        });
        return () => unsubscribe();
    }, [router]);

    const fetchNews = async () => {
        try {
            const q = query(collection(db, "news"), orderBy("createdAt", "desc"), limit(50));
            const snapshot = await getDocs(q);
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
            setNews(items);
        } catch (e) {
            console.error("Error fetching news", e);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/admin/login");
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setImageFile(null);
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Safety Timeout
        const safetyTimeout = setTimeout(() => {
            setLoading((prev) => {
                if (prev) {
                    alert("Network Timed Out. Check your connection.");
                    return false;
                }
                return prev;
            });
        }, 15000);

        console.log("--- Starting News Upload Process ---");

        // VALIDATION
        if (!currentItem.title_en || !currentItem.description_en || !currentItem.category) {
            clearTimeout(safetyTimeout);
            alert('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        try {
            let finalImageUrl = currentItem.imageUrl || "";

            if (imageFile) {
                // Upload Image
                const storageRef = ref(storage, `news/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                finalImageUrl = await getDownloadURL(snapshot.ref);
            }

            // Prepare Data
            const newsData = {
                title_en: currentItem.title_en || "",
                title_ta: currentItem.title_ta || "",
                description_en: currentItem.description_en || "",
                description_ta: currentItem.description_ta || "",
                category: currentItem.category || "General",
                videoUrl: currentItem.videoUrl || "",
                imageUrl: finalImageUrl,
                createdAt: currentItem.createdAt || Date.now(),
            };

            // Write to Firestore
            if (currentItem.id) {
                await updateDoc(doc(db, "news", currentItem.id), newsData);
            } else {
                await addDoc(collection(db, "news"), newsData);
            }

            // CRITICAL: UI Feedback MUST happen immediately after await finishes
            clearTimeout(safetyTimeout);
            setLoading(false); // Stop spinner
            alert('Success! Post published.'); // Show alert
            setIsModalOpen(false); // Close modal

            // Reset Form (Background)
            setImageFile(null);
            setPreviewUrl(null);
            setCurrentItem({});

            // Refresh List (Background - do not await or block UI)
            fetchNews().catch(err => console.warn("Background refresh failed", err));

        } catch (error: any) {
            clearTimeout(safetyTimeout);
            setLoading(false);
            console.error("Upload failed:", error);

            let msg = error.message;
            if (error.code === 'permission-denied') msg = "Permission Denied. Check Rules.";
            alert(`Error: ${msg}`);
        }
    };


    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this news?")) {
            await deleteDoc(doc(db, "news", id));
            fetchNews();
        }
    };

    const openModal = (item?: NewsItem) => {
        if (item) {
            setCurrentItem(item);
        } else {
            setCurrentItem({});
        }
        setPreviewUrl(null);
        setSuccessMessage(null);
        setIsModalOpen(true);
    };

    // Safe check for loading state before user auth confirms
    if (!user) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-900 dark:text-white"><Loader2 className="animate-spin w-8 h-8" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold dark:text-white">{t("dashboard")}</h1>
                    <div className="flex gap-4">
                        <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                            <Plus className="w-5 h-5" /> {t("uploadNews")}
                        </button>
                        <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                            <LogOut className="w-5 h-5" /> {t("logout")}
                        </button>
                    </div>
                </div>

                {/* News List */}
                <div className="grid gap-6">
                    {news.length === 0 && <p className="text-center text-gray-500">No news found. Add some!</p>}
                    {news.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex flex-col md:flex-row gap-6 items-center">
                            <div className="w-full md:w-48 h-32 relative flex-shrink-0">
                                <img src={item.imageUrl || "/placeholder.jpg"} alt="News" className="w-full h-full object-cover rounded-lg" />
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold mb-1 dark:text-white">{item.title_en}</h3>
                                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300 font-tamil">{item.title_ta}</h4>
                                <div className="text-sm text-gray-400 mt-2 flex gap-3">
                                    <span className="bg-gray-200 dark:bg-slate-700 px-2 py-0.5 rounded text-gray-800 dark:text-gray-200">{item.category}</span>
                                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-full transition">
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 rounded-full transition">
                                    <Trash className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                            <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
                                <h2 className="text-2xl font-bold dark:text-white">{currentItem.id ? "Edit News" : "Add News"}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full">
                                    <X className="w-6 h-6 dark:text-gray-300" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* English Section */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-blue-600 uppercase text-sm tracking-wider">English Content</h3>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Title (EN)</label>
                                            <input
                                                className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                                value={currentItem.title_en || ""}
                                                onChange={e => setCurrentItem({ ...currentItem, title_en: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description (EN)</label>
                                            <textarea
                                                className="w-full px-4 py-2 border rounded-lg h-32 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                                value={currentItem.description_en || ""}
                                                onChange={e => setCurrentItem({ ...currentItem, description_en: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Tamil Section */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-blue-600 uppercase text-sm tracking-wider">Tamil Content</h3>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Title (TA)</label>
                                            <input
                                                className="w-full px-4 py-2 border rounded-lg font-tamil dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                                value={currentItem.title_ta || ""}
                                                onChange={e => setCurrentItem({ ...currentItem, title_ta: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description (TA)</label>
                                            <textarea
                                                className="w-full px-4 py-2 border rounded-lg h-32 font-tamil dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                                value={currentItem.description_ta || ""}
                                                onChange={e => setCurrentItem({ ...currentItem, description_ta: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Category</label>
                                        <select
                                            className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                            value={currentItem.category || "General"}
                                            onChange={e => setCurrentItem({ ...currentItem, category: e.target.value })}
                                        >
                                            <option value="World">World</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Politics">Politics</option>
                                            <option value="Sports">Sports</option>
                                            <option value="Culture">Culture</option>
                                            <option value="General">General</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Video URL (Optional)</label>
                                        <input
                                            className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                            value={currentItem.videoUrl || ""}
                                            onChange={e => setCurrentItem({ ...currentItem, videoUrl: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Image</label>
                                    <div className="flex items-center gap-4">
                                        {(previewUrl || currentItem.imageUrl) && (
                                            <img
                                                src={previewUrl || currentItem.imageUrl}
                                                className="h-20 w-20 object-cover rounded border dark:border-slate-600"
                                                alt="Preview"
                                            />
                                        )}
                                        <div className="relative">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageChange}
                                                accept="image/*"
                                                className="hidden"
                                                id="file-upload"
                                            />
                                            <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:hover:bg-slate-600 transition">
                                                <Upload className="w-4 h-4" /> {imageFile ? "Change Image" : "Upload New Image"}
                                            </label>
                                        </div>
                                    </div>
                                    {imageFile && <p className="text-xs text-blue-500 mt-1">Selected: {imageFile.name}</p>}
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t dark:border-slate-700">
                                    {successMessage && (
                                        <div className="text-green-600 dark:text-green-400 font-medium animate-pulse">
                                            {successMessage}
                                        </div>
                                    )}
                                    <div className="flex gap-4 ml-auto">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition">
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {loading && <Loader2 className="animate-spin w-4 h-4" />}
                                            {currentItem.id ? "Update Post" : "Publish Post"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
