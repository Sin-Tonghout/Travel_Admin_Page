import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  height?: number;
  children: ReactNode;
}

export function ChartCard({ title, description, actions, height = 280, children }: ChartCardProps) {
  return (
    <section className="rounded-xl border bg-surface p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="text-base font-semibold">{title}</h3>
          {description && <p className="text-sm text-foreground-muted">{description}</p>}
        </div>
        {actions}
      </div>
      <div style={{ height }}>{children}</div>
    </section>
  );
}