// src/components/dashboard/MetricRing.tsx
import { useEffect, useState, useRef } from "react";
import { Card, Spinner } from "@heroui/react";

interface MetricRingProps {
  value: number;
  max: number;
  label: string;
  sublabel?: string;
  color: string; // e.g. "hsl(var(--heroui-primary))"
  icon: React.ReactNode;
  loading?: boolean;
}

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SIZE = 128; // viewBox = "0 0 128 128"

function useCountUp(target: number, duration = 1200): number {
  const [count, setCount] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef<number | null>(null);
  const from = useRef(0);

  useEffect(() => {
    from.current = 0;
    start.current = null;

    const step = (ts: number) => {
      if (start.current === null) start.current = ts;
      const elapsed = ts - start.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(from.current + (target - from.current) * eased));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };

    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [target, duration]);

  return count;
}

export default function MetricRing({
  value,
  max,
  label,
  sublabel,
  color,
  icon,
  loading = false,
}: MetricRingProps) {
  const [animatedOffset, setAnimatedOffset] = useState(CIRCUMFERENCE);
  const displayValue = useCountUp(loading ? 0 : value);

  useEffect(() => {
    if (loading) {
      setAnimatedOffset(CIRCUMFERENCE);
      return;
    }
    // Tiny delay so the CSS transition fires after mount
    const t = setTimeout(() => {
      const fraction = Math.min(value / max, 1);
      setAnimatedOffset(CIRCUMFERENCE * (1 - fraction));
    }, 80);
    return () => clearTimeout(t);
  }, [value, max, loading]);

  return (
    <Card className="bg-default-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col items-center p-6 gap-3 min-w-[180px]">
      <div className="relative">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-label={`${label}: ${value}`}
          role="img"
        >
          {/* Background track */}
          <circle
            cx="64"
            cy="64"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-default-200"
          />
          {/* Animated fill */}
          {!loading && (
            <circle
              cx="64"
              cy="64"
              r={RADIUS}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={animatedOffset}
              style={{
                transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              transform="rotate(-90 64 64)"
            />
          )}
          {/* Centre icon */}
          <foreignObject x="44" y="44" width="40" height="40">
            <div
              className="flex items-center justify-center w-full h-full text-foreground"
              style={{ color }}
            >
              {loading ? (
                <Spinner color="primary" size="sm" />
              ) : (
                <span style={{ fontSize: 22 }}>{icon}</span>
              )}
            </div>
          </foreignObject>
        </svg>
      </div>

      {/* Numeric value */}
      <p
        className="text-3xl font-bold text-foreground tabular-nums"
        aria-live="polite"
      >
        {loading ? "—" : displayValue.toLocaleString()}
      </p>

      {/* Label */}
      <p className="text-sm font-semibold text-default-600 text-center">
        {label}
      </p>

      {/* Optional sublabel (e.g. article title) */}
      {sublabel && (
        <p className="text-xs text-default-400 text-center line-clamp-2">
          {sublabel}
        </p>
      )}
    </Card>
  );
}
