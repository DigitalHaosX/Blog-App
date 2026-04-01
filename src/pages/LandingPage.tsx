import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Divider,
} from "@heroui/react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import {
  FaFacebook,
  FaInstagram,
  FaRegStar,
  FaStar,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { subscribeToArticles } from "../services/articleService";
import { useAuth } from "../auth/useAuth";
import type { Article } from "../types";

const FAQ_ITEMS = [
  {
    question: "What is this blog about?",
    answer:
      "We cover topics across technology, design, creativity, and more. Our goal is to share ideas, tutorials, and insights worth reading.",
  },
  {
    question: "How do I write an article?",
    answer:
      "Simply sign in with your account and click 'New Article' in the navigation menu. You can write and publish your article immediately.",
  },
  {
    question: "Can I rate articles?",
    answer:
      "Yes! After reading an article, you can leave a 1–5 star rating. Your ratings help surface the best content for other readers.",
  },
  {
    question: "Are comments open to everyone?",
    answer:
      "Comments require a free account. Sign up or log in to join the conversation on any article.",
  },
  {
    question: "How do I contact the team?",
    answer:
      "You can reach us via email at hello@myblog.com or through any of our social media channels listed below.",
  },
];

const SOCIAL_LINKS = [
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: <FaInstagram size={20} />,
  },
  {
    href: "https://tiktok.com",
    label: "TikTok",
    icon: <FaTiktok size={20} />,
  },
  {
    href: "https://x.com",
    label: "X",
    icon: <FaXTwitter size={20} />,
  },
  {
    href: "https://facebook.com",
    label: "Facebook",
    icon: <FaFacebook size={20} />,
  },
  {
    href: "https://youtube.com",
    label: "YouTube",
    icon: <FaYoutube size={20} />,
  },
];

function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StarDisplay({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) =>
        star <= rounded ? (
          <FaStar key={star} className="text-warning text-sm" />
        ) : (
          <FaRegStar key={star} className="text-default-300 text-sm" />
        ),
      )}
    </div>
  );
}

