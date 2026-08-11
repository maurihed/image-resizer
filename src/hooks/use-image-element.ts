"use client";

/* eslint-disable react-hooks/set-state-in-effect -- custom hook, DOM sync is intentional */

import { useEffect, useState } from "react";
import { loadImageElement } from "@/lib/image/load";

export function useImageElement(source: Blob | string | null | undefined) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!source) {
      setImage(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    loadImageElement(source)
      .then((img) => {
        if (!cancelled) {
          setImage(img);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setImage(null);
          setError("Failed to load image");
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [source]);

  return { image, error, isLoading };
}
