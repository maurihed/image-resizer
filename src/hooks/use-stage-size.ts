"use client";

import { useEffect, useState, type RefObject } from "react";
import type { Size } from "@/types/image";

export function useStageSize(ref: RefObject<HTMLElement | null>): Size {
  const [size, setSize] = useState<Size>({ width: 1, height: 1 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const nextWidth = Math.max(Math.floor(rect.width), 1);
      const nextHeight = Math.max(Math.floor(rect.height), 1);
      setSize((prev) => {
        if (prev.width === nextWidth && prev.height === nextHeight) {
          return prev;
        }
        return { width: nextWidth, height: nextHeight };
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
