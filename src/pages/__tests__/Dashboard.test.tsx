// src/pages/__tests__/Dashboard.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test/renderWithProviders";
import Dashboard from "../Dashboard";
import type { User } from "firebase/auth";

// ── Mock the owner UID env variable ──────────────────────────────────────────
vi.mock("../../config/owner", () => ({
  OWNER_UID: "owner-uid-123",
  canDelete: () => true,
}));

// ── Mock analytics service ───────────────────────────────────────────────────
vi.mock("../../services/analyticsService", () => ({
  getAnalyticsSummary: vi.fn().mockResolvedValue({
    totalVisitors: 1284,
    totalArticleReads: 537,
  }),
  getDailyReads: vi.fn().mockResolvedValue(
    Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
      reads: Math.floor(Math.random() * 20),
    })),
  ),
  getReadsInRange: vi.fn().mockResolvedValue([
    { date: "2026-03-01", reads: 5 },
    { date: "2026-03-02", reads: 8 },
  ]),
  getRatingDistribution: vi.fn().mockResolvedValue([
    { value: 1, count: 2 },
    { value: 2, count: 5 },
    { value: 3, count: 10 },
    { value: 4, count: 18 },
    { value: 5, count: 30 },
  ]),
  trackView: vi.fn().mockResolvedValue(undefined),
}));

// ── Mock article service ─────────────────────────────────────────────────────
vi.mock("../../services/articleService", () => ({
  getArticles: vi.fn().mockResolvedValue([
    {
      id: "a1",
      title: "Best Article Ever",
      avgRating: 4.9,
      authorId: "owner-uid-123",
      createdAt: Date.now(),
      content: "",
    },
    {
      id: "a2",
      title: "Second Place",
      avgRating: 4.2,
      authorId: "owner-uid-123",
      createdAt: Date.now(),
      content: "",
    },
    {
      id: "a3",
      title: "Third Place",
      avgRating: 3.7,
      authorId: "owner-uid-123",
      createdAt: Date.now(),
      content: "",
    },
  ]),
  subscribeToArticles: vi.fn(() => () => {}),
}));

// ── Mock PDF export utility ──────────────────────────────────────────────────
vi.mock("../../utils/pdfExport", () => ({
  exportDashboardToPdf: vi.fn().mockResolvedValue(undefined),
}));

// ── Mock recharts to avoid SVG rendering issues in jsdom ─────────────────────
vi.mock("recharts", () => ({
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => null,
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  defs: () => null,
  linearGradient: () => null,
  stop: () => null,
}));

// ── Helpers ──────────────────────────────────────────────────────────────────
const ownerUser = {
  uid: "owner-uid-123",
  email: "owner@blog.com",
} as Partial<User>;

const guestUser = {
  uid: "guest-uid-456",
  email: "guest@blog.com",
} as Partial<User>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Dashboard", () => {
  it("shows access-restricted message for non-owner users", () => {
    renderWithProviders(<Dashboard />, { authUser: guestUser });
    expect(screen.getByText(/access restricted/i)).toBeInTheDocument();
  });

  it("renders 'Blog Analytics' heading for the owner", async () => {
    renderWithProviders(<Dashboard />, { authUser: ownerUser });
    await waitFor(() =>
      expect(screen.getByText("Blog Analytics")).toBeInTheDocument(),
    );
  });

  it("renders all three ring labels", async () => {
    renderWithProviders(<Dashboard />, { authUser: ownerUser });
    await waitFor(() => {
      expect(screen.getByText("Total Visitors")).toBeInTheDocument();
      expect(screen.getByText("Articles Read")).toBeInTheDocument();
      expect(screen.getByText("Top Rated Article")).toBeInTheDocument();
    });
  });

  it("renders the area chart section", async () => {
    renderWithProviders(<Dashboard />, { authUser: ownerUser });
    await waitFor(() =>
      expect(screen.getByText(/article reads/i)).toBeInTheDocument(),
    );
  });

  it("renders top 5 articles table with titles", async () => {
    renderWithProviders(<Dashboard />, { authUser: ownerUser });
    await waitFor(() => {
      expect(
        screen.getAllByText("Best Article Ever").length,
      ).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders the date badge", async () => {
    renderWithProviders(<Dashboard />, { authUser: ownerUser });
    await waitFor(() => {
      // The date badge includes the current year
      expect(screen.getByText(/2026/)).toBeInTheDocument();
    });
  });
});
