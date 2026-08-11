"use client";

import { PRESETS } from "@/config/presets";
import { cn } from "@/lib/utils/cn";
import type { Preset } from "@/types/image";

interface PresetPickerProps {
  value: string | null;
  onChange: (preset: Preset) => void;
}

const groups: Array<{ id: Preset["group"]; label: string }> = [
  { id: "print", label: "Print album" },
  { id: "digital", label: "Digital" },
  { id: "screen", label: "Screen" },
];

export function PresetPicker({ value, onChange }: PresetPickerProps) {
  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const items = PRESETS.filter((preset) => preset.group === group.id);
        return (
          <div key={group.id} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              {group.label}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {items.map((preset) => {
                const selected = value === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onChange(preset)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left transition-colors",
                      selected
                        ? "border-accent bg-accent-muted"
                        : "border-border bg-panel-elevated hover:border-accent/40",
                    )}
                  >
                    <span className="block text-sm font-medium text-foreground">
                      {preset.label}
                    </span>
                    <span className="font-mono text-xs text-muted">
                      {preset.width}×{preset.height}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
