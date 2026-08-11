import { JPEG_QUALITY, WEBP_QUALITY } from "@/config/presets";
import type { ExportFormat, ImageMime } from "@/types/image";

export function isImageMime(value: string): value is ImageMime {
  return (
    value === "image/jpeg" ||
    value === "image/png" ||
    value === "image/webp" ||
    value === "image/gif"
  );
}

export function resolveExportFormat(sourceMime: string): ExportFormat {
  if (sourceMime === "image/png" || sourceMime === "image/gif") {
    return { mime: "image/png", extension: "png" };
  }
  if (sourceMime === "image/webp") {
    return { mime: "image/webp", quality: WEBP_QUALITY, extension: "webp" };
  }
  return { mime: "image/jpeg", quality: JPEG_QUALITY, extension: "jpg" };
}

export function stripExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot <= 0) return filename;
  return filename.slice(0, lastDot);
}

export function buildExportFilename(
  originalName: string,
  width: number,
  height: number,
  extension: string,
): string {
  const stem = stripExtension(originalName).replace(/[^\w.-]+/g, "_") || "image";
  return `${stem}_${width}x${height}.${extension}`;
}
