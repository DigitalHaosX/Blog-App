import { useMemo, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import type { Article } from "../types";

interface Props {
  articles: Article[];
  query: string;
  onQueryChange: (q: string) => void;
}

export default function ArticleSearch({
  articles,
  query,
  onQueryChange,
}: Props) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return articles
      .filter((a) => {
        const date = new Date(a.createdAt).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        const rating = a.avgRating != null ? a.avgRating.toFixed(1) : "";
        return (
          a.title.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          date.includes(q) ||
          rating.includes(q)
        );
      })
      .slice(0, 6);
  }, [articles, query]);

  return (
    <div className="relative mb-8">
      <div className="relative">
        <FiSearch
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-default-400 pointer-events-none"
          size={18}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            onQueryChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Search…"
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-default-200 bg-content1 text-foreground placeholder:text-default-400 focus:outline-none focus:border-primary transition-colors text-sm"
        />
        {query && (
          <button
            onClick={() => {
              onQueryChange("");
              setShowSuggestions(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-default-400 hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <FiX size={16} />
          </button>
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-30 w-full mt-1 bg-content1 border border-default-200 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((article) => (
            <li key={article.id}>
              <button
                className="w-full text-left px-4 py-3 hover:bg-default-100 transition-colors flex items-center gap-3"
                onMouseDown={() => {
                  onQueryChange(article.title);
                  setShowSuggestions(false);
                }}
              >
                <FiSearch size={14} className="text-default-400 shrink-0" />
                <span className="text-sm text-foreground line-clamp-1">
                  {article.title}
                </span>
                {article.avgRating != null && (
                  <span className="ml-auto text-xs text-default-400 shrink-0">
                    ★ {article.avgRating.toFixed(1)}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
