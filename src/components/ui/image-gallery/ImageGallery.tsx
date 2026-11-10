import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog/Dialog";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  src: string;
  alt: string;
}

export function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  if (images.length === 0) return null;
  const current = images[active];

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge image: ${current.alt}`}
        className="block w-full overflow-hidden rounded-xl border focus-visible:outline-2 focus-visible:outline-ring"
      >
        <img src={current.src} alt={current.alt} className="aspect-video w-full object-cover" />
      </button>

      <ul className="flex gap-2 overflow-x-auto">
        {images.map((img, i) => (
          <li key={img.src} className="shrink-0">
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "block overflow-hidden rounded-md border-2 transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                i === active ? "border-accent" : "border-transparent hover:border-border",
              )}
            >
              <img src={img.src} alt="" className="size-16 object-cover" />
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title={current.alt} size="lg">
          <img src={current.src} alt={current.alt} className="w-full rounded-lg" />
        </DialogContent>
      </Dialog>
    </div>
  );
}