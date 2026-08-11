import { afterEach, describe, expect, it } from "vitest";
import { deleteSource, getSource, listSources, saveSource } from "@/lib/db/sources";
import { getDb } from "@/lib/db/schema";
import type { SourceImage } from "@/types/image";

function makeSource(overrides: Partial<SourceImage> = {}): SourceImage {
  return {
    id: `src_test_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: "test.jpg",
    mime: "image/jpeg",
    width: 1920,
    height: 1080,
    blob: new Blob(["test"], { type: "image/jpeg" }),
    createdAt: Date.now(),
    ...overrides,
  };
}

describe("sources repository", () => {
  afterEach(async () => {
    const db = await getDb();
    await db.clear("sources");
  });

  it("saves and retrieves a source", async () => {
    const source = makeSource();
    await saveSource(source);
    const found = await getSource(source.id);
    expect(found).toBeDefined();
    expect(found?.name).toBe("test.jpg");
  });

  it("returns undefined for missing source", async () => {
    const found = await getSource("nonexistent");
    expect(found).toBeUndefined();
  });

  it("lists sources newest first", async () => {
    const older = makeSource({ createdAt: 1000 });
    const newer = makeSource({ createdAt: 2000 });
    await saveSource(older);
    await saveSource(newer);
    const items = await listSources();
    expect(items.length).toBe(2);
    expect(items[0].createdAt).toBeGreaterThanOrEqual(items[1].createdAt);
  });

  it("deletes a source", async () => {
    const source = makeSource();
    await saveSource(source);
    await deleteSource(source.id);
    const found = await getSource(source.id);
    expect(found).toBeUndefined();
  });
});
