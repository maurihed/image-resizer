import { describe, expect, it } from "vitest";
import { PRESETS, getPresetById, swapOrientation } from "@/config/presets";

describe("presets", () => {
  it("has valid entries", () => {
    expect(PRESETS.length).toBeGreaterThan(0);
    for (const preset of PRESETS) {
      expect(preset.width).toBeGreaterThan(0);
      expect(preset.height).toBeGreaterThan(0);
      expect(["print", "digital", "screen"]).toContain(preset.group);
    }
  });

  it("returns preset by id", () => {
    const found = getPresetById("4x6-portrait");
    expect(found).toBeDefined();
    expect(found?.width).toBe(1200);
    expect(found?.height).toBe(1800);
  });

  it("returns undefined for missing id", () => {
    expect(getPresetById("nonexistent")).toBeUndefined();
  });
});

describe("swapOrientation", () => {
  it("swaps width and height", () => {
    expect(swapOrientation(800, 600)).toEqual({ width: 600, height: 800 });
  });

  it("works with equal dimensions", () => {
    expect(swapOrientation(100, 100)).toEqual({ width: 100, height: 100 });
  });
});
