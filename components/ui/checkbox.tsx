"use client";

import React from "react";

type CheckboxProps = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
};

export function Checkbox({ checked, onCheckedChange, className = "", disabled }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={checked ?? false}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      disabled={disabled}
      className={[
        "h-4 w-4 rounded border-primary accent-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      ].join(" ")}
    />
  );
}
