import { format, parseISO } from "date-fns";
import { CheckCheck, CircleCheck, CircleDot, CirclePlus, CircleX, CreditCard, Pencil } from "lucide-react";
import type { BookingEvent } from "@/types/booking";
import { cn } from "@/lib/utils";

function iconFor(event: BookingEvent) {
  if (event.type === "created") return CirclePlus;
  if (event.type === "payment") return CreditCard;
  if (event.type === "edited") return Pencil;
  const title = event.title.toLowerCase();
  if (title.includes("cancel")) return CircleX;
  if (title.includes("complet")) return CheckCheck;
  if (title.includes("confirm")) return CircleCheck;
  return CircleDot;
}

export function BookingTimeline({ events }: { events: BookingEvent[] }) {
  const ordered = [...events].sort((a, b) => b.at.localeCompare(a.at)); // newest first

  return (
    <ol className="relative space-y-5 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-border">
      {ordered.map((event) => {
        const Icon = iconFor(event);
        const cancelled = event.title.toLowerCase().includes("cancel");
        return (
          <li key={event.id} className="relative flex gap-3">
            <span
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-surface",
                cancelled ? "text-danger" : "text-secondary-foreground",
              )}
            >
              <Icon aria-hidden className="size-4" />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm font-semibold">{event.title}</p>
              {event.detail && <p className="text-sm text-foreground-muted">{event.detail}</p>}
              <p className="text-xs text-foreground-muted">
                {event.actor} ·{" "}
                <time dateTime={event.at}>{format(parseISO(event.at), "MMM d, yyyy · h:mm a")}</time>
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}