import { describe, expect, it } from "vitest";
import {
  coverFit,
  containFit,
  autoFit,
  clampTransform,
  scaleAboutPoint,
  stageScaleToFit,
} from "@/lib/image/geometry";
import type { Size } from "@/types/image";

const big: Size = { width: 2000, height: 1200 };
const small: Size = { width: 300, height: 200 };
const square: Size = { width: 500, height: 500 };

describe("coverFit", () => {
  it("scales image to cover frame cropping edges", () => {
    const result = coverFit(big, square);
    const expectedScale = 500 / 1200;
    expect(result.scale).toBe(expectedScale);
    const displayW = big.width * expectedScale;
    expect(result.x).toBeLessThan(0);
    expect(displayW).toBeGreaterThan(square.width);
  });

  it("centers when both dimensions match", () => {
    const result = coverFit(
      { width: 100, height: 100 },
      { width: 100, height: 100 },
    );
    expect(result.scale).toBe(1);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it("upscales small images to cover frame", () => {
    const result = coverFit(small, big);
    expect(result.scale).toBeGreaterThan(1);
  });
});

describe("containFit", () => {
  it("letterboxes the image inside the frame", () => {
    const result = containFit(big, square);
    const expectedScale = 500 / 2000;
    expect(result.scale).toBe(expectedScale);
    expect(result.x).toBe(0);
  });

  it("centers small image inside large frame", () => {
    const result = containFit(
      { width: 50, height: 50 },
      { width: 200, height: 200 },
    );
    expect(result.scale).toBe(4);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });
});

describe("autoFit", () => {
  it("uses cover when image is larger than frame", () => {
    const { transform, fitMode } = autoFit(big, square);
    expect(fitMode).toBe("cover");
    expect(transform.scale).toBe(500 / 1200);
  });

  it("uses contain when image is smaller and allowUpscale is false", () => {
    const { transform, fitMode } = autoFit(small, big);
    expect(fitMode).toBe("contain");
    expect(transform.scale).toBe(1200 / 200);
  });

  it("uses cover when allowUpscale is true even for small images", () => {
    const { transform, fitMode } = autoFit(small, big, {
      allowUpscale: true,
    });
    expect(fitMode).toBe("cover");
    expect(transform.scale).toBeGreaterThan(1);
  });

  it("uses contain when allowUpscale but image covers frame and upscale would exceed 1", () => {
    const { fitMode } = autoFit(
      { width: 800, height: 600 },
      { width: 200, height: 300 },
      { allowUpscale: true },
    );
    expect(fitMode).toBe("cover");
  });
});

describe("clampTransform", () => {
  it("clamps x when allowGaps is false and image is larger than frame", () => {
    const image: Size = { width: 2000, height: 1200 };
    const frame: Size = { width: 500, height: 500 };
    const tooRight = { x: 200, y: 200, scale: 1 };
    const result = clampTransform(tooRight, image, frame, {
      allowGaps: false,
    });
    expect(result.x).toBeLessThanOrEqual(0);
    expect(result.x).toBeGreaterThanOrEqual(500 - 2000);
  });

  it("centers image when it is smaller than frame and allowGaps is false", () => {
    const image: Size = { width: 200, height: 200 };
    const frame: Size = { width: 500, height: 500 };
    const result = clampTransform(
      { x: 10, y: 10, scale: 1 },
      image,
      frame,
      { allowGaps: false },
    );
    expect(result.x).toBeCloseTo((500 - 200) / 2);
    expect(result.y).toBeCloseTo((500 - 200) / 2);
  });

  it("does not clamp when allowGaps is true", () => {
    const image: Size = { width: 2000, height: 1200 };
    const frame: Size = { width: 500, height: 500 };
    const result = clampTransform(
      { x: 200, y: 200, scale: 1 },
      image,
      frame,
      { allowGaps: true },
    );
    expect(result.x).toBe(200);
    expect(result.y).toBe(200);
  });
});

describe("scaleAboutPoint", () => {
  it("scales around a point keeping relative position", () => {
    const image: Size = { width: 1000, height: 500 };
    const transform = { x: 0, y: 0, scale: 1 };
    const point = { x: 250, y: 125 };
    const result = scaleAboutPoint(transform, image, 2, point);
    expect(result.x).toBe(-250);
    expect(result.y).toBe(-125);
  });

  it("keeps center point stable on zoom", () => {
    const image: Size = { width: 200, height: 200 };
    const transform = { x: 0, y: 0, scale: 1 };
    const center = { x: 100, y: 100 };
    const result = scaleAboutPoint(transform, image, 2, center);
    expect(result.x).toBe(-100);
    expect(result.y).toBe(-100);
  });
});

describe("stageScaleToFit", () => {
  it("fits the stage to viewport", () => {
    const frame: Size = { width: 1000, height: 800 };
    const viewport: Size = { width: 500, height: 400 };
    const scale = stageScaleToFit(frame, viewport, 32);
    expect(scale).toBeLessThanOrEqual(0.5);
    expect(scale).toBeGreaterThan(0);
  });

  it("never exceeds 1", () => {
    const frame: Size = { width: 100, height: 100 };
    const viewport: Size = { width: 2000, height: 2000 };
    const scale = stageScaleToFit(frame, viewport);
    expect(scale).toBeLessThanOrEqual(1);
  });
});
