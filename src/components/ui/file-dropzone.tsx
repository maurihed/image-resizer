"use client";

import { useFileDrop } from "@/hooks/use-file-drop";
import { cn } from "@/lib/utils/cn";
import { useId, useRef } from "react";
import { Button } from "@/components/ui/button";

interface FileDropzoneProps {
  onFiles: (files: File[]) => void | Promise<void>;
  multiple?: boolean;
  accept?: string;
  title?: string;
  description?: string;
  disabled?: boolean;
}

export function FileDropzone({
  onFiles,
  multiple = false,
  accept = "image/jpeg,image/png,image/webp,image/gif",
  title = "Drop a photo here",
  description = "JPEG, PNG, WebP, or GIF · up to 25MB",
  disabled = false,
}: FileDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const drop = useFileDrop({ accept, multiple, onFiles });

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onKeyDown={(event) => {
        if (disabled) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragEnter={disabled ? undefined : drop.onDragEnter}
      onDragOver={disabled ? undefined : drop.onDragOver}
      onDragLeave={disabled ? undefined : drop.onDragLeave}
      onDrop={disabled ? undefined : drop.onDrop}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-14 transition-colors",
        drop.isDragging
          ? "border-accent bg-accent-muted"
          : "border-border bg-panel hover:border-accent/40",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-muted text-2xl text-accent">
        ↑
      </div>
      <div className="space-y-1 text-center">
        <p className="text-base font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted">{description}</p>
      </div>
      <Button
        type="button"
        variant="secondary"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        Browse files
      </Button>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={drop.onInputChange}
      />
    </div>
  );
}
