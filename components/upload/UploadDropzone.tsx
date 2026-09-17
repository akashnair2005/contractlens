"use client";

import { useCallback, useRef, useState } from "react";

const ACCEPTED_EXTENSIONS = [".pdf", ".docx"];
const MAX_SIZE_BYTES = 15 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isAcceptedFile(file: File): boolean {
  const lower = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function UploadDropzone({
  onFileSelected,
  disabled,
}: {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setLocalError(null);
      if (!isAcceptedFile(file)) {
        setLocalError("Please upload a PDF or DOCX file.");
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setLocalError(`File is too large. Maximum size is ${formatBytes(MAX_SIZE_BYTES)}.`);
        return;
      }
      if (file.size === 0) {
        setLocalError("This file appears to be empty.");
        return;
      }
      setSelectedFile(file);
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile]
  );

  if (selectedFile) {
    return (
      <div className="rounded-xl border border-[var(--cl-border)] bg-white p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <FileIcon />
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--cl-navy)] truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-slate-500">
              {formatBytes(selectedFile.size)} &middot; {selectedFile.name.toLowerCase().endsWith(".pdf") ? "PDF" : "Word document"}
            </p>
          </div>
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={() => {
              setSelectedFile(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="text-sm text-slate-500 hover:text-[var(--cl-navy)] shrink-0"
          >
            Remove
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload a contract file"
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) inputRef.current?.click();
        }}
        className={`rounded-xl border-2 border-dashed p-10 sm:p-14 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-[var(--cl-accent)] bg-[var(--cl-accent-soft)]"
            : "border-slate-300 bg-white hover:border-slate-400"
        }`}
      >
        <div className="flex justify-center mb-4">
          <UploadIcon />
        </div>
        <p className="text-base font-medium text-[var(--cl-navy)]">
          Drag and drop your contract here
        </p>
        <p className="mt-1 text-sm text-slate-500">or click to browse — PDF or DOCX, up to 15MB</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
      {localError && (
        <p role="alert" className="mt-3 text-sm text-[var(--cl-high)]">
          {localError}
        </p>
      )}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect x="4" y="4" width="32" height="32" rx="8" fill="var(--cl-accent-soft)" />
      <path
        d="M20 26V15M20 15l-5 5M20 15l5 5"
        stroke="var(--cl-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 26v1a2 2 0 002 2h10a2 2 0 002-2v-1"
        stroke="var(--cl-accent)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect width="32" height="32" rx="7" fill="var(--cl-accent-soft)" />
      <path d="M11 9h7l4 4v10a1 1 0 01-1 1H11a1 1 0 01-1-1V10a1 1 0 011-1z" stroke="var(--cl-accent)" strokeWidth="1.6" />
      <path d="M18 9v4h4" stroke="var(--cl-accent)" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
