// src/components/dashboard/__tests__/MetricRing.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroUIProvider } from "@heroui/react";
import MetricRing from "../MetricRing";

// requestAnimationFrame stub — advances time by 1300ms each call so the
// count-up animation reaches progress >= 1 and stops after 2 frames.
let rafTime = 0;
global.requestAnimationFrame = (cb) => {
  rafTime += 1300;
  cb(rafTime);
  return 0;
};
global.cancelAnimationFrame = vi.fn();

function renderRing(props: Partial<Parameters<typeof MetricRing>[0]> = {}) {
  const defaults = {
    value: 1000,
    max: 2000,
    label: "Total Visitors",
    color: "hsl(var(--heroui-primary))",
    icon: <span data-testid="icon">👁</span>,
    loading: false,
  };
  return render(
    <HeroUIProvider>
      <MetricRing {...defaults} {...props} />
    </HeroUIProvider>,
  );
}

describe("MetricRing", () => {
  it("renders the label", () => {
    renderRing();
    expect(screen.getByText("Total Visitors")).toBeInTheDocument();
  });

  it("renders an SVG ring with correct aria-label", () => {
    renderRing({ value: 500, label: "Articles Read" });
    const svg = screen.getByRole("img");
    expect(svg.getAttribute("aria-label")).toBe("Articles Read: 500");
  });

  it("shows '—' for the value when loading", () => {
    renderRing({ loading: true });
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("does NOT show '—' when not loading", () => {
    renderRing({ loading: false, value: 42 });
    expect(screen.queryByText("—")).not.toBeInTheDocument();
  });

  it("renders the sublabel when provided", () => {
    renderRing({ sublabel: "My Great Article" });
    expect(screen.getByText("My Great Article")).toBeInTheDocument();
  });

  it("does not render sublabel when not provided", () => {
    renderRing({ sublabel: undefined });
    expect(screen.queryByText("My Great Article")).not.toBeInTheDocument();
  });

  it("renders the icon slot", () => {
    renderRing();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders the animated SVG circle when not loading", () => {
    const { container } = renderRing({
      loading: false,
      value: 1000,
      max: 2000,
    });
    const circles = container.querySelectorAll("circle");
    // background track + animated fill = 2 circles
    expect(circles.length).toBeGreaterThanOrEqual(2);
  });

  it("omits animated SVG circle when loading", () => {
    const { container } = renderRing({ loading: true });
    // Only background track circle present when loading
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBe(1);
  });
});
