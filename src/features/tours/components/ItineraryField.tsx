import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { FormField } from "@/components/shared/FormField";
import { Button, IconButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input/Input";
import { Textarea } from "@/components/ui/textarea/Textarea";
import type { ItineraryItem } from "@/types/tour";

export type ItineraryErrors =
  | ({ label?: { message?: string }; title?: { message?: string } } | undefined)[]
  | undefined;

interface ItineraryFieldProps {
  value: ItineraryItem[];
  onChange: (items: ItineraryItem[]) => void;
  errors?: ItineraryErrors;
}

export function ItineraryField({ value, onChange, errors }: ItineraryFieldProps) {
  const patch = (index: number, change: Partial<ItineraryItem>) =>
    onChange(value.map((item, i) => (i === index ? { ...item, ...change } : item)));

  const move = (from: number, to: number) => {
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {value.length === 0 && (
        <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-foreground-muted">
          No stops yet. Add the day-by-day or hour-by-hour plan travelers will follow.
        </p>
      )}

      <ol className="space-y-4">
        {value.map((item, index) => (
          <li key={item.id} className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold">Stop {index + 1}</p>
              <div className="flex items-center gap-1">
                <IconButton
                  label={`Move stop ${index + 1} up`}
                  icon={<ArrowUp className="size-4" />}
                  size="icon-sm"
                  disabled={index === 0}
                  onClick={() => move(index, index - 1)}
                />
                <IconButton
                  label={`Move stop ${index + 1} down`}
                  icon={<ArrowDown className="size-4" />}
                  size="icon-sm"
                  disabled={index === value.length - 1}
                  onClick={() => move(index, index + 1)}
                />
                <IconButton
                  label={`Remove stop ${index + 1}`}
                  icon={<Trash2 className="size-4 text-danger" />}
                  size="icon-sm"
                  onClick={() => onChange(value.filter((_, i) => i !== index))}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
              <FormField id={`it-${item.id}-label`} label="Day or time" required error={errors?.[index]?.label?.message}>
                <Input
                  id={`it-${item.id}-label`}
                  placeholder="Day 1 or 09:00"
                  value={item.label}
                  invalid={!!errors?.[index]?.label}
                  onChange={(e) => patch(index, { label: e.target.value })}
                />
              </FormField>
              <FormField id={`it-${item.id}-title`} label="Title" required error={errors?.[index]?.title?.message}>
                <Input
                  id={`it-${item.id}-title`}
                  placeholder="Sunrise at Angkor Wat"
                  value={item.title}
                  invalid={!!errors?.[index]?.title}
                  onChange={(e) => patch(index, { title: e.target.value })}
                />
              </FormField>
            </div>

            <FormField id={`it-${item.id}-desc`} label="Description">
              <Textarea
                id={`it-${item.id}-desc`}
                className="min-h-16"
                placeholder="What happens at this stop?"
                value={item.description}
                onChange={(e) => patch(index, { description: e.target.value })}
              />
            </FormField>
          </li>
        ))}
      </ol>

      <Button
        type="button"
        variant="outline"
        leadingIcon={<Plus className="size-4" />}
        onClick={() => onChange([...value, { id: crypto.randomUUID(), label: "", title: "", description: "" }])}
      >
        Add stop
      </Button>
    </div>
  );
}