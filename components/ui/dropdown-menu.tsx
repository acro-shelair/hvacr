"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue>({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
});

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <div ref={containerRef} className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: React.ReactNode;
}) {
  const { open, setOpen, triggerRef } = useContext(DropdownMenuContext);

  const captureRef = (el: HTMLElement | null) => {
    (triggerRef as React.MutableRefObject<HTMLElement | null>).current = el;
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<
      React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
    >;
    return React.cloneElement(child, {
      ref: captureRef,
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        child.props.onClick?.(e);
        setOpen(!open);
      },
    });
  }

  return (
    <button ref={captureRef} onClick={() => setOpen(!open)}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  align = "start",
  className,
  children,
}: {
  align?: "start" | "end";
  className?: string;
  children: React.ReactNode;
}) {
  const { open, triggerRef } = useContext(DropdownMenuContext);
  const [coords, setCoords] = useState<{
    top: number;
    left?: number;
    right?: number;
  } | null>(null);

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + window.scrollY + 4,
      ...(align === "end"
        ? { right: window.innerWidth - rect.right }
        : { left: rect.left + window.scrollX }),
    });
  }, [open, align, triggerRef]);

  if (!open || !coords) return null;

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: coords.top,
        ...(coords.right !== undefined
          ? { right: coords.right }
          : { left: coords.left }),
      }}
      className={cn(
        "z-50 min-w-32 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
        className
      )}
    >
      {children}
    </div>,
    document.body
  );
}

export function DropdownMenuItem({
  className,
  onClick,
  children,
  onSelect: _onSelect,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  onSelect?: (e: Event) => void;
  inset?: boolean;
}) {
  const { setOpen } = useContext(DropdownMenuContext);
  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50",
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />;
}
