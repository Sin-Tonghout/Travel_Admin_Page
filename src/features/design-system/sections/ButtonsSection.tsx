import { Download, Plus, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { CopyButton } from "@/components/shared/CopyButton";
import { Button, IconButton } from "@/components/ui/button";
import { Label } from "@/components/ui/label/Label";
import { Select } from "@/components/ui/select/Select";
import { Switch } from "@/components/ui/switch/Switch";
import { Panel, Section } from "../components/Section";

const variants = ["primary", "secondary", "outline", "ghost", "destructive", "success", "warning", "link"] as const;
const sizes = ["xs", "sm", "md", "lg"] as const;

type Variant = (typeof variants)[number];
type Size = (typeof sizes)[number];

export function ButtonsSection() {
  const [variant, setVariant] = useState<Variant>("primary");
  const [size, setSize] = useState<Size>("md");
  const [icon, setIcon] = useState(true);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);

  const snippet =
    `<Button variant="${variant}" size="${size}"` +
    (icon ? ` leadingIcon={<Plus className="size-4" />}` : "") +
    (loading ? " loading" : "") +
    (disabled ? " disabled" : "") +
    (fullWidth ? " fullWidth" : "") +
    `>New booking</Button>`;

  return (
    <Section
      id="buttons"
      title="Buttons"
      description="One Button component with variants, sizes and states. Hover, press and Tab through the examples to check each state."
    >
      <Panel title="Live playground">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="btn-variant">Variant</Label>
              <Select
                id="btn-variant"
                value={variant}
                onValueChange={(v) => setVariant(v as Variant)}
                options={variants.map((v) => ({ value: v, label: v }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="btn-size">Size</Label>
              <Select
                id="btn-size"
                value={size}
                onValueChange={(v) => setSize(v as Size)}
                options={sizes.map((s) => ({ value: s, label: s }))}
              />
            </div>
            {(
              [
                ["Leading icon", icon, setIcon],
                ["Loading", loading, setLoading],
                ["Disabled", disabled, setDisabled],
                ["Full width", fullWidth, setFullWidth],
              ] as const
            ).map(([label, value, set]) => (
              <div key={label} className="flex items-center justify-between">
                <Label htmlFor={`sw-${label}`}>{label}</Label>
                <Switch id={`sw-${label}`} checked={value} onCheckedChange={set} />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex min-h-32 items-center justify-center rounded-lg border bg-background p-6">
              <Button
                variant={variant}
                size={size}
                loading={loading}
                disabled={disabled}
                fullWidth={fullWidth}
                leadingIcon={icon ? <Plus className="size-4" /> : undefined}
              >
                New booking
              </Button>
            </div>
            <div className="flex items-start gap-2 rounded-lg border bg-surface-muted p-3">
              <code className="flex-1 break-all text-xs">{snippet}</code>
              <CopyButton text={snippet} label="Copy usage snippet" />
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Variants × sizes">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-foreground-muted">
                <th className="py-2 pr-4 font-semibold">Variant</th>
                {sizes.map((s) => (
                  <th key={s} className="px-2 py-2 font-semibold">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr key={v} className="border-t">
                  <th scope="row" className="py-3 pr-4 text-left font-semibold">
                    {v}
                  </th>
                  {sizes.map((s) => (
                    <td key={s} className="px-2 py-3">
                      <Button variant={v} size={s}>
                        Button
                      </Button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="States">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Default</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button variant="outline" leadingIcon={<Download className="size-4" />}>
              With icon
            </Button>
            <Button variant="secondary" trailingIcon={<Settings className="size-4" />}>
              Trailing icon
            </Button>
          </div>
        </Panel>

        <Panel title="Icon buttons (with tooltips)">
          <div className="flex flex-wrap items-center gap-3">
            <IconButton label="Add" icon={<Plus className="size-4" />} variant="primary" size="icon-sm" />
            <IconButton label="Settings" icon={<Settings className="size-5" />} variant="outline" />
            <IconButton label="Delete" icon={<Trash2 className="size-5" />} variant="destructive" size="icon-lg" />
          </div>
        </Panel>
      </div>
    </Section>
  );
}