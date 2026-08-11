"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-background hover:bg-accent-hover disabled:bg-accent/40",
  secondary:
    "bg-panel-elevated text-foreground border border-border hover:border-accent/40 disabled:opacity-50",
  ghost: "bg-transparent text-foreground hover:bg-panel-elevated disabled:opacity-50",
  danger:
    "bg-danger-muted text-danger border border-danger/30 hover:bg-danger/20 disabled:opacity-50",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

function buttonClasses(
  variant: Variant,
  size: Size,
  className?: string,
): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    className,
  );
}

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  "aria-label"?: string;
  title?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  type = "button",
  disabled,
  ...rest
}: ButtonProps) {
  const cls = buttonClasses(variant, size, className);

  if (href) {
    return (
      <Link href={href} className={cls} aria-disabled={disabled}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={cls} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
