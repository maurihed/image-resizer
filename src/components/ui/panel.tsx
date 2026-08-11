import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function Panel({ title, action, children, className, ...props }: PanelProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-panel shadow-sm",
        className,
      )}
      {...props}
    >
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          {title ? (
            <h2 className="text-sm font-semibold tracking-wide text-foreground">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}
