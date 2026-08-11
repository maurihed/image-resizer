import { z } from "zod";
import { MAX_DIMENSION, MIN_DIMENSION } from "@/config/presets";

export const dimensionSchema = z.object({
  width: z
    .number({ error: "Width must be a number" })
    .int("Width must be a whole number")
    .min(MIN_DIMENSION, `Width must be at least ${MIN_DIMENSION}`)
    .max(MAX_DIMENSION, `Width must be at most ${MAX_DIMENSION}`),
  height: z
    .number({ error: "Height must be a number" })
    .int("Height must be a whole number")
    .min(MIN_DIMENSION, `Height must be at least ${MIN_DIMENSION}`)
    .max(MAX_DIMENSION, `Height must be at most ${MAX_DIMENSION}`),
});

export type DimensionInput = z.infer<typeof dimensionSchema>;

export function parseDimensionInput(
  width: string | number,
  height: string | number,
): { success: true; data: DimensionInput } | { success: false; error: string } {
  const parsed = dimensionSchema.safeParse({
    width: typeof width === "string" ? Number(width) : width,
    height: typeof height === "string" ? Number(height) : height,
  });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid dimensions",
    };
  }
  return { success: true, data: parsed.data };
}
