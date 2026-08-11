"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useQueue } from "@/context/queue-context";
import { cn } from "@/lib/utils/cn";

const nav = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload" },
  { href: "/queue", label: "Queue" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { items } = useQueue();

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent text-sm text-background">
              IR
            </span>
            <span className="hidden sm:inline">Image Resizer</span>
          </Link>
          <nav className="flex items-center gap-1">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-accent-muted text-accent"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                  {item.href === "/queue" && items.length > 0 ? (
                    <span className="ml-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-background">
                      {items.length}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}
