"use client";

import { useState } from "react";

const CLAMP_THRESHOLD = 300;

export default function JobDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > CLAMP_THRESHOLD;

  return (
    <div>
      <p className="text-muted-foreground font-body text-sm leading-relaxed">
        {isLong && !expanded ? text.slice(0, CLAMP_THRESHOLD) + "…" : text}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 text-accent font-body text-sm font-medium hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
