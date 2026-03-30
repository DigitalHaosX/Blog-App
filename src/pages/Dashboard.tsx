// src/pages/Dashboard.tsx
import { useCallback, useEffect, useState } from "react";
import { Button, Chip, Divider, Spinner } from "@heroui/react";
import { FaEye, FaBookOpen, FaStar, FaFilePdf } from "react-icons/fa";
import { useAuthContext } from "../auth/useAuthContext";
import { OWNER_UID } from "../config/owner";
import MetricRing from "../components/dashboard/MetricRing";
import ArticleReadsChart from "../components/dashboard/ArticleReadsChart";
import RatingDistributionChart from "../components/dashboard/RatingDistributionChart";
import TopArticlesTable from "../components/dashboard/TopArticlesTable";
import {
  getAnalyticsSummary,
  getDailyReads,
  getReadsInRange,
  getRatingDistribution,
} from "../services/analyticsService";
import { getArticles } from "../services/articleService";
import { exportDashboardToPdf } from "../utils/pdfExport";
import type { Article } from "../types";

// ─── Owner guard ─────────────────────────────────────────────────────────────
function useIsOwner() {
  const { user } = useAuthContext();
  return !!user && OWNER_UID.length > 0 && user.uid === OWNER_UID;
}

export default function Dashboard() {
  const isOwner = useIsOwner();

  // ── Summary rings ──────────────────────────────────────────────────────────
  const [summary, setSummary] = useState({
    totalVisitors: 0,
    totalArticleReads: 0,
  });
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(false);

  // ── Date-range state ───────────────────────────────────────────────────────
  /** Active preset (0 = custom) */
  const [rangeDays, setRangeDays] = useState(30);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  // ── Daily reads chart ──────────────────────────────────────────────────────
  const [dailyReads, setDailyReads] = useState<
    { date: string; reads: number }[]
  >([]);
  const [readsLoading, setReadsLoading] = useState(true);
  const [readsError, setReadsError] = useState(false);

  // ── Rating distribution ────────────────────────────────────────────────────
  const [ratingDist, setRatingDist] = useState<
    { value: number; count: number }[]
  >([]);
  const [ratingLoading, setRatingLoading] = useState(true);
  const [ratingError, setRatingError] = useState(false);

  // ── Articles ───────────────────────────────────────────────────────────────
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesError, setArticlesError] = useState(false);

  // ── PDF export ─────────────────────────────────────────────────────────────
  const [isExporting, setIsExporting] = useState(false);

  // ── Fetch summary + ratings + articles once ────────────────────────────────
  useEffect(() => {
    getAnalyticsSummary()
      .then(setSummary)
      .catch(() => setSummaryError(true))
      .finally(() => setSummaryLoading(false));

    getRatingDistribution()
      .then(setRatingDist)
      .catch(() => setRatingError(true))
      .finally(() => setRatingLoading(false));

    getArticles()
      .then(setArticles)
      .catch(() => setArticlesError(true))
      .finally(() => setArticlesLoading(false));
  }, []);

  // ── Re-fetch reads whenever the range changes ──────────────────────────────
  const fetchReads = useCallback(() => {
    const isCustom = rangeDays === 0 && customFrom && customTo;
    if (rangeDays === 0 && !isCustom) return; // custom mode but dates not set yet

    setReadsLoading(true);
    setReadsError(false);

    const promise = isCustom
      ? getReadsInRange(customFrom, customTo)
      : getDailyReads(rangeDays);

    promise
      .then(setDailyReads)
      .catch(() => setReadsError(true))
      .finally(() => setReadsLoading(false));
  }, [rangeDays, customFrom, customTo]);

  useEffect(() => {
    fetchReads();
  }, [fetchReads]);

  // ── Handle range picker events ─────────────────────────────────────────────
  const handleRangeDaysChange = (d: number) => {
    setRangeDays(d);
    if (d > 0) {
      setCustomFrom("");
      setCustomTo("");
    }
  };

  const handleCustomRangeChange = (from: string, to: string) => {
    setCustomFrom(from);
    setCustomTo(to);
    setRangeDays(0);
  };

  // ── PDF export handler ─────────────────────────────────────────────────────
  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      await exportDashboardToPdf();
    } catch (err) {
      console.warn("[Dashboard] PDF export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  const topRated = articles
    .filter((a) => a.avgRating !== undefined)
    .sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0))[0];

  const top5 = articles
    .filter((a) => a.avgRating !== undefined)
    .sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0))
    .slice(0, 5);

  // ── Access guard ───────────────────────────────────────────────────────────
  if (!isOwner) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Chip color="danger" size="lg" variant="flat">
          Access restricted — owner only
        </Chip>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      id="dashboard-export"
      className="max-w-6xl mx-auto px-4 py-10 space-y-8"
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Analytics</h1>
          <p className="text-default-400 text-sm mt-1">
            Real-time metrics powered by Firestore
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Chip color="default" variant="flat" size="sm">
            {today}
          </Chip>
          <Button
            size="sm"
            color="primary"
            variant="flat"
            startContent={
              isExporting ? (
                <Spinner size="sm" color="current" />
              ) : (
                <FaFilePdf size={13} />
              )
            }
            onPress={handleExportPdf}
            isDisabled={isExporting}
            aria-label="Export dashboard as PDF"
          >
            {isExporting ? "Exporting…" : "Export PDF"}
          </Button>
        </div>
      </div>

      <Divider />

      {/* ── Metric Rings ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricRing
          value={summary.totalVisitors}
          max={Math.max(summary.totalVisitors * 1.5, 100)}
          label="Total Visitors"
          color="hsl(var(--heroui-primary))"
          icon={<FaEye />}
          loading={summaryLoading || summaryError}
        />
        <MetricRing
          value={summary.totalArticleReads}
          max={Math.max(summary.totalArticleReads * 1.5, 50)}
          label="Articles Read"
          color="hsl(var(--heroui-success))"
          icon={<FaBookOpen />}
          loading={summaryLoading || summaryError}
        />
        <MetricRing
          value={topRated?.avgRating ?? 0}
          max={5}
          label="Top Rated Article"
          sublabel={topRated?.title}
          color="hsl(var(--heroui-warning))"
          icon={<FaStar />}
          loading={articlesLoading}
        />
      </div>

      {/* ── Area Chart with date-range picker ── */}
      <ArticleReadsChart
        data={dailyReads}
        loading={readsLoading}
        error={readsError}
        rangeDays={rangeDays}
        onRangeDaysChange={handleRangeDaysChange}
        customFrom={customFrom}
        customTo={customTo}
        onCustomRangeChange={handleCustomRangeChange}
      />

      <Divider />

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RatingDistributionChart
          data={ratingDist}
          loading={ratingLoading}
          error={ratingError}
        />
        <TopArticlesTable
          articles={top5}
          loading={articlesLoading}
          error={articlesError}
        />
      </div>
    </div>
  );
}
