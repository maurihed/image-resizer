import type { Preset } from "@/types/image";

export const MAX_DIMENSION = 8192;
export const MIN_DIMENSION = 1;
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
export const MAX_QUEUE_ITEMS = 50;
export const JPEG_QUALITY = 0.95;
export const WEBP_QUALITY = 0.95;

export const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const PRESETS: Preset[] = [
  {
    id: "4x6-portrait",
    label: "4×6 in",
    width: 1200,
    height: 1800,
    group: "print",
    description: "Classic print · 300 DPI",
  },
  {
    id: "4x6-landscape",
    label: "4×6 in landscape",
    width: 1800,
    height: 1200,
    group: "print",
    description: "Classic print · 300 DPI",
  },
  {
    id: "5x7-portrait",
    label: "5×7 in",
    width: 1500,
    height: 2100,
    group: "print",
  },
  {
    id: "5x7-landscape",
    label: "5×7 in landscape",
    width: 2100,
    height: 1500,
    group: "print",
  },
  {
    id: "8x10-portrait",
    label: "8×10 in",
    width: 2400,
    height: 3000,
    group: "print",
  },
  {
    id: "8x10-landscape",
    label: "8×10 in landscape",
    width: 3000,
    height: 2400,
    group: "print",
  },
  {
    id: "wallet-portrait",
    label: "Wallet",
    width: 600,
    height: 900,
    group: "print",
  },
  {
    id: "wallet-landscape",
    label: "Wallet landscape",
    width: 900,
    height: 600,
    group: "print",
  },
  {
    id: "square-1080",
    label: "Square 1080",
    width: 1080,
    height: 1080,
    group: "digital",
  },
  {
    id: "square-2048",
    label: "Square 2048",
    width: 2048,
    height: 2048,
    group: "digital",
  },
  {
    id: "4-3-1600",
    label: "4:3 · 1600×1200",
    width: 1600,
    height: 1200,
    group: "digital",
  },
  {
    id: "4-3-2048",
    label: "4:3 · 2048×1536",
    width: 2048,
    height: 1536,
    group: "digital",
  },
  {
    id: "16-9-1080",
    label: "16:9 · 1920×1080",
    width: 1920,
    height: 1080,
    group: "screen",
  },
  {
    id: "16-9-4k",
    label: "16:9 · 3840×2160",
    width: 3840,
    height: 2160,
    group: "screen",
  },
];

export const DEFAULT_PRESET_ID = "4x6-portrait";

export function getPresetById(id: string): Preset | undefined {
  return PRESETS.find((preset) => preset.id === id);
}

export function swapOrientation(width: number, height: number): {
  width: number;
  height: number;
} {
  return { width: height, height: width };
}
