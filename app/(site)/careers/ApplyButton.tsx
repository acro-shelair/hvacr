"use client";

import { useState, type ReactNode } from "react";
import ApplyForm from "./ApplyForm";

type Props = {
  jobPostingId?: string | null;
  position?: string;
  className?: string;
  children: ReactNode;
};

export default function ApplyButton({
  jobPostingId,
  position,
  className,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        {children}
      </button>
      <ApplyForm
        open={open}
        onClose={() => setOpen(false)}
        jobPostingId={jobPostingId ?? null}
        defaultPosition={position}
      />
    </>
  );
}
