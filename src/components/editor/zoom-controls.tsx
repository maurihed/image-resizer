"use client";

import { IconButton } from "@/components/ui/icon-button";

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function ZoomControls({
  scale,
  onZoomIn,
  onZoomOut,
  onReset,
}: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <IconButton label="Zoom out" onClick={onZoomOut}>
        −
      </IconButton>
      <button
        type="button"
        onClick={onReset}
        className="min-w-16 rounded-lg border border-border bg-panel-elevated px-2 py-1.5 font-mono text-xs text-muted hover:text-foreground"
      >
        {Math.round(scale * 100)}%
      </button>
      <IconButton label="Zoom in" onClick={onZoomIn}>
        +
      </IconButton>
    </div>
  );
}
