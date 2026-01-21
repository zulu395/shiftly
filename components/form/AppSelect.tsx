"use client";

import { ReactNode, useEffect, useState } from "react";
import { AppInputProps } from "./AppInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type AppSelectOption = {
  title: ReactNode;
  value: string;
};

export type AppSelectProps = Omit<AppInputProps, "placeholder" | "variant"> & {
  options: (string | AppSelectOption)[];
  variant?: "app-select";
  placeholder?: string;
  defaultValue?: string;
};

export default function AppSelect({
  name,
  title,
  options,
  value: val,
  readonly,
  onChange,
  error: fieldError,
  variant = "app-select",
  placeholder = "Select one",
  defaultValue,
}: AppSelectProps) {
  const [value, setValue] = useState(defaultValue ?? val ?? "");
  function handleChange(value: string) {
    setValue(value);
    onChange?.(value);
  }

  useEffect(() => {
    if (!val) return;
    requestAnimationFrame(() => setValue(val));
  }, [val, options]);

  return (
    <div>
      {title && (
        <label
          htmlFor={`${title}-select`}
          className="inline-block pb-1 text-base"
        >
          {title}
        </label>
      )}
      <Select
        // onChange={(e) => onChange?.(e.target.value)}
        disabled={readonly}
        value={value}
        name={name}
        // id={`${title}-select`}
        // className={variant}
        onValueChange={handleChange}
      >
        <SelectTrigger
          size="default"
          className={cn("h-12! shadow-none text-base", variant)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          id={`${title}-select`}
          className="bg-white border-gray-100 shadow-sm"
        >
          {options.map((item, index) => {
            if (typeof item === "string")
              return (
                <SelectItem key={index} value={item}>
                  {item}
                </SelectItem>
              );
            else
              return (
                <SelectItem key={index} value={item.value}>
                  {item.title}
                </SelectItem>
              );
          })}
        </SelectContent>
      </Select>

      {fieldError && fieldError.length > 0 && (
        <p className="text-red-900 text-xs">{fieldError[0]}</p>
      )}
    </div>
  );
}
