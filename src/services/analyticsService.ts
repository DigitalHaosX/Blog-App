// src/services/analyticsService.ts
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── Session ID (tab-scoped, non-persistent) ────────────────────────────────
function getSessionId(): string {
  let sid = sessionStorage.getItem("blog_sid");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("blog_sid", sid);
  }
  return sid;
}

// ─── Track a page view ───────────────────────────────────────────────────────
// The Cloud Function `onPageViewCreated` handles deduplication and counter
// updates server-side. This client function only writes the raw event.
export const trackView = async (articleId: string): Promise<void> => {
  try {
    await addDoc(collection(db, "pageViews"), {
      articleId,
      timestamp: Date.now(),
      sessionId: getSessionId(),
    });
  } catch (err) {
    // Non-fatal — analytics must never break the app
    console.warn("[analyticsService] trackView failed:", err);
  }
};

// ─── Fetch summary counters ──────────────────────────────────────────────────
export const getAnalyticsSummary = async (): Promise<{
  totalVisitors: number;
  totalArticleReads: number;
}> => {
  const snap = await getDoc(doc(db, "analytics", "summary"));
  if (!snap.exists()) return { totalVisitors: 0, totalArticleReads: 0 };
  const data = snap.data();
  return {
    totalVisitors: data.totalVisitors ?? 0,
    totalArticleReads: data.totalArticleReads ?? 0,
  };
};

// ─── Daily reads for the last N days ─────────────────────────────────────────
// NOTE: Firestore only allows inequality filters on a single field per query,
// so we filter out "home" views in JavaScript after fetching.
export const getDailyReads = async (
  days: number,
): Promise<{ date: string; reads: number }[]> => {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const q = query(
    collection(db, "pageViews"),
    where("timestamp", ">=", since),
    orderBy("timestamp", "asc"),
  );
  const snap = await getDocs(q);

  const map: Record<string, number> = {};
  snap.docs.forEach((d) => {
    const data = d.data();
    if (data.articleId === "home") return;
    const key = new Date(data.timestamp as number).toISOString().slice(0, 10);
    map[key] = (map[key] ?? 0) + 1;
  });

  const result: { date: string; reads: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, reads: map[key] ?? 0 });
  }
  return result;
};

// ─── Reads for a custom date range (inclusive) ───────────────────────────────
export const getReadsInRange = async (
  fromIso: string,
  toIso: string,
): Promise<{ date: string; reads: number }[]> => {
  const fromTs = new Date(fromIso).getTime();
  const toTs = new Date(toIso + "T23:59:59.999").getTime();

  const q = query(
    collection(db, "pageViews"),
    where("timestamp", ">=", fromTs),
    where("timestamp", "<=", toTs),
    orderBy("timestamp", "asc"),
  );
  const snap = await getDocs(q);

  const map: Record<string, number> = {};
  snap.docs.forEach((d) => {
    const data = d.data();
    if (data.articleId === "home") return;
    const key = new Date(data.timestamp as number).toISOString().slice(0, 10);
    map[key] = (map[key] ?? 0) + 1;
  });

  // Fill every date in the range with 0 where no reads occurred
  const result: { date: string; reads: number }[] = [];
  const cursor = new Date(fromIso);
  const end = new Date(toIso);
  while (cursor <= end) {
    const key = cursor.toISOString().slice(0, 10);
    result.push({ date: key, reads: map[key] ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
};

// ─── Rating distribution (1–5) ───────────────────────────────────────────────
export const getRatingDistribution = async (): Promise<
  { value: number; count: number }[]
> => {
  const snap = await getDocs(collection(db, "ratings"));
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  snap.docs.forEach((d) => {
    const v = d.data().value as number;
    if (v >= 1 && v <= 5) counts[v]++;
  });
  return [1, 2, 3, 4, 5].map((v) => ({ value: v, count: counts[v] }));
};
