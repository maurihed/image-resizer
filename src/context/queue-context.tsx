"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addQueueItem,
  clearQueue,
  listQueue,
  removeQueueItem,
} from "@/lib/db/queue";
import type { QueueItem } from "@/types/image";

interface QueueContextValue {
  items: QueueItem[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  addItem: (item: QueueItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clear: () => Promise<void>;
}

const QueueContext = createContext<QueueContextValue | null>(null);

export function QueueProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await listQueue();
    setItems(next);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const next = await listQueue();
        if (active) setItems(next);
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const addItem = useCallback(
    async (item: QueueItem) => {
      await addQueueItem(item);
      await refresh();
    },
    [refresh],
  );

  const removeItem = useCallback(
    async (id: string) => {
      await removeQueueItem(id);
      await refresh();
    },
    [refresh],
  );

  const clear = useCallback(async () => {
    await clearQueue();
    await refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ items, isLoading, refresh, addItem, removeItem, clear }),
    [items, isLoading, refresh, addItem, removeItem, clear],
  );

  return (
    <QueueContext.Provider value={value}>{children}</QueueContext.Provider>
  );
}

export function useQueue(): QueueContextValue {
  const ctx = useContext(QueueContext);
  if (!ctx) {
    throw new Error("useQueue must be used within QueueProvider");
  }
  return ctx;
}
