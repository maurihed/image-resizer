import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { QueueItem, SourceImage } from "@/types/image";

interface PhotoResizerDB extends DBSchema {
  sources: {
    key: string;
    value: SourceImage;
    indexes: { "by-created": number };
  };
  queue: {
    key: string;
    value: QueueItem;
    indexes: { "by-created": number };
  };
}

const DB_NAME = "photo-resizer";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<PhotoResizerDB>> | null = null;

export function getDb(): Promise<IDBPDatabase<PhotoResizerDB>> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB is only available in the browser"));
  }
  if (!dbPromise) {
    dbPromise = openDB<PhotoResizerDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("sources")) {
          const sources = db.createObjectStore("sources", { keyPath: "id" });
          sources.createIndex("by-created", "createdAt");
        }
        if (!db.objectStoreNames.contains("queue")) {
          const queue = db.createObjectStore("queue", { keyPath: "id" });
          queue.createIndex("by-created", "createdAt");
        }
      },
    });
  }
  return dbPromise;
}
