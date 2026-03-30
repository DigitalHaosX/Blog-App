import { useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Textarea,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { createArticle } from "../services/articleService";
import { useAuthContext } from "../auth/useAuthContext";

export default function ArticleForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<{ title?: string; content?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; content?: string } = {};
    if (!title.trim()) newErrors.title = "Title cannot be empty";
    if (!content.trim()) newErrors.content = "Content cannot be empty";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onOpen();
  };

  const handleConfirm = async () => {
    onClose();
    setLoading(true);
    await createArticle({
      title,
      content,
      authorId: user?.uid ?? "",
      createdAt: Date.now(),
    });
    setTitle("");
    setContent("");
    setLoading(false);
  };

  return (
    <>
      <Card className="w-full">
        <CardBody className="gap-4">
          <h2 className="text-2xl font-semibold">✍️ Write a New Article</h2>

          <form onSubmit={handleValidate} className="flex flex-col gap-4">
            <Input
              label="Title"
              placeholder="Enter a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={!!errors.title}
              errorMessage={errors.title}
            />

            <Textarea
              label="Content"
              placeholder="Start writing your article here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              isInvalid={!!errors.content}
              errorMessage={errors.content}
              minRows={8}
            />

            <Button
              color="primary"
              type="submit"
              isLoading={loading}
              className="self-end hover:scale-105 transition-transform"
            >
              🚀 Publish
            </Button>
          </form>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onModalClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Ready to publish?
              </ModalHeader>
              <ModalBody>
                <p className="text-default-600">
                  You're about to publish{" "}
                  <span className="font-semibold text-foreground">
                    "{title}"
                  </span>
                  . This will be visible to all readers.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onModalClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleConfirm}>
                  🚀 Publish
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
