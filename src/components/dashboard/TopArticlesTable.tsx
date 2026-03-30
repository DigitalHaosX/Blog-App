// src/components/dashboard/TopArticlesTable.tsx
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, Divider } from "@heroui/react";
import type { Article } from "../../types";

interface Props {
  articles: Article[];
  loading?: boolean;
  error?: boolean;
}

function StarBadge({ rating }: { rating: number }) {
  const color =
    rating >= 4.5
      ? "primary"
      : rating >= 3.5
        ? "success"
        : rating >= 2.5
          ? "warning"
          : "danger";
  return (
    <Chip color={color} size="sm" variant="flat">
      {"★".repeat(Math.round(rating))} {rating.toFixed(1)}
    </Chip>
  );
}

export default function TopArticlesTable({ articles, loading, error }: Props) {
  const navigate = useNavigate();

  return (
    <Card className="bg-default-100 hover:shadow-lg transition-all duration-200">
      <CardHeader className="flex items-center justify-between px-6 pt-5 pb-0">
        <p className="text-base font-semibold text-foreground">
          Top 5 Articles by Rating
        </p>
        {error && (
          <Chip color="danger" size="sm" variant="flat">
            Failed to load
          </Chip>
        )}
      </CardHeader>
      <Divider className="mt-3" />
      <CardBody className="px-2 py-2">
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <Spinner color="primary" size="sm" />
          </div>
        ) : (
          <Table
            aria-label="Top rated articles"
            removeWrapper
            classNames={{
              th: "bg-default-200 text-default-600 text-xs uppercase",
              tr: "cursor-pointer hover:bg-default-200 transition-colors",
            }}
          >
            <TableHeader>
              <TableColumn>#</TableColumn>
              <TableColumn>Title</TableColumn>
              <TableColumn>Rating</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No articles yet.">
              {articles.map((article, idx) => (
                <TableRow
                  key={article.id}
                  onClick={() => navigate(`/article/${article.id}`)}
                >
                  <TableCell>
                    <span className="font-bold text-default-500">
                      {idx + 1}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-foreground line-clamp-1">
                      {article.title}
                    </span>
                  </TableCell>
                  <TableCell>
                    {article.avgRating !== undefined ? (
                      <StarBadge rating={article.avgRating} />
                    ) : (
                      <span className="text-default-400 text-xs">
                        No ratings
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}
