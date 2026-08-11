import type { SourceImage } from "@/types/image";
import { getDb } from "@/lib/db/schema";

export async function saveSource(source: SourceImage): Promise<void> {
  const db = await getDb();
  await db.put("sources", source);
}

export async function getSource(id: string): Promise<SourceImage | undefined> {
  const db = await getDb();
  return db.get("sources", id);
}

export async function listSources(): Promise<SourceImage[]> {
  const db = await getDb();
  const items = await db.getAllFromIndex("sources", "by-created");
  return items.reverse();
}

export async function deleteSource(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("sources", id);
}
