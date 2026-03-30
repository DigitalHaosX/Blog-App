// src/services/articleService.ts
import { db } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import type { Article } from "../types";

const articlesRef = collection(db, "articles");

export const createArticle = async (article: Omit<Article, "id">) => {
  return await addDoc(articlesRef, article);
};

export const updateArticle = async (id: string, data: Partial<Article>) => {
  return await updateDoc(doc(db, "articles", id), data);
};

export const deleteArticle = async (id: string) => {
  return await deleteDoc(doc(db, "articles", id));
};

// ✅ Fetch a single article by ID
export const getArticle = async (id: string): Promise<Article | null> => {
  const snap = await getDoc(doc(db, "articles", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Article;
};

// ✅ One-time fetch with newest first
export const getArticles = async () => {
  const q = query(articlesRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Article[];
};

// ✅ Real-time subscription with newest first
export const subscribeToArticles = (
  callback: (articles: Article[]) => void,
) => {
  const q = query(articlesRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Article[];
    callback(data);
  });
};
