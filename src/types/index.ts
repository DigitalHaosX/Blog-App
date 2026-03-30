export interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: number;
  updatedAt?: number;
  avgRating?: number;
  imageUrl?: string;
}

export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  text: string;
  createdAt: number;
}

export interface Rating {
  id: string;
  articleId: string;
  userId: string;
  value: number; // 1–5
}
