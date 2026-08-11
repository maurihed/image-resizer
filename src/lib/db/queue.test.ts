import { afterEach, describe, expect, it } from "vitest";
import {
  addQueueItem,
  clearQueue,
  listQueue,
  removeQueueItem,
} from "@/lib/db/queue";
import { getDb } from "@/lib/db/schema";
import type { QueueItem } from "@/types/image";

function makeItem(overrides: Partial<QueueItem> = {}): QueueItem {
  return {
    id: `test_item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    sourceId: "src_1",
    name: "test.jpg",
    width: 800,
    height: 600,
    mime: "image/jpeg",
    blob: new Blob(["test"], { type: "image/jpeg" }),
    createdAt: Date.now(),
    ...overrides,
  };
}

describe("queue repository", () => {
  afterEach(async () => {
    const db = await getDb();
    await db.clear("queue");
  });

  it("adds and lists items", async () => {
    const item = makeItem();
    await addQueueItem(item);
    const items = await listQueue();
    expect(items.length).toBe(1);
    expect(items[0].id).toBe(item.id);
  });

  it("removes an item", async () => {
    const item = makeItem();
    await addQueueItem(item);
    await removeQueueItem(item.id);
    const items = await listQueue();
    expect(items.length).toBe(0);
  });

  it("clears all items", async () => {
    await addQueueItem(makeItem());
    await addQueueItem(makeItem());
    await clearQueue();
    const items = await listQueue();
    expect(items.length).toBe(0);
  });

  it("removing non-existent item does not throw", async () => {
    await expect(removeQueueItem("nonexistent")).resolves.toBeUndefined();
  });
});
