import type { FitMode, ImageTransform, Size } from "@/types/image";

export function coverFit(image: Size, frame: Size): ImageTransform {
  const scale = Math.max(frame.width / image.width, frame.height / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  return {
    scale,
    x: (frame.width - width) / 2,
    y: (frame.height - height) / 2,
  };
}

export function containFit(image: Size, frame: Size): ImageTransform {
  const scale = Math.min(frame.width / image.width, frame.height / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  return {
    scale,
    x: (frame.width - width) / 2,
    y: (frame.height - height) / 2,
  };
}

export function autoFit(
  image: Size,
  frame: Size,
  options: { allowUpscale?: boolean } = {},
): { transform: ImageTransform; fitMode: FitMode } {
  const allowUpscale = options.allowUpscale ?? false;
  const imageCoversFrame =
    image.width >= frame.width && image.height >= frame.height;

  if (imageCoversFrame || allowUpscale) {
    const cover = coverFit(image, frame);
    if (!allowUpscale && cover.scale > 1) {
      return { transform: containFit(image, frame), fitMode: "contain" };
    }
    return { transform: cover, fitMode: "cover" };
  }

  return { transform: containFit(image, frame), fitMode: "contain" };
}

export function getImageDisplaySize(image: Size, scale: number): Size {
  return {
    width: image.width * scale,
    height: image.height * scale,
  };
}

export function clampTransform(
  transform: ImageTransform,
  image: Size,
  frame: Size,
  options: { allowGaps?: boolean } = {},
): ImageTransform {
  const allowGaps = options.allowGaps ?? true;
  const display = getImageDisplaySize(image, transform.scale);
  let { x, y } = transform;

  if (!allowGaps && display.width >= frame.width) {
    const minX = frame.width - display.width;
    x = Math.min(0, Math.max(minX, x));
  } else if (!allowGaps && display.width < frame.width) {
    x = (frame.width - display.width) / 2;
  }

  if (!allowGaps && display.height >= frame.height) {
    const minY = frame.height - display.height;
    y = Math.min(0, Math.max(minY, y));
  } else if (!allowGaps && display.height < frame.height) {
    y = (frame.height - display.height) / 2;
  }

  return { ...transform, x, y };
}

export function scaleAboutPoint(
  transform: ImageTransform,
  image: Size,
  nextScale: number,
  point: { x: number; y: number },
): ImageTransform {
  const prev = getImageDisplaySize(image, transform.scale);
  const next = getImageDisplaySize(image, nextScale);
  const relX = (point.x - transform.x) / prev.width;
  const relY = (point.y - transform.y) / prev.height;
  return {
    scale: nextScale,
    x: point.x - relX * next.width,
    y: point.y - relY * next.height,
  };
}

export function stageScaleToFit(
  frame: Size,
  viewport: Size,
  padding = 32,
): number {
  const availableWidth = Math.max(viewport.width - padding * 2, 1);
  const availableHeight = Math.max(viewport.height - padding * 2, 1);
  return Math.min(availableWidth / frame.width, availableHeight / frame.height, 1);
}
