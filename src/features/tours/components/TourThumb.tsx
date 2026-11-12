import { ImageOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** Pass `key={url}` so the broken-image fallback resets when the picture changes. */
export function TourThumb({ url, className }: { url?: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn("relative shrink-0 overflow-hidden bg-surface-muted", className)}>
      {!url || failed ? (
        <div className="flex size-full items-center justify-center text-foreground-muted">
          <ImageOff aria-hidden className="size-5" />
        </div>
      ) : (
        <img
          src={url}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </div>
  );
}