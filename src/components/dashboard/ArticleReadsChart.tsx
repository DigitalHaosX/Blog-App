// src/components/dashboard/ArticleReadsChart.tsx
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardBody, CardHeader, Divider, Chip, Button } from "@heroui/react";

const PRESETS = [7, 14, 30, 90] as const;

interface Props {
  data: { date: string; reads: number }[];
  loading?: boolean;
  error?: boolean;
  /** Active preset days, or 0 when a custom range is active */
  rangeDays: number;
  onRangeDaysChange: (d: number) => void;
  customFrom: string;
  customTo: string;
  onCustomRangeChange: (from: string, to: string) => void;
}

function shortDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${m}/${d}`;
}

function rangeLabel(rangeDays: number, from: string, to: string): string {
  if (rangeDays > 0) return `Last ${rangeDays} Days`;
  if (from && to) return `${from} → ${to}`;
  return "Custom Range";
}

export default function ArticleReadsChart({
  data,
  loading,
  error,
  rangeDays,
  onRangeDaysChange,
  customFrom,
  customTo,
  onCustomRangeChange,
}: Props) {
  const isCustom = rangeDays === 0;

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCustomRangeChange(e.target.value, customTo);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCustomRangeChange(customFrom, e.target.value);
  };

  return (
    <Card className="bg-default-100 hover:shadow-lg transition-all duration-200">
      <CardHeader className="flex flex-col gap-3 px-6 pt-5 pb-0">
        {/* Title row */}
        <div className="flex flex-wrap items-center justify-between gap-3 w-full">
          <p className="text-base font-semibold text-foreground">
            Article Reads —{" "}
            <span className="text-default-500 font-normal">
              {rangeLabel(rangeDays, customFrom, customTo)}
            </span>
          </p>

          <div className="flex items-center gap-1 flex-wrap">
            {/* Preset buttons */}
            {PRESETS.map((d) => (
              <Button
                key={d}
                size="sm"
                variant={rangeDays === d ? "solid" : "bordered"}
                color={rangeDays === d ? "primary" : "default"}
                className="min-w-0 px-3 h-7 text-xs"
                onPress={() => onRangeDaysChange(d)}
                aria-pressed={rangeDays === d}
              >
                {d}d
              </Button>
            ))}
            {/* Custom toggle */}
            <Button
              size="sm"
              variant={isCustom ? "solid" : "bordered"}
              color={isCustom ? "primary" : "default"}
              className="min-w-0 px-3 h-7 text-xs"
              onPress={() => onRangeDaysChange(0)}
              aria-pressed={isCustom}
            >
              Custom
            </Button>

            {error && (
              <Chip color="danger" size="sm" variant="flat">
                Failed to load
              </Chip>
            )}
          </div>
        </div>

        {/* Custom date inputs */}
        {isCustom && (
          <div className="flex flex-wrap items-center gap-2 w-full pb-1">
            <label className="text-xs text-default-500 whitespace-nowrap">
              From
            </label>
            <input
              type="date"
              value={customFrom}
              onChange={handleFromChange}
              max={customTo || undefined}
              className="text-xs border border-default-300 rounded-lg px-2 py-1 bg-background text-foreground focus:outline-none focus:border-primary"
              aria-label="Start date"
            />
            <label className="text-xs text-default-500 whitespace-nowrap">
              To
            </label>
            <input
              type="date"
              value={customTo}
              onChange={handleToChange}
              min={customFrom || undefined}
              max={new Date().toISOString().slice(0, 10)}
              className="text-xs border border-default-300 rounded-lg px-2 py-1 bg-background text-foreground focus:outline-none focus:border-primary"
              aria-label="End date"
            />
          </div>
        )}
      </CardHeader>

      <Divider className="mt-3" />

      <CardBody className="px-2 py-4">
        {loading ? (
          <div className="h-48 flex items-center justify-center text-default-400 text-sm">
            Loading…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={data.map((d) => ({ ...d, date: shortDate(d.date) }))}
              margin={{ top: 4, right: 16, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="readsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--heroui-primary))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--heroui-primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--heroui-default-200))"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "hsl(var(--heroui-default-500))" }}
                axisLine={false}
                tickLine={false}
                interval={Math.max(Math.floor(data.length / 8) - 1, 0)}
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
                itemStyle={{ color: "hsl(var(--heroui-primary))" }}
              />
              <Area
                type="monotone"
                dataKey="reads"
                name="Reads"
                stroke="hsl(var(--heroui-primary))"
                strokeWidth={2}
                fill="url(#readsGradient)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
}

