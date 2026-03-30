import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Divider } from "@heroui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ArticleCard from "../components/ArticleCard";
import { subscribeToArticles } from "../services/articleService";
import { trackView } from "../services/analyticsService";
import { useAuth } from "../auth/useAuth";
import type { Article } from "../types";

const heroSlides = [
  {
    emoji: "✍️",
    title: "My Blog",
    subtitle: "Thoughts, tutorials and ideas worth sharing.",
  },
  {
    emoji: "💡",
    title: "Discover Ideas",
    subtitle: "Explore articles on technology, design, and creativity.",
  },
  {
    emoji: "🌍",
    title: "Join the Conversation",
    subtitle: "Comment, rate, and engage with our growing community.",
  },
];

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visible, setVisible] = useState(true);
  const fadeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      <div className="relative rounded-2xl bg-gradient-to-br from-primary/20 to-default-100 px-8 py-14 mb-10 text-center overflow-hidden group">
        {/* Prev arrow */}
        <button
          onClick={() =>
            goToSlide(
              (currentSlide - 1 + heroSlides.length) % heroSlides.length,
            )
          }
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/50 hover:bg-background/80 text-foreground transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 focus:outline-none focus:opacity-100"
        >
          <FiChevronLeft size={22} />
        </button>
        {/* Next arrow */}
        <button
          onClick={() => goToSlide((currentSlide + 1) % heroSlides.length)}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/50 hover:bg-background/80 text-foreground transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 focus:outline-none focus:opacity-100"
        >
          <FiChevronRight size={22} />
        </button>
        <div
          className={`transition-opacity duration-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-5xl mb-4">{slide.emoji}</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3">
            {slide.title}
          </h1>
          <p className="text-default-500 text-lg mb-8 max-w-xl mx-auto">
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
        <div className="flex justify-center gap-2 mt-8">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                idx === currentSlide
                  ? "bg-primary w-6"
                  : "bg-default-300 w-2 hover:bg-default-400"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Latest Articles</h2>
        <span className="text-default-400 text-sm">
          {articles.length} article{articles.length !== 1 ? "s" : ""}
        </span>
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
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
