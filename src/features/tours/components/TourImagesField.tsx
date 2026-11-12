import { ArrowLeft, ArrowRight, ImagePlus, Star, Trash2, TriangleAlert } from "lucide-react";
import { useRef, useState } from "react";
import type { DragEvent } from "react";
import { IconButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input/Input";
import { Spinner } from "@/components/ui/spinner/Spinner";
import { fileToDataUrl } from "@/features/tours/lib/images";
import { cn } from "@/lib/utils";
import type { TourImage } from "@/types/tour";

interface TourImagesFieldProps {
  value: TourImage[];
  onChange: (images: TourImage[]) => void;
  max?: number;
}

export function TourImagesField({ value, onChange, max = 10 }: TourImagesFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const room = max - value.length;
    const files = Array.from(list).slice(0, Math.max(0, room));
    const problems: string[] = [];
    if (list.length > room) problems.push(`Only ${max} photos are allowed per tour.`);

    setBusy(true);
    const added: TourImage[] = [];
    for (const file of files) {
      try {
        added.push({ id: crypto.randomUUID(), url: await fileToDataUrl(file), caption: "" });
      } catch (e) {
        problems.push(e instanceof Error ? e.message : `Couldn't add ${file.name}.`);
      }
    }
    setBusy(false);
    setError(problems.length > 0 ? problems.join(" ") : null);
    if (added.length > 0) onChange([...value, ...added]);
  };

  const move = (from: number, to: number) => {
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    void addFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        disabled={busy || value.length >= max}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed bg-surface-muted/40 px-6 py-8 text-center transition-colors",
          "hover:border-accent focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60",
          dragging && "border-accent bg-surface-muted",
        )}
      >
        {busy ? <Spinner className="size-6" label="Processing photos" /> : <ImagePlus aria-hidden className="size-7 text-foreground-muted" />}
        <span className="text-sm font-semibold">{busy ? "Processing photos…" : "Click to add photos, or drag and drop"}</span>
        <span className="text-xs text-foreground-muted">
          JPG or PNG, up to 10 MB each · {value.length} of {max} added · the first photo is the cover
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          void addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {error && (
        <p role="alert" className="flex items-start gap-2 text-sm text-danger">
          <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}

      {value.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {value.map((image, index) => (
            <li key={image.id} className="space-y-2 rounded-lg border p-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface-muted">
                <img src={image.url} alt="" className="absolute inset-0 size-full object-cover" />
                {index === 0 && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                    <Star aria-hidden className="size-3" />
                    Cover
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  <IconButton
                    label={`Move photo ${index + 1} earlier`}
                    icon={<ArrowLeft className="size-4" />}
                    size="icon-sm"
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                  />
                  <IconButton
                    label={`Move photo ${index + 1} later`}
                    icon={<ArrowRight className="size-4" />}
                    size="icon-sm"
                    disabled={index === value.length - 1}
                    onClick={() => move(index, index + 1)}
                  />
                  {index !== 0 && (
                    <IconButton
                      label={`Make photo ${index + 1} the cover`}
                      icon={<Star className="size-4" />}
                      size="icon-sm"
                      onClick={() => move(index, 0)}
                    />
                  )}
                </div>
                <IconButton
                  label={`Remove photo ${index + 1}`}
                  icon={<Trash2 className="size-4 text-danger" />}
                  size="icon-sm"
                  onClick={() => onChange(value.filter((i) => i.id !== image.id))}
                />
              </div>
              <Input
                aria-label={`Caption for photo ${index + 1}`}
                placeholder="Caption (optional)"
                value={image.caption}
                onChange={(e) => onChange(value.map((i) => (i.id === image.id ? { ...i, caption: e.target.value } : i)))}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}