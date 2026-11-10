import { CopyButton } from "@/components/shared/CopyButton";
import { Badge } from "@/components/ui/badge/Badge";
import { contrastRatio } from "@/lib/contrast";
import type { ReactNode } from "react";
import { useTokenValues } from "../useTokenValues";

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-foreground-muted">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="font-semibold">{title}</h3>
      {children}
    </div>
  );
}

const groups: { title: string; tokens: string[] }[] = [
  { title: "Surfaces", tokens: ["background", "surface", "surface-muted", "border"] },
  { title: "Text", tokens: ["foreground", "foreground-muted"] },
  {
    title: "Brand",
    tokens: ["primary", "primary-hover", "secondary", "accent", "highlight"],
  },
  {
    title: "Status",
    tokens: [
      "success",
      "success-subtle",
      "warning",
      "warning-subtle",
      "danger",
      "danger-subtle",
      "info",
      "info-subtle",
    ],
  },
    {
    title: "Sidebar",
    tokens: ["sidebar", "sidebar-hover", "sidebar-active", "sidebar-border", "sidebar-accent", "sidebar-foreground", "sidebar-muted"],
  },
];

const pairs: { fg: string; bg: string }[] = [
  { fg: "foreground", bg: "background" },
  { fg: "foreground", bg: "surface" },
  { fg: "foreground-muted", bg: "surface" },
  { fg: "primary-foreground", bg: "primary" },
  { fg: "secondary-foreground", bg: "secondary" },
  { fg: "accent-foreground", bg: "accent" },
  { fg: "highlight-foreground", bg: "highlight" },
  { fg: "success-foreground", bg: "success" },
  { fg: "warning-foreground", bg: "warning" },
  { fg: "danger-foreground", bg: "danger" },
  { fg: "info-foreground", bg: "info" },
  { fg: "success", bg: "success-subtle" },
  { fg: "warning", bg: "warning-subtle" },
  { fg: "danger", bg: "danger-subtle" },
  { fg: "info", bg: "info-subtle" },
  { fg: "sidebar-foreground", bg: "sidebar" },
  { fg: "sidebar-muted", bg: "sidebar" },
  { fg: "sidebar-muted", bg: "sidebar-hover" },
  { fg: "sidebar-active-foreground", bg: "sidebar-active" },
  { fg: "sidebar-accent-foreground", bg: "sidebar-accent" },
];

const allNames = Array.from(
  new Set([...groups.flatMap((g) => g.tokens), ...pairs.flatMap((p) => [p.fg, p.bg])]),
);

export function ColorsSection() {
  const values = useTokenValues(allNames);

  return (
    <Section
      id="colors"
      title="Color tokens"
      description="Semantic tokens read live from the active theme. Click a copy button to take a value."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {groups.map((group) => (
          <Panel key={group.title} title={group.title}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {group.tokens.map((name) => (
                <li key={name} className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="size-10 shrink-0 rounded-md border"
                    style={{ background: `var(--${name})` }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{name}</span>
                    <span className="block text-xs text-foreground-muted">
                      {values[name] ?? "…"}
                    </span>
                  </span>
                  <CopyButton text={`var(--${name})`} label={`Copy ${name}`} />
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>

      <Panel title="Foreground / background combinations">
        <p className="text-sm text-foreground-muted">
          Target: 4.5:1 for normal text (WCAG 2.2 AA). The result is written out as text,
          not only shown by color.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {pairs.map(({ fg, bg }) => {
            const ratio = contrastRatio(values[fg] ?? "", values[bg] ?? "");
            const pass = ratio !== null && ratio >= 4.5;
            return (
              <li
                key={`${fg}-${bg}`}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-md border text-base font-bold"
                  style={{ color: `var(--${fg})`, background: `var(--${bg})` }}
                >
                  Aa
                </span>
                <span className="min-w-0 flex-1 space-y-1">
                  <span className="block truncate text-xs text-foreground-muted">
                    {fg} on {bg}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold tabular-nums">
                      {ratio ? `${ratio.toFixed(2)}:1` : "…"}
                    </span>
                    {ratio !== null && (
                      <Badge variant={pass ? "success" : "danger"}>
                        {pass ? "AA pass" : "AA fail"}
                      </Badge>
                    )}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </Panel>
    </Section>
  );
}
