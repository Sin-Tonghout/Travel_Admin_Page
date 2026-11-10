import { CopyButton } from "@/components/shared/CopyButton";
import { Panel, Section } from "@/features/design-system/components/Section";

interface PropRow {
  prop: string;
  type: string;
  def?: string;
  description: string;
}

const docs: { name: string; rows: PropRow[] }[] = [
  {
    name: "Button",
    rows: [
      { prop: "variant", type: "primary | secondary | outline | ghost | destructive | success | warning | link", def: "primary", description: "Visual style." },
      { prop: "size", type: "xs | sm | md | lg | icon-sm | icon-md | icon-lg", def: "md", description: "Height and padding." },
      { prop: "loading", type: "boolean", def: "false", description: "Shows a spinner and disables the button." },
      { prop: "leadingIcon / trailingIcon", type: "ReactNode", description: "Icon before or after the label." },
      { prop: "fullWidth", type: "boolean", def: "false", description: "Stretches to the container width." },
      { prop: "asChild", type: "boolean", def: "false", description: "Render as the child element (for links)." },
    ],
  },
  {
    name: "Badge",
    rows: [
      { prop: "variant", type: "neutral | primary | accent | success | warning | danger | info | outline", def: "neutral", description: "Color treatment." },
      { prop: "icon", type: "ReactNode", description: "Optional leading icon. Pair status color with an icon and text." },
    ],
  },
  {
    name: "Input",
    rows: [
      { prop: "invalid", type: "boolean", def: "false", description: "Error styling and aria-invalid." },
      { prop: "leadingIcon", type: "ReactNode", description: "Icon inside the field, left side." },
      { prop: "...native props", type: "InputHTMLAttributes", description: "All standard input props are forwarded." },
    ],
  },
  {
    name: "DataTable",
    rows: [
      { prop: "columns", type: "ColumnDef<TData>[]", description: "TanStack Table v8 column definitions." },
      { prop: "data", type: "TData[]", description: "Rows to display." },
      { prop: "pageSize", type: "number", def: "8", description: "Rows per page." },
      { prop: "loading", type: "boolean", def: "false", description: "Shows skeleton rows." },
      { prop: "onRowClick", type: "(row: TData) => void", description: "Makes rows clickable." },
    ],
  },
  {
    name: "DialogContent",
    rows: [
      { prop: "title", type: "string", description: "Required accessible title." },
      { prop: "description", type: "string", description: "Supporting text under the title." },
      { prop: "footer", type: "ReactNode", description: "Action buttons, right-aligned." },
      { prop: "size", type: "sm | md | lg", def: "md", description: "Maximum width." },
    ],
  },
];

const rules = [
  "Never use animation to delay an important action.",
  "Never communicate important information through color alone.",
  "Never show a destructive action without a confirmation or an undo.",
  "Always provide loading, empty, success and error states.",
  "Make frequently used actions easy to reach.",
  "Keep the interface attractive without losing information density.",
  "Preserve focus visibility and a logical keyboard order.",
  "Respect reduced-motion preferences.",
  "Validate permissions on the backend for every protected operation.",
  "Never expose secrets or payment credentials in frontend code.",
];

const usage = `import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/features/bookings/components/BookingStatusBadge";

<Button variant="primary" leadingIcon={<Plus className="size-4" />}>
  New booking
</Button>
<BookingStatusBadge status="confirmed" />`;

export function DocsSection() {
  return (
    <Section
      id="docs"
      title="Documentation"
      description="Props, usage and the design rules every page follows."
    >
      <div className="grid gap-5">
        {docs.map((d) => (
          <Panel key={d.name} title={d.name}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-foreground-muted">
                    <th className="py-2 pr-4 font-semibold">Prop</th>
                    <th className="py-2 pr-4 font-semibold">Type</th>
                    <th className="py-2 pr-4 font-semibold">Default</th>
                    <th className="py-2 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {d.rows.map((r) => (
                    <tr key={r.prop} className="border-t align-top">
                      <td className="py-2 pr-4 font-mono text-xs font-semibold">{r.prop}</td>
                      <td className="py-2 pr-4 font-mono text-xs text-foreground-muted">{r.type}</td>
                      <td className="py-2 pr-4 font-mono text-xs">{r.def ?? "—"}</td>
                      <td className="py-2">{r.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Usage example">
          <div className="flex items-start gap-2 rounded-lg border bg-surface-muted p-3">
            <pre className="flex-1 overflow-x-auto text-xs leading-relaxed">
              <code>{usage}</code>
            </pre>
            <CopyButton text={usage} label="Copy usage example" />
          </div>
        </Panel>

        <Panel title="Non-negotiable UX rules">
          <ol className="list-decimal space-y-1.5 pl-5 text-sm">
            {rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
        </Panel>
      </div>
    </Section>
  );
}