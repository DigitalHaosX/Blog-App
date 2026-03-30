// src/services/__tests__/analyticsService.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Firebase ─────────────────────────────────────────────────────────────
vi.mock("../firebase", () => ({ db: {} }));

const mockAddDoc = vi.fn().mockResolvedValue({});
const mockGetDoc = vi.fn();
const mockGetDocs = vi.fn();
const mockCollection = vi.fn((_db: unknown, name: string) => ({ __col: name }));
const mockDoc = vi.fn((_db: unknown, ...segs: string[]) => ({
  __doc: segs.join("/"),
}));
const mockQuery = vi.fn((...args: unknown[]) => args[0]);
const mockWhere = vi.fn();
const mockOrderBy = vi.fn();

vi.mock("firebase/firestore", () => ({
  collection: (...args: unknown[]) => mockCollection(...args),
  doc: (...args: unknown[]) => mockDoc(...args),
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  query: (...args: unknown[]) => mockQuery(...args),
  where: (...args: unknown[]) => mockWhere(...args),
  orderBy: (...args: unknown[]) => mockOrderBy(...args),
}));

// Stub sessionStorage
Object.defineProperty(global, "sessionStorage", {
  value: {
    _store: {} as Record<string, string>,
    getItem(key: string) {
      return this._store[key] ?? null;
    },
    setItem(key: string, val: string) {
      this._store[key] = val;
    },
  },
  writable: true,
});

// Stub crypto.randomUUID
Object.defineProperty(global, "crypto", {
  value: { randomUUID: () => "test-uuid-1234" },
  writable: true,
});

import {
  trackView,
  getAnalyticsSummary,
  getDailyReads,
  getReadsInRange,
  getRatingDistribution,
} from "../analyticsService";

beforeEach(() => {
  vi.clearAllMocks();
  (sessionStorage as { _store: Record<string, string> })._store = {};
});

// ─── trackView ────────────────────────────────────────────────────────────────
describe("trackView", () => {
  it("writes a pageViews document", async () => {
    await trackView("home");
    expect(mockAddDoc).toHaveBeenCalledTimes(1);
  });

  it("only writes to pageViews — no counter manipulation on the client", async () => {
    await trackView("article-abc");
    // addDoc called once for the event
    expect(mockAddDoc).toHaveBeenCalledTimes(1);
    // no summary reads or writes
    expect(mockGetDoc).not.toHaveBeenCalled();
  });

  it("includes the articleId in the pageViews document", async () => {
    await trackView("my-article-id");
    const payload = mockAddDoc.mock.calls[0][1];
    expect(payload.articleId).toBe("my-article-id");
  });

  it("includes a sessionId in the pageViews document", async () => {
    await trackView("home");
    const payload = mockAddDoc.mock.calls[0][1];
    expect(typeof payload.sessionId).toBe("string");
    expect(payload.sessionId.length).toBeGreaterThan(0);
  });

  it("does NOT throw on Firestore error (non-fatal)", async () => {
    mockAddDoc.mockRejectedValueOnce(new Error("network error"));
    await expect(trackView("home")).resolves.toBeUndefined();
  });
});

// ─── getAnalyticsSummary ─────────────────────────────────────────────────────
describe("getAnalyticsSummary", () => {
  it("returns zeroes when doc does not exist", async () => {
    mockGetDoc.mockResolvedValueOnce({ exists: () => false });
    const result = await getAnalyticsSummary();
    expect(result).toEqual({ totalVisitors: 0, totalArticleReads: 0 });
  });

  it("returns values from Firestore", async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ totalVisitors: 42, totalArticleReads: 17 }),
    });
    const result = await getAnalyticsSummary();
    expect(result.totalVisitors).toBe(42);
    expect(result.totalArticleReads).toBe(17);
  });
});

// ─── getDailyReads ────────────────────────────────────────────────────────────
describe("getDailyReads", () => {
  it("returns an array with the requested number of days", async () => {
    mockGetDocs.mockResolvedValueOnce({ docs: [] });
    const result = await getDailyReads(7);
    expect(result).toHaveLength(7);
  });

  it("aggregates reads by date, excluding home views", async () => {
    const today = new Date().toISOString().slice(0, 10);
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        { data: () => ({ timestamp: Date.now(), articleId: "a1" }) },
        { data: () => ({ timestamp: Date.now(), articleId: "a2" }) },
        { data: () => ({ timestamp: Date.now(), articleId: "home" }) }, // excluded
      ],
    });
    const result = await getDailyReads(1);
    expect(result[0].date).toBe(today);
    expect(result[0].reads).toBe(2); // home view NOT counted
  });
});

// ─── getReadsInRange ──────────────────────────────────────────────────────────
describe("getReadsInRange", () => {
  it("returns entries for every date in the range", async () => {
    mockGetDocs.mockResolvedValueOnce({ docs: [] });
    const result = await getReadsInRange("2026-01-01", "2026-01-03");
    expect(result.map((r) => r.date)).toEqual([
      "2026-01-01",
      "2026-01-02",
      "2026-01-03",
    ]);
  });

  it("counts reads within the range", async () => {
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        {
          data: () => ({
            timestamp: new Date("2026-01-02T10:00:00").getTime(),
            articleId: "a1",
          }),
        },
        {
          data: () => ({
            timestamp: new Date("2026-01-02T15:00:00").getTime(),
            articleId: "a2",
          }),
        },
      ],
    });
    const result = await getReadsInRange("2026-01-01", "2026-01-03");
    expect(result.find((r) => r.date === "2026-01-02")?.reads).toBe(2);
    expect(result.find((r) => r.date === "2026-01-01")?.reads).toBe(0);
  });

  it("excludes home views", async () => {
    mockGetDocs.mockResolvedValueOnce({
      docs: [{ data: () => ({ timestamp: Date.now(), articleId: "home" }) }],
    });
    const today = new Date().toISOString().slice(0, 10);
    const result = await getReadsInRange(today, today);
    expect(result[0].reads).toBe(0);
  });
});

// ─── getRatingDistribution ────────────────────────────────────────────────────
describe("getRatingDistribution", () => {
  it("returns entries for values 1–5", async () => {
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        { data: () => ({ value: 5 }) },
        { data: () => ({ value: 5 }) },
        { data: () => ({ value: 3 }) },
      ],
    });
    const result = await getRatingDistribution();
    expect(result).toHaveLength(5);
    const star5 = result.find((r) => r.value === 5)!;
    expect(star5.count).toBe(2);
    const star3 = result.find((r) => r.value === 3)!;
    expect(star3.count).toBe(1);
    const star1 = result.find((r) => r.value === 1)!;
    expect(star1.count).toBe(0);
  });
});
