import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Spinner,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { deleteArticle } from "../services/articleService";
import { trackView } from "../services/analyticsService";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuthContext } from "../auth/useAuthContext";
import { canDelete } from "../config/owner";
import { FaTrash } from "react-icons/fa";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import RatingStars from "../components/RatingStars";
import type { Article } from "../types";

export default function ArticleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentKey, setCommentKey] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isOwner = canDelete(user?.uid, article?.authorId ?? "");

  const handleDelete = async () => {
    if (!id) return;
    onClose();
    await deleteArticle(id);
    navigate("/");
  };

  useEffect(() => {
    if (!id) return;
    trackView(id);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    // Real-time listener so avgRating updates instantly after rating
    const unsub = onSnapshot(doc(db, "articles", id), (snap) => {
      if (snap.exists()) {
        setArticle({ id: snap.id, ...snap.data() } as Article);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  if (!article) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <p className="text-default-500">Article not found.</p>
        <Link to="/">
          <Button variant="light" color="primary" className="mt-4">
            ← Back to Home
          </Button>
        </Link>
      </main>
    );
  }

  const formattedDate = new Date(article.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <>
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <Link to="/">
          <Button variant="light" size="sm" color="primary" className="mb-4">
            ← Back to Home
          </Button>
        </Link>

        <Card className="mb-6">
          <CardHeader className="flex flex-col items-start gap-3 px-6 pt-6 pb-4">
            <div className="flex items-start justify-between w-full gap-4">
              <h1 className="text-3xl font-bold text-foreground leading-tight">
                {article.title}
              </h1>
              {isOwner && (
                <Button
                  color="danger"
                  variant="light"
                  size="sm"
                  isIconOnly
                  onPress={onOpen}
                  aria-label="Delete article"
                  className="shrink-0 hover:scale-105 transition-transform mt-1"
                >
                  <FaTrash size={15} />
                </Button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Chip variant="flat" size="sm" color="default">
                📅 {formattedDate}
              </Chip>
              {article.avgRating && (
                <Chip color="warning" variant="flat" size="sm">
                  ⭐ {article.avgRating}/5
                </Chip>
              )}
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="px-6 py-6">
            <p className="text-foreground whitespace-pre-wrap leading-relaxed text-base">
              {article.content}
            </p>
          </CardBody>
        </Card>

        <Card className="mb-6">
          <CardBody className="px-6 py-4 flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-foreground">
              Rate this article
            </h2>
            <RatingStars articleId={id!} />
          </CardBody>
        </Card>

        <Card>
          <CardBody className="px-6 py-4 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-foreground">Comments</h2>
            <CommentForm
              articleId={id!}
              onCommentAdded={() => setCommentKey((k) => k + 1)}
            />
            <CommentList articleId={id!} refreshKey={commentKey} />
          </CardBody>
        </Card>
      </main>

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
