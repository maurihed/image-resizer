import { afterEach, describe, expect, it, vi } from "vitest";
import type { QueueItem } from "@/types/image";

const { mockSaveAs, MockJSZip, mockZipFile, mockGenerateAsync } = vi.hoisted(() => {
  const mockSaveAs = vi.fn();
  const mockZipFile = vi.fn();
  const mockGenerateAsync = vi.fn().mockResolvedValue(new Blob(["zip content"]));
  const MockJSZip = vi.fn(function (this: Record<string, unknown>) {
    this.file = mockZipFile;
    this.generateAsync = mockGenerateAsync;
  });
  return { mockSaveAs, MockJSZip, mockZipFile, mockGenerateAsync };
});

vi.mock("file-saver", () => ({
  saveAs: mockSaveAs,
}));

vi.mock("jszip", () => ({
  default: MockJSZip,
}));

import { downloadBlob, zipQueueItems } from "@/lib/zip/download";

describe("downloadBlob", () => {
  it("calls saveAs with blob and filename", () => {
    const blob = new Blob(["test"], { type: "image/jpeg" });
    downloadBlob(blob, "test.jpg");
    expect(mockSaveAs).toHaveBeenCalledWith(blob, "test.jpg");
  });
});

describe("zipQueueItems", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  function makeItem(overrides: Partial<QueueItem> = {}): QueueItem {
    return {
      id: `queue_${Math.random().toString(36).slice(2, 8)}`,
      sourceId: "src_1",
      name: "photo_800x600.jpg",
      width: 800,
      height: 600,
      mime: "image/jpeg",
      blob: new Blob(["photo data"], { type: "image/jpeg" }),
      createdAt: Date.now(),
      ...overrides,
    };
  }

  it("throws when queue is empty", async () => {
    await expect(zipQueueItems([])).rejects.toThrow("No photos");
  });

  it("downloads single item directly without zip", async () => {
    const item = makeItem();
    await zipQueueItems([item]);
    expect(mockSaveAs).toHaveBeenCalledWith(item.blob, item.name);
  });

  it("creates zip for multiple items", async () => {
    const items = [makeItem(), makeItem({ name: "photo_1024x768.png" })];
    await zipQueueItems(items);

    expect(MockJSZip).toHaveBeenCalled();
    expect(mockZipFile).toHaveBeenCalledTimes(2);
    expect(mockGenerateAsync).toHaveBeenCalledWith({ type: "blob" });
  });

  it("deduplicates filenames in the zip", async () => {
    const items = [
      makeItem({ name: "same.jpg" }),
      makeItem({ name: "same.jpg" }),
    ];
    await zipQueueItems(items);

    const calls = (mockZipFile.mock.calls as Array<[string, Blob]>).map(
      (call) => call[0],
    );
    expect(calls[0]).toBe("same.jpg");
    expect(calls[1]).toBe("same_1.jpg");
  });
});
