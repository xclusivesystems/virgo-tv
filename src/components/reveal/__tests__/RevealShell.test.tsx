import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RevealShell } from "../RevealShell";

describe("RevealShell", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
      matches: false, media: "", onchange: null,
      addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("renders children", () => {
    render(<RevealShell><div>page content</div></RevealShell>);
    expect(screen.getByText("page content")).toBeInTheDocument();
  });

  it("renders the reveal layer on first visit", () => {
    render(<RevealShell><div>x</div></RevealShell>);
    expect(screen.getByTestId("reveal-layer")).toBeInTheDocument();
  });

  it("skips the reveal layer when sessionStorage flag is set", () => {
    sessionStorage.setItem("virgo-reveal-seen", "true");
    render(<RevealShell><div>x</div></RevealShell>);
    expect(screen.queryByTestId("reveal-layer")).not.toBeInTheDocument();
  });

  it("skips the reveal layer when reduced-motion is preferred", () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
      matches: true, media: "", onchange: null,
      addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    render(<RevealShell><div>x</div></RevealShell>);
    expect(screen.queryByTestId("reveal-layer")).not.toBeInTheDocument();
  });

  it("defaults to cosmic concept when env is unset", () => {
    render(<RevealShell><div>x</div></RevealShell>);
    expect(screen.getByTestId("reveal-layer")).toHaveAttribute("data-concept", "cosmic");
  });
});
