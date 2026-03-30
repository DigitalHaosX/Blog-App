import { useEffect, useState, useCallback } from "react";
import { getCommentsByArticle } from "../services/commentService";
import { Card, CardBody } from "@heroui/react";
import type { Comment } from "../types";

export default function CommentList({
  articleId,
  refreshKey,
}: {
  articleId: string;
  refreshKey?: number;
}) {
  const [comments, setComments] = useState<Comment[]>([]);

  const load = useCallback(() => {
    getCommentsByArticle(articleId).then(setComments);
  }, [articleId]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  if (comments.length === 0) {
    return (
      <p className="text-default-400 text-sm">No comments yet. Be the first!</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {comments.map((c) => (
        <Card key={c.id} className="bg-default-50">
          <CardBody className="py-2 px-3">
            <p className="text-sm text-foreground">{c.text}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
