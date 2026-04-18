import React from "react";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className = "", children, ...props }: LabelProps) {
  return (
    <label
      className={["block text-sm font-medium text-foreground", className].join(" ")}
      {...props}
    >
      {children}
    </label>
  );
}
