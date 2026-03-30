// src/services/commentService.ts
import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import type { Comment } from "../types";

export const addComment = async (comment: Omit<Comment, "id">) => {
  return await addDoc(collection(db, "comments"), comment);
};

export const getCommentsByArticle = async (articleId: string) => {
  const q = query(
    collection(db, "comments"),
    where("articleId", "==", articleId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Comment[];
};
