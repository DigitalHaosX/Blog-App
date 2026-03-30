// src/services/ratingService.ts
import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import type { Rating } from "../types";

export const addRating = async (rating: Omit<Rating, "id">) => {
  // 1. Persist the new rating
  const result = await addDoc(collection(db, "ratings"), rating);

  // 2. Recompute average across all ratings for this article
  const q = query(
    collection(db, "ratings"),
    where("articleId", "==", rating.articleId),
  );
  const snapshot = await getDocs(q);
  const values = snapshot.docs.map((d) => (d.data() as Rating).value);
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;

  // 3. Write the updated average back to the article document
  await updateDoc(doc(db, "articles", rating.articleId), {
    avgRating: Math.round(avg * 10) / 10,
  });

  return result;
};

export const getRatingsForArticle = async (articleId: string) => {
  const q = query(
    collection(db, "ratings"),
    where("articleId", "==", articleId),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Rating[];
};
