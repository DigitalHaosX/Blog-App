import { useState } from "react";
import {
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { addComment } from "../services/commentService";
import { useAuthContext } from "../auth/useAuthContext";

export default function CommentForm({
  articleId,
  onCommentAdded,
}: {
  articleId: string;
  onCommentAdded?: () => void;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;
    onOpen();
  };

  const handleConfirm = async () => {
    onClose();
    setLoading(true);
    await addComment({
      articleId,
      userId: user!.uid,
      text,
      createdAt: Date.now(),
    });
    setText("");
    setLoading(false);
    onCommentAdded?.();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          className="flex-1"
          variant="bordered"
          placeholder={user ? "Add a comment…" : "Sign in to comment"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          isDisabled={!user}
        />
        <Button
          color="primary"
          type="submit"
          isLoading={loading}
          isDisabled={!user || !text.trim()}
          className="hover:scale-105 transition-transform"
        >
          Post
        </Button>
      </form>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onModalClose) => (
            <>
              <ModalHeader>Post this comment?</ModalHeader>
              <ModalBody>
                <p className="text-default-600">
                  Your comment:{" "}
                  <span className="font-semibold text-foreground">
                    "{text}"
                  </span>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onModalClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleConfirm}>
                  Post Comment
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
