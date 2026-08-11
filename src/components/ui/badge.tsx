import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-panel-elevated px-2.5 py-0.5 font-mono text-xs text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