export default function LandingPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const fadeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToArticles(setArticles);
    return () => unsubscribe();
  }, []);

  const featured = articles.slice(0, 5);

  const goToSlide = (idx: number) => {
    if (!featured.length) return;
    if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    setVisible(false);
    fadeTimeout.current = setTimeout(() => {
      setCarouselIndex(
        ((idx % featured.length) + featured.length) % featured.length,
      );
      setVisible(true);
    }, 350);
  };

  useEffect(() => {
    if (featured.length < 2) return;
    const interval = setInterval(() => {
      goToSlide(carouselIndex + 1);
    }, 6000);
    return () => {
      clearInterval(interval);
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    };
  }, [carouselIndex, featured.length]);

  const currentArticle: Article | undefined = featured[carouselIndex];

  return (
    <main className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/10 py-24 px-4">
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <Chip
            color="primary"
            variant="flat"
            className="mb-6 text-xs font-semibold tracking-wider uppercase"
          >
            Welcome to My Blog
          </Chip>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 leading-tight">
            Thoughts Worth <span className="text-primary">Sharing</span>
          </h1>
          <p className="text-default-500 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Explore articles on technology, design, and creativity. Written by
            passionate people, for curious minds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button
                color="primary"
                size="lg"
                variant="shadow"
                className="font-semibold px-8"
              >
                📖 Read Articles
              </Button>
            </Link>
            {user ? (
              <Link to="/create">
                <Button
                  size="lg"
                  variant="bordered"
                  className="font-semibold px-8"
                >
                  ✏️ Write an Article
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  size="lg"
                  variant="bordered"
                  className="font-semibold px-8"
                >
                  Sign In to Write
                </Button>
              </Link>
            )}
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* ── Stats Strip ── */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <Card className="bg-background/50 backdrop-blur-sm border border-default-200/50 shadow-sm">
            <CardBody className="flex flex-row flex-wrap justify-center items-center gap-12 py-8">
              {[
                {
                  label: "Articles Published",
                  value: articles.length > 0 ? `${articles.length}+` : "0",
                },
                { label: "Topics Covered", value: "10+" },
                { label: "Community Rating", value: "4.8 ★" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-3xl font-extrabold text-primary">
                    {value}
                  </p>
                  <p className="text-sm text-default-400 mt-1">{label}</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </section>

      {/* ── Featured Articles Carousel ── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Featured Articles
            </h2>
            <p className="text-default-400">
              Handpicked reads from our latest content
            </p>
          </div>

          {featured.length === 0 ? (
            <div className="text-center py-16 text-default-400">
              <p className="text-5xl mb-4">📝</p>
              <p className="text-lg font-semibold text-foreground mb-2">
                No articles yet
              </p>
              <p className="text-default-400 mb-6">
                Be the first to publish something great!
              </p>
              {user && (
                <Link to="/create">
                  <Button color="primary" variant="flat">
                    Write the first article
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="relative group">
              <div
                className={`transition-opacity duration-300 ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
              >
                {currentArticle && (
                  <Card className="bg-gradient-to-br from-primary/15 to-default-100 shadow-lg">
                    <CardBody className="p-8 md:p-10">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-default-400 mb-2 block">
                            {formatDate(currentArticle.createdAt)}
                          </span>
                          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 line-clamp-2">
                            {currentArticle.title}
                          </h3>
                          <p className="text-default-500 line-clamp-4 text-base leading-relaxed">
                            {currentArticle.content}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <StarDisplay rating={currentArticle.avgRating ?? 0} />
                          <span className="text-xs text-default-400">
                            {currentArticle.avgRating
                              ? `${currentArticle.avgRating.toFixed(1)} / 5`
                              : "No ratings yet"}
                          </span>
                        </div>
                      </div>
                    </CardBody>
                    <CardFooter className="px-8 md:px-10 pb-8 pt-0">
                      <Link to={`/article/${currentArticle.id}`}>
                        <Button
                          color="primary"
                          variant="flat"
                          endContent={<span>→</span>}
                        >
                          Read Article
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                )}
              </div>

              {featured.length > 1 && (
                <>
                  <button
                    onClick={() => goToSlide(carouselIndex - 1)}
                    aria-label="Previous article"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/70 hover:bg-background shadow-md text-foreground transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 focus:outline-none focus:opacity-100"
                  >
                    <FiChevronLeft size={22} />
                  </button>
                  <button
                    onClick={() => goToSlide(carouselIndex + 1)}
                    aria-label="Next article"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/70 hover:bg-background shadow-md text-foreground transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 focus:outline-none focus:opacity-100"
                  >
                    <FiChevronRight size={22} />
                  </button>
                </>
              )}

              {featured.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {featured.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      aria-label={`Go to article ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                        idx === carouselIndex
                          ? "bg-primary w-6"
                          : "bg-default-300 w-2 hover:bg-default-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/">
              <Button variant="bordered" endContent={<span>→</span>}>
                View All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-default-400">
              Everything you need to know about the blog
            </p>
          </div>
          <Card className="bg-background/50 backdrop-blur-sm border border-default-200/50 shadow-sm">
            <CardBody className="p-6">
              <Accordion variant="splitted" className="gap-3">
                {FAQ_ITEMS.map((item, idx) => (
                  <AccordionItem
                    key={idx}
                    title={
                      <span className="font-semibold text-foreground">
                        {item.question}
                      </span>
                    }
                    className="bg-background/70 rounded-xl shadow-sm"
                  >
                    <p className="text-default-500 pb-2 leading-relaxed">
                      {item.answer}
                    </p>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* ── Contact & Social ── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Get in Touch
            </h2>
            <p className="text-default-400">We'd love to hear from you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
            <Card className="bg-gradient-to-br from-primary/10 to-default-100">
              <CardBody className="p-8 flex flex-col gap-6">
                <h3 className="text-xl font-bold text-foreground">
                  Contact Information
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <FiMail className="text-primary shrink-0" size={20} />
                    <div>
                      <p className="text-xs text-default-400 mb-0.5">Email</p>
                      <a
                        href="mailto:hello@myblog.com"
                        className="text-foreground hover:text-primary transition-colors font-medium"
                      >
                        hello@myblog.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiMapPin className="text-primary shrink-0" size={20} />
                    <div>
                      <p className="text-xs text-default-400 mb-0.5">
                        Location
                      </p>
                      <p className="text-foreground font-medium">
                        Worldwide 🌍
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/10 to-default-100">
              <CardBody className="p-8 flex flex-col gap-6">
                <h3 className="text-xl font-bold text-foreground">Follow Us</h3>
                <p className="text-default-400 text-sm">
                  Stay up to date with our latest posts and updates across all
                  platforms.
                </p>
                <div className="flex flex-wrap gap-3">
                  {SOCIAL_LINKS.map(({ href, label, icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background hover:bg-primary/10 text-default-500 hover:text-primary transition-all duration-200 text-sm font-medium border border-default-200 hover:border-primary/30 hover:scale-105"
                    >
                      {icon}
                      <span>{label}</span>
                    </a>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          <Divider />
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-gradient-to-r from-primary/20 to-secondary/10 py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Start Reading?
          </h2>
          <p className="text-default-500 mb-8 text-lg">
            Dive into our collection of articles and join a community of curious
            minds.
          </p>
          <Link to="/">
            <Button
              color="primary"
              size="lg"
              variant="shadow"
              className="font-semibold px-10"
            >
              Explore Articles →
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
