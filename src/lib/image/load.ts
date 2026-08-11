import { MAX_FILE_SIZE_BYTES, ACCEPTED_MIME_TYPES } from "@/config/presets";
import { isImageMime } from "@/lib/image/format";
import type { ImageMime, SourceImage } from "@/types/image";
import { createId } from "@/lib/utils/id";

export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageValidationError";
  }
}

export function validateImageFile(file: File): void {
  if (!ACCEPTED_MIME_TYPES.includes(file.type as (typeof ACCEPTED_MIME_TYPES)[number])) {
    throw new ImageValidationError(
      "Unsupported file type. Use JPEG, PNG, WebP, or GIF.",
    );
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new ImageValidationError("File is larger than 25MB.");
  }
}

export function loadImageElement(source: Blob | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    const url = typeof source === "string" ? source : URL.createObjectURL(source);
    const revoke = typeof source !== "string";

    image.onload = () => {
      if (revoke) URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      if (revoke) URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    image.src = url;
  });
}

export async function fileToSourceImage(file: File): Promise<SourceImage> {
  validateImageFile(file);
  if (!isImageMime(file.type)) {
    throw new ImageValidationError("Unsupported file type.");
  }
  const mime = file.type as ImageMime;
  const image = await loadImageElement(file);
  return {
    id: createId("src"),
    name: file.name || "image",
    mime,
    width: image.naturalWidth,
    height: image.naturalHeight,
    blob: file,
    createdAt: Date.now(),
  };
}
