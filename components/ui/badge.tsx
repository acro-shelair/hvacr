import React from "react";

type Variant = "default" | "secondary" | "destructive" | "outline";

const variantClass: Record<Variant, string> = {
  default:     "bg-accent text-accent-foreground",
  secondary:   "bg-secondary text-muted-foreground",
  destructive: "bg-destructive/10 text-destructive",
  outline:     "border border-border text-foreground",
};

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant;
};

export function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium",
        variantClass[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}
