import { describe, expect, it } from "vitest";
import {
  isImageMime,
  resolveExportFormat,
  stripExtension,
  buildExportFilename,
} from "@/lib/image/format";

describe("isImageMime", () => {
  it("returns true for valid mimes", () => {
    expect(isImageMime("image/jpeg")).toBe(true);
    expect(isImageMime("image/png")).toBe(true);
    expect(isImageMime("image/webp")).toBe(true);
    expect(isImageMime("image/gif")).toBe(true);
  });

  it("returns false for invalid mimes", () => {
    expect(isImageMime("")).toBe(false);
    expect(isImageMime("image/svg+xml")).toBe(false);
    expect(isImageMime("text/plain")).toBe(false);
  });
});

describe("resolveExportFormat", () => {
  it("uses PNG for PNG sources", () => {
    const format = resolveExportFormat("image/png");
    expect(format.mime).toBe("image/png");
    expect(format.extension).toBe("png");
  });

  it("uses WebP for WebP sources", () => {
    const format = resolveExportFormat("image/webp");
    expect(format.mime).toBe("image/webp");
    expect(format.extension).toBe("webp");
    expect(format.quality).toBeGreaterThan(0);
  });

  it("uses JPEG for JPEG sources", () => {
    const format = resolveExportFormat("image/jpeg");
    expect(format.mime).toBe("image/jpeg");
    expect(format.extension).toBe("jpg");
    expect(format.quality).toBeGreaterThan(0);
  });
});

describe("stripExtension", () => {
  it("removes extension from filename", () => {
    expect(stripExtension("photo.jpg")).toBe("photo");
    expect(stripExtension("my.photo.png")).toBe("my.photo");
    expect(stripExtension("archive.tar.gz")).toBe("archive.tar");
  });

  it("returns the name unchanged when there is no extension", () => {
    expect(stripExtension("file")).toBe("file");
  });
});

describe("buildExportFilename", () => {
  it("builds a filename with dimensions and extension", () => {
    const name = buildExportFilename("photo.jpg", 800, 600, "png");
    expect(name).toBe("photo_800x600.png");
  });

  it("replaces problematic characters", () => {
    const name = buildExportFilename("my photo (1).jpeg", 100, 200, "jpg");
    expect(name).toBe("my_photo_1__100x200.jpg");
  });
});
