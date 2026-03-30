import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Textarea,
  Button,
  Spinner,
} from "@heroui/react";
import { getArticle, updateArticle } from "../services/articleService";
import type { Article } from "../types";

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getArticle(id).then((found) => {
      if (found) {
        setArticle(found);
        setTitle(found.title);
        setContent(found.content);
      }
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    await updateArticle(id, { title, content, updatedAt: Date.now() });
    setSaving(false);
    navigate(`/article/${id}`);
  };

  if (!article) {
    return (
      <div className="flex justify-center items-center py-24">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <Card>
        <CardHeader className="px-6 pt-6 pb-3">
          <h1 className="text-2xl font-bold text-foreground">Edit Article</h1>
        </CardHeader>
        <Divider />
        <CardBody className="px-6 py-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Title"
              variant="bordered"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title"
            />
            <Textarea
              label="Content"
              variant="bordered"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article..."
              minRows={10}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="light"
                onPress={() => navigate(`/article/${id}`)}
              >
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
