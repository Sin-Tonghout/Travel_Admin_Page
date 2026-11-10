import { ImagePlus, TriangleAlert, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";
import { IconButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadItem {
  file: File;
  url: string;
}

interface FileUploadProps {
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
}

export function FileUpload({
  accept = "image/*",
  maxSizeMB = 5,
  multiple = true,
  onFilesChange,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Revoke object URLs on unmount
  useEffect(() => () => items.forEach((i) => URL.revokeObjectURL(i.url)), []); // eslint-disable-line react-hooks/exhaustive-deps

  const commit = (next: UploadItem[]) => {
    setItems(next);
    onFilesChange?.(next.map((i) => i.file));
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const valid: UploadItem[] = [];
    let message: string | null = null;

    Array.from(list).forEach((file) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        message = `${file.name} is larger than ${maxSizeMB} MB.`;
      } else if (accept === "image/*" && !file.type.startsWith("image/")) {
        message = `${file.name} is not an image.`;
      } else {
        valid.push({ file, url: URL.createObjectURL(file) });
      }
    });

    setError(message);
    commit(multiple ? [...items, ...valid] : valid.slice(0, 1));
  };

  const remove = (index: number) => {
    URL.revokeObjectURL(items[index].url);
    commit(items.filter((_, i) => i !== index));
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed bg-surface px-6 py-10 text-center transition-colors",
          "hover:border-accent focus-visible:outline-2 focus-visible:outline-ring",
          dragging && "border-accent bg-surface-muted",
        )}
      >
        <ImagePlus className="size-8 text-foreground-muted" />
        <span className="text-sm font-semibold">Click to upload or drag and drop</span>
        <span className="text-xs text-foreground-muted">Up to {maxSizeMB} MB each</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {error && (
        <p role="alert" className="flex items-center gap-2 text-sm text-danger">
          <TriangleAlert className="size-4" />
          {error}
        </p>
      )}

      {items.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((item, i) => (
            <li key={item.url} className="group relative overflow-hidden rounded-lg border">
              {item.file.type.startsWith("image/") ? (
                <img src={item.url} alt={item.file.name} className="aspect-square w-full object-cover" />
              ) : (
                <div className="flex aspect-square items-center justify-center p-2 text-xs">{item.file.name}</div>
              )}
              <div className="absolute right-1.5 top-1.5">
                <IconButton
                  label={`Remove ${item.file.name}`}
                  icon={<X className="size-4" />}
                  variant="secondary"
                  size="icon-sm"
                  onClick={() => remove(i)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}