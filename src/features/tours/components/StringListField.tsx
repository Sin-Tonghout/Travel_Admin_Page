import { Plus, X } from "lucide-react";
import { Button, IconButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input/Input";

interface StringListFieldProps {
  value: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  itemLabel: string;
}

export function StringListField({ value, onChange, placeholder, addLabel = "Add item", itemLabel }: StringListFieldProps) {
  const items = value.length > 0 ? value : [""];

  return (
    <div className="space-y-2">
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <Input
              aria-label={`${itemLabel} ${index + 1}`}
              placeholder={placeholder}
              value={item}
              onChange={(e) => onChange(items.map((v, i) => (i === index ? e.target.value : v)))}
            />
            <IconButton
              label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`}
              icon={<X className="size-4" />}
              size="icon-md"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            />
          </li>
        ))}
      </ul>
      <Button type="button" variant="ghost" size="sm" leadingIcon={<Plus className="size-4" />} onClick={() => onChange([...items, ""])}>
        {addLabel}
      </Button>
    </div>
  );
}