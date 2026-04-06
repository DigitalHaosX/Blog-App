import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button, Divider, Select, SelectItem } from "@heroui/react";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import ArticleCard from "../components/ArticleCard";
import ArticleSearch from "../components/ArticleSearch";
import { subscribeToArticles } from "../services/articleService";
import { trackView } from "../services/analyticsService";
import { useAuth } from "../auth/useAuth";
import type { Article } from "../types";

const heroSlides = [
  {
    emoji: "✍️",
    title: "My Blog",
    subtitle: "Thoughts, tutorials and ideas worth sharing.",
    image: "https://picsum.photos/seed/hero-writing/1200/500",
  },
  {
    emoji: "💡",
    title: "Discover Ideas",
    subtitle: "Explore articles on technology, design, and creativity.",
    image: "https://picsum.photos/seed/hero-ideas/1200/500",
  },
  {
    emoji: "🌍",
    title: "Join the Conversation",
    subtitle: "Comment, rate, and engage with our growing community.",
    image: "https://picsum.photos/seed/hero-community/1200/500",
  },
];

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [sortKey, setSortKey] = useState("newest");
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visible, setVisible] = useState(true);
  const fadeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const featuredArticles = useMemo(() => {
    return [...articles]
      .sort(
        (a, b) =>
          (b.avgRating ?? 0) - (a.avgRating ?? 0) || b.createdAt - a.createdAt,
      )
      .slice(0, 3);
  }, [articles]);

  const sortedArticles = useMemo(() => {
    const copy = [...articles];
    switch (sortKey) {
      case "oldest":
        return copy.sort((a, b) => a.createdAt - b.createdAt);
      case "az":
        return copy.sort((a, b) => a.title.localeCompare(b.title));
      case "za":
        return copy.sort((a, b) => b.title.localeCompare(a.title));
      case "rating":
        return copy.sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0));
      default:
        return copy.sort((a, b) => b.createdAt - a.createdAt);
    }
  }, [articles, sortKey]);

  const filteredSortedArticles = useMemo(() => {
    if (!searchQuery.trim()) return sortedArticles;
    const q = searchQuery.toLowerCase();
    return sortedArticles.filter((a) => {
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
    });
  }, [sortedArticles, searchQuery]);

  useEffect(() => {
    const unsubscribe = subscribeToArticles(setArticles);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    trackView("home");
  }, []);

  const goToSlide = (idx: number) => {
    if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    setVisible(false);
    fadeTimeout.current = setTimeout(() => {
      setCurrentSlide(idx);
      setVisible(true);
    }, 400);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide((currentSlide + 1) % heroSlides.length);
    }, 5000);
    return () => {
      clearInterval(interval);
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    };
  }, [currentSlide]);

  const slide = heroSlides[currentSlide];

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      {/* Hero Carousel */}
      <div
        className="relative rounded-2xl overflow-hidden mb-10 text-center group"
        style={{ minHeight: 340 }}
      >
        {/* Background images */}
        {heroSlides.map((s, idx) => (
          <img
            key={idx}
            src={s.image}
            alt=""
            aria-hidden
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === currentSlide ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        {/* Prev arrow */}
        <button
          onClick={() =>
            goToSlide(
              (currentSlide - 1 + heroSlides.length) % heroSlides.length,
            )
          }
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition-all duration-200 hover:scale-110 focus:outline-none"
        >
          <FiChevronLeft size={22} />
        </button>
        {/* Next arrow */}
        <button
          onClick={() => goToSlide((currentSlide + 1) % heroSlides.length)}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition-all duration-200 hover:scale-110 focus:outline-none"
        >
          <FiChevronRight size={22} />
        </button>
        <div
          className={`relative z-10 px-8 py-16 transition-opacity duration-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-5xl mb-4">{slide.emoji}</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
            {slide.title}
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            {slide.subtitle}
          </p>
          {user ? (
            <Link to="/create">
              <Button color="primary" size="lg" variant="shadow">
                ✏️ Write an Article
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button color="primary" size="lg" variant="shadow">
                Sign in to write
              </Button>
            </Link>
          )}
        </div>

        {/* Dot indicators */}
        <div className="relative z-10 flex justify-center gap-2 pb-6">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                idx === currentSlide
                  ? "bg-white w-6"
                  : "bg-white/40 w-2 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Featured Article Banners */}
      {featuredArticles.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Featured Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredArticles.map((article, i) => {
              const placeholders = [
                "https://picsum.photos/seed/featured1/600/400",
                "https://picsum.photos/seed/featured2/600/400",
                "https://picsum.photos/seed/featured3/600/400",
              ];
              const imgSrc = article.imageUrl || placeholders[i];
              return (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-content1 border border-default-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative w-full h-52 overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      Featured
                    </span>
                  </div>
                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="font-bold text-foreground text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-default-400 text-xs mb-3">
                      <FiCalendar size={12} />
                      <span>
                        {new Date(article.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                    <p className="text-default-500 text-sm line-clamp-2 flex-1">
                      {article.content}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Search */}
      <ArticleSearch
        articles={articles}
        query={searchQuery}
        onQueryChange={setSearchQuery}
      />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Latest Articles</h2>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-40 h-8 rounded-lg border-2 border-default-200 bg-transparent text-sm text-foreground font-medium">
            {filteredSortedArticles.length} article
            {filteredSortedArticles.length !== 1 ? "s" : ""}
          </span>
          <Select
            aria-label="Sort articles"
            size="sm"
            variant="bordered"
            className="w-40"
            selectedKeys={[sortKey]}
            onSelectionChange={(keys) => {
              const val = Array.from(keys)[0] as string;
              if (val) setSortKey(val);
            }}
          >
            <SelectItem key="newest">Newest first</SelectItem>
            <SelectItem key="oldest">Oldest first</SelectItem>
            <SelectItem key="az">A → Z</SelectItem>
            <SelectItem key="za">Z → A</SelectItem>
            <SelectItem key="rating">Highest rated</SelectItem>
          </Select>
        </div>
      </div>
      <Divider className="mb-6" />

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📝</p>
          <p className="text-xl font-semibold text-foreground mb-2">
            No articles yet
          </p>
          <p className="text-default-400">
            Be the first to publish something great!
          </p>
        </div>
      ) : filteredSortedArticles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl font-semibold text-foreground mb-2">
            No results for "{searchQuery}"
          </p>
          <p className="text-default-400">
            Try a different title, date, or rating.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredSortedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
