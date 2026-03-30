/**
 * Cloud Function: onPageViewCreated
 *
 * Triggers on every new document in the `pageViews` collection.
 * Performs server-side visitor deduplication using a `sessions` collection
 * that tracks unique {sessionId}_{YYYY-MM-DD} pairs, then atomically
 * updates the `analytics/summary` singleton.
 *
 * Deduplication strategy:
 *   - One unique visitor per sessionId per calendar day.
 *   - Multiple article reads within the same session still
 *     increment `totalArticleReads` but only increment
 *     `totalVisitors` once per day.
 *
 * Deploy:
 *   cd functions && npm install && npm run build
 *   firebase deploy --only functions
 *
 * Emulate locally:
 *   firebase emulators:start --only functions,firestore
 */

import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

initializeApp();

export const onPageViewCreated = onDocumentCreated(
  "pageViews/{docId}",
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const raw = snap.data() as {
      sessionId?: string;
      articleId?: string;
      timestamp?: number;
    };

    const { sessionId, articleId, timestamp } = raw;
    if (!sessionId || !articleId || !timestamp) return;

    const db = getFirestore();
    const date = new Date(timestamp).toISOString().slice(0, 10);

    // Dedup key: unique per session per day
    const dedupId = `${sessionId}_${date}`;
    const dedupRef = db.collection("sessions").doc(dedupId);
    const summaryRef = db.collection("analytics").doc("summary");

    await db.runTransaction(async (tx) => {
      const dedupSnap = await tx.get(dedupRef);
      const isNewVisitor = !dedupSnap.exists;

      // Mark this session as seen for today
      if (isNewVisitor) {
        tx.set(dedupRef, { sessionId, date, createdAt: timestamp });
      }

      // Build the summary update
      const updates: Record<string, unknown> = {
        lastUpdated: FieldValue.serverTimestamp(),
      };

      if (isNewVisitor) {
        updates.totalVisitors = FieldValue.increment(1);
      }

      if (articleId !== "home") {
        updates.totalArticleReads = FieldValue.increment(1);
      }

      tx.set(summaryRef, updates, { merge: true });
    });
  },
);
