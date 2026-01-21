/* eslint-disable @next/next/no-img-element */
"use client";

import { ANY } from "@/types";
import clsx from "clsx";
import {
  ChangeEvent,
  ComponentProps,
  HTMLAttributes,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useFormStatus } from "react-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

export type AppInputProps = {
  icon?: React.ReactNode;
  placeholder: string;
  value?: string;
  name: string;
  type?: string;
  textarea?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  ps?: string;
  title?: string;
  rows?: number;
  error?: string[];
  onChange?: (value: string) => void;
  onErrorChange?: (hasError: boolean) => void;
  inputProps?: HTMLAttributes<HTMLInputElement> & ComponentProps<"input">;
  required?: boolean;
  variant?: "app-input" | "app-input-underline";
  defaultValue?: string;
};

export default memo(function AppInput({
  icon,
  placeholder,
  value,
  name,
  type = "text",
  onChange,
  textarea = false,
  ps,
  title,
  readonly,
  hidden,
  rows,
  error: fieldError,
  required,
  inputProps = {},
  variant = "app-input",
}: AppInputProps) {
  const isFile = type === "file";
  const isControlled = false; // value !== undefined;

  const [internalValue, setInternalValue] = useState<string>(
    value ?? (inputProps.defaultValue as string) ?? ""
  );
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [eyeOpen, setEyeOpen] = useState(false);

  const inputId = useMemo(() => `${title ?? name}-input`, [title, name]);

  // Sync external value to internal state if controlled
  useEffect(() => {
    if (!isFile && !isControlled) {
      requestAnimationFrame(() =>
        setInternalValue(value ?? (inputProps.defaultValue as string) ?? "")
      );
    }
  }, [value, isFile, isControlled, inputProps.defaultValue]);

  // Memory cleanup for image preview
  useEffect(() => {
    let url: string | null = null;
    if (selectedFile) {
      url = URL.createObjectURL(selectedFile);
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  const handleTextChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      inputProps.onChange?.(e as ChangeEvent<HTMLInputElement>);
      const newVal = e.target.value;
      if (!isControlled) setInternalValue(newVal);
      onChange?.(newVal);
    },
    [inputProps, onChange, isControlled]
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      console.log("file changed to:", e);

      inputProps.onChange?.(e);
      const file = e.target.files?.[0];
      setSelectedFile(file);
    },
    [inputProps]
  );

  const { pending } = useFormStatus();
  useEffect(() => {
    if (pending) requestAnimationFrame(() => setSelectedFile(undefined));
  }, [pending]);

  const hasFieldError = fieldError?.[0] ?? null;

  const renderPreview = selectedFile && selectedFile.type.startsWith("image/");

  return (
    <div className={clsx({ hidden })}>
      {title && (
        <label
          htmlFor={inputId}
          className={`inline-block pb-1 text-black-300 text-label ${variant === "app-input-underline"
            ? "text-brand-primary-dark font-medium"
            : ""
            }`}
        >
          {title}
          {required && <sup>*</sup>}
        </label>
      )}
      <div className="relative flex gap-1 items-start">
        {renderPreview ? (
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            className="rounded h-10 object-cover w-10 shrink-0 border border-gray-200"
          />
        ) : value && isFile ? (
          <img
            src={value}
            alt="Preview"
            className="rounded h-10 object-cover w-10 shrink-0 border border-gray-200"
          />
        ) : (
          <></>
        )}
        <div className="relative AppInput z-1 w-full">
          {icon && (
            <span
              className={clsx(
                "absolute inline-block left-3 opacity-60",
                textarea ? "top-4" : "top-1/2 -translate-y-1/2"
              )}
            >
              {icon}
            </span>
          )}

          {type === "password" && (
            <button
              type="button"
              onClick={() => setEyeOpen(!eyeOpen)}
              className={clsx(
                "absolute inline-block right-3",
                textarea ? "top-4" : "top-1/2 -translate-y-1/2"
              )}
            >
              {eyeOpen ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          )}

          {textarea ? (
            <textarea
              {...(inputProps as ANY)}
              required={required}
              id={inputId}
              name={name}
              readOnly={readonly}
              placeholder={placeholder}
              rows={rows ?? 4}
              value={isControlled ? value : internalValue}
              onChange={handleTextChange}
              className={clsx(
                variant,
                { "ps-3": !icon, "ps-9": icon },
                { "bg-red-100!": hasFieldError }
              )}
            />
          ) : (
            <input
              {...inputProps}
              required={required}
              id={inputId}
              name={name}
              type={type === "password" && eyeOpen ? "text" : type}
              placeholder={placeholder}
              readOnly={readonly}
              accept={
                inputProps.accept ?? ".mp3,.wav,.opus,.m4a,.aac,.ogg,audio/*"
              }
              multiple={inputProps.multiple ?? false}
              value={isFile ? undefined : isControlled ? value : internalValue}
              onChange={isFile ? handleFileChange : handleTextChange}
              className={clsx(
                variant,
                ps ? ps : icon ? "ps-9" : "ps-4",
                type === "password" && "pe-4",
                !type.startsWith("password") && "pe-9",
                inputProps.className,
                { "bg-red-100!": hasFieldError }
              )}
            />
          )}
        </div>
      </div>
      {hasFieldError && <p className="text-red-900 text-xs">{hasFieldError}</p>}
    </div>
  );
});
