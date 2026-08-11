import { describe, expect, it } from "vitest";
import { parseDimensionInput } from "@/lib/validation/schemas";
import { MAX_DIMENSION, MIN_DIMENSION } from "@/config/presets";

describe("parseDimensionInput", () => {
  it("accepts valid integer dimensions", () => {
    const result = parseDimensionInput(800, 600);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.width).toBe(800);
      expect(result.data.height).toBe(600);
    }
  });

  it("rejects non-integer width", () => {
    const result = parseDimensionInput(800.5, 600);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Width");
    }
  });

  it("rejects zero", () => {
    const result = parseDimensionInput(0, 600);
    expect(result.success).toBe(false);
  });

  it("rejects negative numbers", () => {
    const result = parseDimensionInput(-1, 600);
    expect(result.success).toBe(false);
  });

  it(`rejects numbers above ${MAX_DIMENSION}`, () => {
    const result = parseDimensionInput(MAX_DIMENSION + 1, 600);
    expect(result.success).toBe(false);
  });

  it("accepts the max allowed dimension", () => {
    const result = parseDimensionInput(MAX_DIMENSION, 600);
    expect(result.success).toBe(true);
  });

  it("accepts the min allowed dimension", () => {
    const result = parseDimensionInput(MIN_DIMENSION, 600);
    expect(result.success).toBe(true);
  });

  it("converts string inputs to numbers", () => {
    const result = parseDimensionInput("1024", "768");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.width).toBe(1024);
      expect(result.data.height).toBe(768);
    }
  });

  it("rejects NaN strings", () => {
    const result = parseDimensionInput("abc", "600");
    expect(result.success).toBe(false);
  });
});
