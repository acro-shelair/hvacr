"use client";

import React from "react";

type Variant = "default" | "outline" | "ghost" | "destructive";
type Size = "default" | "sm" | "lg" | "icon";

const variantClass: Record<Variant, string> = {
  default:     "bg-accent text-accent-foreground hover:bg-accent/90",
  outline:     "border border-border bg-transparent hover:bg-secondary",
  ghost:       "bg-transparent hover:bg-secondary",
  destructive: "bg-destructive text-white hover:bg-destructive/90",
};

const sizeClass: Record<Size, string> = {
  default: "px-4 py-2 text-sm",
  sm:      "px-2.5 py-1.5 text-xs",
  lg:      "px-5 py-2.5 text-base",
  icon:    "p-2",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
};

export function Button({
  variant = "default",
  size = "default",
  asChild = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
    variantClass[variant],
    sizeClass[size],
    className,
  ].join(" ");

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
      className: [classes, (children.props as { className?: string }).className ?? ""].join(" ").trim(),
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
