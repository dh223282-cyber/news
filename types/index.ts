export interface NewsItem {
    id: string;
    title_en: string;
    title_ta: string;
    description_en: string;
    description_ta: string;
    imageUrl: string;
    videoUrl?: string;
    category: string;
    createdAt: number;
}
