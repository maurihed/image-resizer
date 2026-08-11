export type ImageMime = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

export type EditorMode = "default" | "custom";

export type FitMode = "cover" | "contain";

export interface Size {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface ImageTransform {
  x: number;
  y: number;
  scale: number;
}

export interface SourceImage {
  id: string;
  name: string;
  mime: ImageMime;
  width: number;
  height: number;
  blob: Blob;
  createdAt: number;
}

export interface QueueItem {
  id: string;
  sourceId: string;
  name: string;
  width: number;
  height: number;
  mime: ImageMime;
  blob: Blob;
  createdAt: number;
}

export interface Preset {
  id: string;
  label: string;
  width: number;
  height: number;
  group: "print" | "digital" | "screen";
  description?: string;
}

export interface ExportFormat {
  mime: ImageMime;
  quality?: number;
  extension: string;
}
