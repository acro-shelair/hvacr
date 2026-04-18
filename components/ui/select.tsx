"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Option = { value: string; label: string };

type SelectContextType = {
  value: string;
  onValueChange: (v: string) => void;
  registerOption: (opt: Option) => void;
  options: Option[];
};

const SelectContext = createContext<SelectContextType>({
  value: "",
  onValueChange: () => {},
  registerOption: () => {},
  options: [],
});

export function Select({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
}) {
  const [options, setOptions] = useState<Option[]>([]);

  const registerOption = (opt: Option) => {
    setOptions((prev) =>
      prev.find((o) => o.value === opt.value) ? prev : [...prev, opt]
    );
  };

  return (
    <SelectContext.Provider value={{ value, onValueChange, registerOption, options }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { value, onValueChange, options } = useContext(SelectContext);

  return (
    <div
      className={[
        "relative flex items-center gap-1.5 border border-border bg-background rounded-lg px-3 py-2 text-sm",
        className,
      ].join(" ")}
    >
      {children}
      <ChevronDown className="ml-auto w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="absolute inset-0 opacity-0 w-full cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value, options } = useContext(SelectContext);
  const label = options.find((o) => o.value === value)?.label ?? value;
  return (
    <span className={value ? "text-foreground" : "text-muted-foreground"}>
      {value ? label : placeholder}
    </span>
  );
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SelectItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const { registerOption } = useContext(SelectContext);

  useEffect(() => {
    registerOption({ value, label: String(children) });
  }, [value, children]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
