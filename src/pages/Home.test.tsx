import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/renderWithProviders";
import Home from "./Home";
import type { Article } from "../types";
import type { User } from "firebase/auth";

// Mock the articleService so we don't hit Firestore
vi.mock("../services/articleService", () => ({
  subscribeToArticles: vi.fn((cb: (articles: Article[]) => void) => {
    cb([]); // default: return empty list
    return () => {}; // unsub no-op
  }),
}));

import { subscribeToArticles } from "../services/articleService";

const mockSubscribe = vi.mocked(subscribeToArticles);

describe("Home page", () => {
  beforeEach(() => {
    mockSubscribe.mockImplementation((cb) => {
      cb([]);
      return () => {};
    });
  });

  it("renders the hero title", () => {
    renderWithProviders(<Home />);
    expect(screen.getByText("My Blog")).toBeInTheDocument();
  });

  it("shows empty state when there are no articles", () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/no articles yet/i)).toBeInTheDocument();
  });

  it("shows 'Sign in to write' button for unauthenticated users", () => {
    renderWithProviders(<Home />);
    expect(
      screen.getByRole("button", { name: /sign in to write/i }),
    ).toBeInTheDocument();
  });

  it("shows 'Write an Article' button for authenticated users", () => {
    const fakeUser = { uid: "u1", email: "u@test.com" } as unknown as User;
    renderWithProviders(<Home />, { authUser: fakeUser });
    expect(
      screen.getByRole("button", { name: /write an article/i }),
    ).toBeInTheDocument();
  });

  it("renders article cards when articles are returned", () => {
    const articles: Article[] = [
      {
        id: "a1",
        title: "First Article",
        content: "Content of first article here.",
        authorId: "u1",
        createdAt: Date.now(),
      },
      {
        id: "a2",
        title: "Second Article",
        content: "Content of second article here.",
        authorId: "u1",
        createdAt: Date.now(),
      },
    ];

    mockSubscribe.mockImplementation((cb) => {
      cb(articles);
      return () => {};
    });

    renderWithProviders(<Home />);
    expect(screen.getByText("First Article")).toBeInTheDocument();
    expect(screen.getByText("Second Article")).toBeInTheDocument();
  });

  it("shows article count", () => {
    const articles: Article[] = [
      {
        id: "a1",
        title: "My Post",
        content: "Some content.",
        authorId: "u1",
        createdAt: Date.now(),
      },
    ];

    mockSubscribe.mockImplementation((cb) => {
      cb(articles);
      return () => {};
    });

    renderWithProviders(<Home />);
    expect(screen.getByText(/1 article/)).toBeInTheDocument();
  });
});
