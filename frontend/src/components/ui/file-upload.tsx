"use client";

import { useState } from "react";
import { Upload, X, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFilesChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export function FileUpload({
  onFilesChange,
  accept,
  multiple = true,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    setFiles((prev) => [...prev, ...fileArray]);
    onFilesChange?.([...files, ...fileArray]);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
        )}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileChange(e.target.files)}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm font-medium mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            {accept || "Any file type"} (Max 10MB)
          </p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Files:</p>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <FileIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
