import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { NebulaBackdrop } from "./NebulaBackdrop";

describe("NebulaBackdrop", () => {
  it("renders a video element with webm and mp4 sources in that order", () => {
    const { container } = render(<NebulaBackdrop />);
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    const sources = container.querySelectorAll("video source");
    expect(sources.length).toBe(2);
    expect(sources[0].getAttribute("type")).toBe("video/webm");
    expect(sources[1].getAttribute("type")).toBe("video/mp4");
  });

  it("sets the poster attribute to the still image path", () => {
    const { container } = render(<NebulaBackdrop />);
    const video = container.querySelector("video");
    expect(video?.getAttribute("poster")).toBe("/hero/nebula-backdrop-poster.jpg");
  });

  it("renders an img fallback with the poster for mobile/reduced-motion", () => {
    const { container } = render(<NebulaBackdrop />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toBe("/hero/nebula-backdrop-poster.jpg");
  });
});
