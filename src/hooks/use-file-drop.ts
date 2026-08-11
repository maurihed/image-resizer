"use client";

import {
  useCallback,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

interface UseFileDropOptions {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void | Promise<void>;
}

export function useFileDrop({
  accept = "image/*",
  multiple = false,
  onFiles,
}: UseFileDropOptions) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    async (list: FileList | null) => {
      if (!list || list.length === 0) return;
      const files = Array.from(list);
      const selected = multiple ? files : files.slice(0, 1);
      await onFiles(selected);
    },
    [multiple, onFiles],
  );

  const onDragEnter = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    async (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      await handleFiles(event.dataTransfer.files);
    },
    [handleFiles],
  );

  const onInputChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      await handleFiles(event.target.files);
      event.target.value = "";
    },
    [handleFiles],
  );

  return {
    isDragging,
    accept,
    multiple,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    onInputChange,
  };
}
