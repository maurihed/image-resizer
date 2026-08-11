import { MAX_QUEUE_ITEMS } from "@/config/presets";
import type { QueueItem } from "@/types/image";
import { getDb } from "@/lib/db/schema";

export async function listQueue(): Promise<QueueItem[]> {
  const db = await getDb();
  const items = await db.getAllFromIndex("queue", "by-created");
  return items.reverse();
}

export async function addQueueItem(item: QueueItem): Promise<void> {
  const db = await getDb();
  const count = await db.count("queue");
  if (count >= MAX_QUEUE_ITEMS) {
    throw new Error(`Queue is full (max ${MAX_QUEUE_ITEMS} items).`);
  }
  await db.put("queue", item);
}

export async function removeQueueItem(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("queue", id);
}

export async function clearQueue(): Promise<void> {
  const db = await getDb();
  await db.clear("queue");
}
