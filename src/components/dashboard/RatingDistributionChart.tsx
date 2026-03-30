// src/components/dashboard/RatingDistributionChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";

interface Props {
  data: { value: number; count: number }[];
  loading?: boolean;
  error?: boolean;
}

// Map star rating → HeroUI CSS variable color
const COLORS: Record<number, string> = {
  1: "hsl(var(--heroui-danger))",
  2: "hsl(var(--heroui-warning))",
  3: "hsl(var(--heroui-default-400))",
  4: "hsl(var(--heroui-success))",
  5: "hsl(var(--heroui-primary))",
};

export default function RatingDistributionChart({
  data,
  loading,
  error,
}: Props) {
  return (
    <Card className="bg-default-100 hover:shadow-lg transition-all duration-200">
      <CardHeader className="flex items-center justify-between px-6 pt-5 pb-0">
        <p className="text-base font-semibold text-foreground">
          Rating Distribution
        </p>
        {error && (
          <Chip color="danger" size="sm" variant="flat">
            Failed to load
          </Chip>
        )}
      </CardHeader>
      <Divider className="mt-3" />
      <CardBody className="px-2 py-4">
        {loading ? (
          <div className="h-48 flex items-center justify-center text-default-400 text-sm">
            Loading…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={data.map((d) => ({
                ...d,
                label: `${"★".repeat(d.value)}`,
              }))}
              margin={{ top: 4, right: 16, left: -16, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--heroui-default-200))"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 13, fill: "hsl(var(--heroui-default-500))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "hsl(var(--heroui-default-500))" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--heroui-default-100))",
                  border: "1px solid hsl(var(--heroui-default-200))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "hsl(var(--heroui-foreground))" }}
                cursor={{
                  fill: "hsl(var(--heroui-default-200))",
                  opacity: 0.4,
                }}
                formatter={(v) => [v as number, "Ratings"]}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.value} fill={COLORS[entry.value]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
}
