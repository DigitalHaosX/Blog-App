import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/renderWithProviders";
import ArticleCard from "./ArticleCard";
import type { Article } from "../types";

const mockArticle: Article = {
  id: "abc123",
  title: "Hello World",
  content: "This is the full content of the article that is quite long indeed.",
  authorId: "user-1",
  createdAt: new Date("2025-01-15").getTime(),
  avgRating: 4.2,
};

const shortArticle: Article = {
  id: "xyz789",
  title: "Short Post",
  content: "Brief.",
  authorId: "user-1",
  createdAt: new Date("2025-06-01").getTime(),
};

describe("ArticleCard", () => {
  it("renders the article title", () => {
    renderWithProviders(<ArticleCard article={mockArticle} />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("links the title to the article details page", () => {
    renderWithProviders(<ArticleCard article={mockArticle} />);
    const links = screen.getAllByRole("link");
    const titleLink = links.find(
      (l) => l.getAttribute("href") === "/article/abc123",
    );
    expect(titleLink).toBeTruthy();
  });

  it("renders a formatted creation date", () => {
    renderWithProviders(<ArticleCard article={mockArticle} />);
    expect(screen.getByText(/jan/i)).toBeInTheDocument();
  });

  it("renders a content preview", () => {
    renderWithProviders(<ArticleCard article={mockArticle} />);
    expect(screen.getByText(/This is the full content/i)).toBeInTheDocument();
  });

  it("renders the rating chip when avgRating is present", () => {
    renderWithProviders(<ArticleCard article={mockArticle} />);
    expect(screen.getByText(/4\.2/)).toBeInTheDocument();
  });

  it("renders 'No ratings' when there is no avgRating", () => {
    renderWithProviders(<ArticleCard article={shortArticle} />);
    expect(screen.getByText(/no ratings/i)).toBeInTheDocument();
  });

  it("renders a 'Read more' button that links to the article", () => {
    renderWithProviders(<ArticleCard article={mockArticle} />);
    const btn = screen.getByRole("button", { name: /read more/i });
    expect(btn).toBeInTheDocument();
  });
});
