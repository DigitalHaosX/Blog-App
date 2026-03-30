import type { Article } from "../types";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { FaStar, FaRegStar, FaTrash } from "react-icons/fa";
import { deleteArticle } from "../services/articleService";
import { useAuthContext } from "../auth/useAuthContext";
import { canDelete } from "../config/owner";

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

export default function ArticleCard({ article }: { article: Article }) {
  const [expanded, setExpanded] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuthContext();
  const isOwner = canDelete(user?.uid, article.authorId);
  const isLong = article.content.length > 250;

  const handleDelete = async () => {
    onClose();
    await deleteArticle(article.id);
  };

  return (
    <>
      <Card className="w-full bg-gradient-to-br from-primary/15 to-default-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
        <CardBody className="flex flex-row gap-6 items-start py-5 px-6">
          {/* Left: text content */}
          <div className="flex-1 min-w-0">
            <Link to={`/article/${article.id}`} className="no-underline">
              <h2 className="text-xl font-bold text-foreground hover:text-primary transition-colors line-clamp-2 mb-1">
                {article.title}
              </h2>
            </Link>
            <span className="text-xs text-default-400 mb-3 block">
              {formatDate(article.createdAt)}
            </span>
            <p
              className={`text-default-500 text-sm ${expanded ? "" : "line-clamp-3"}`}
            >
              {article.content}
            </p>
            {isLong && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="text-primary text-xs mt-2 hover:underline focus:outline-none"
              >
                {expanded ? "Show less ↑" : "Show more ↓"}
              </button>
            )}
          </div>

          {/* Right: rating + actions */}
          <div className="flex flex-col items-end justify-between gap-4 shrink-0 self-stretch">
            <div className="flex flex-col items-end gap-1">
              <StarDisplay rating={article.avgRating ?? 0} />
              <span className="text-xs text-default-400 whitespace-nowrap">
                {article.avgRating
                  ? `${article.avgRating.toFixed(1)} / 5`
                  : "No ratings"}
              </span>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Link to={`/article/${article.id}`}>
                <Button
                  color="primary"
                  variant="flat"
                  size="sm"
                  endContent={<span>→</span>}
                  className="hover:scale-105 transition-transform"
                >
                  Read more
                </Button>
              </Link>
              {isOwner && (
                <Button
                  color="danger"
                  variant="light"
                  size="sm"
                  isIconOnly
                  onPress={onOpen}
                  aria-label="Delete article"
                  className="hover:scale-105 transition-transform"
                >
                  <FaTrash size={14} />
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onModalClose) => (
            <>
              <ModalHeader>Delete article?</ModalHeader>
              <ModalBody>
                <p className="text-default-600">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-foreground">
                    "{article.title}"
                  </span>
                  ? This action cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onModalClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={handleDelete}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
