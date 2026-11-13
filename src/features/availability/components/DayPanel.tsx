import { format, parseISO } from "date-fns";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input/Input";
import { Label } from "@/components/ui/label/Label";
import { Switch } from "@/components/ui/switch/Switch";
import { BookingStatusBadge } from "@/features/bookings/components/BookingStatusBadge";
import type { DayAvailability, DayAvailabilityInput } from "@/types/availability";

interface Props {
  day: DayAvailability;
  saving: boolean;
  resetting: boolean;
  onSave: (input: DayAvailabilityInput) => void;
  onReset: () => void;
}

export function DayPanel({ day, saving, resetting, onSave, onReset }: Props) {
  const isPast = day.date < format(new Date(), "yyyy-MM-dd");
  const [blocked, setBlocked] = useState(day.blocked);
  const [capacity, setCapacity] = useState(String(day.capacity));
  const [note, setNote] = useState(day.note);
  const [error, setError] = useState("");

  const pct = Math.min(100, Math.round((day.booked / day.capacity) * 100));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(capacity);
    if (!Number.isInteger(value) || value < 1 || value > 500) {
      setError("Enter a whole number between 1 and 500.");
      return;
    }
    if (value < day.booked) {
      setError(`${day.booked} seats are already booked, so the capacity can't go below that.`);
      return;
    }
    setError("");
    onSave({ blocked, capacity: value, note });
  };

  return (
    <section className="space-y-5 rounded-xl border border-border bg-surface p-5">
      <div>
        <h2 className="text-base font-semibold">{format(parseISO(day.date), "EEEE, MMMM d, yyyy")}</h2>
        <p className="text-sm text-foreground-muted">
          {day.blocked ? "Blocked for new bookings." : `${day.booked} of ${day.capacity} seats booked.`}
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-border" aria-hidden>
          <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Bookings on this date</h3>
        {day.bookings.length === 0 ? (
          <p className="text-sm text-foreground-muted">No bookings yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {day.bookings.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <div className="min-w-0">
                  <Link to={`/admin/bookings/${b.id}`} className="font-medium text-primary hover:underline">
                    {b.id}
                  </Link>
                  <p className="truncate text-xs text-foreground-muted">
                    {b.customer} · {b.travelers} {b.travelers === 1 ? "traveler" : "travelers"}
                  </p>
                </div>
                <BookingStatusBadge status={b.status} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {isPast ? (
        <p className="rounded-lg bg-surface-muted p-3 text-sm text-foreground-muted">Past dates can't be edited.</p>
      ) : (
        <form onSubmit={handleSave} noValidate className="space-y-4 border-t border-border pt-4">
          <h3 className="text-sm font-semibold">Settings for this date</h3>

          <label className="flex items-center justify-between gap-4 text-sm">
            <span>
              Block this date
              <span className="block text-xs text-foreground-muted">New bookings are refused. Existing ones stay.</span>
            </span>
            <Switch checked={blocked} onCheckedChange={setBlocked} aria-label="Block this date" />
          </label>

          <div>
            <Label htmlFor="day-capacity">Seats</Label>
            <Input
              id="day-capacity"
              inputMode="numeric"
              value={capacity}
              disabled={blocked}
              onChange={(e) => setCapacity(e.target.value)}
              aria-invalid={!!error}
              aria-describedby={error ? "day-capacity-error" : undefined}
            />
            <p className="mt-1 text-xs text-foreground-muted">Default for this tour: {day.defaultCapacity}.</p>
            {error && (
              <p id="day-capacity-error" role="alert" className="mt-1 text-xs text-danger">
                {error}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="day-note">Note (optional)</Label>
            <Input
              id="day-note"
              value={note}
              placeholder="e.g. Public holiday"
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            {day.hasOverride && (
              <Button type="button" variant="outline" onClick={onReset} loading={resetting} disabled={saving}>
                Reset to default
              </Button>
            )}
            <Button type="submit" loading={saving} disabled={resetting}>
              Save
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}