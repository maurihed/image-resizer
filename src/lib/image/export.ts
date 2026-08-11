import type { ImageTransform, Point, Size } from "@/types/image";
import { resolveExportFormat } from "@/lib/image/format";

export interface ExportFrameOptions {
  image: HTMLImageElement | HTMLCanvasElement;
  imageSize: Size;
  frame: Size;
  transform: ImageTransform;
  cropOffset?: Point;
  sourceMime: string;
  background?: string | null;
}

function drawExportCanvas(options: ExportFrameOptions): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(options.frame.width);
  canvas.height = Math.round(options.frame.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create canvas context for export");
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (options.background) {
    ctx.fillStyle = options.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const displayWidth = options.imageSize.width * options.transform.scale;
  const displayHeight = options.imageSize.height * options.transform.scale;

  const offsetX = options.cropOffset?.x ?? 0;
  const offsetY = options.cropOffset?.y ?? 0;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    options.image,
    options.transform.x - offsetX,
    options.transform.y - offsetY,
    displayWidth,
    displayHeight,
  );

  return canvas;
}

export async function exportFrameToBlob(
  options: ExportFrameOptions,
): Promise<{ blob: Blob; mime: string; extension: string }> {
  const format = resolveExportFormat(options.sourceMime);
  const canvas = drawExportCanvas(options);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error("Failed to encode image"));
          return;
        }
        resolve(result);
      },
      format.mime,
      format.quality,
    );
  });

  return { blob, mime: format.mime, extension: format.extension };
}
