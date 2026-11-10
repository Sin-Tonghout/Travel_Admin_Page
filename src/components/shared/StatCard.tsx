import { TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card/Card";
import { NumericText } from "@/components/ui/typography/Typography";
import { cn } from "@/lib/utils";

export interface StatDelta {
  value: string;
  trend: "up" | "down";
  /** Whether this change is good news. Defaults to "up is good". */
  good?: boolean;
}

interface StatCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  delta?: StatDelta;
  period?: string;
}

export function StatCard({ label, value, icon, delta, period }: StatCardProps) {
  const isGood = delta ? (delta.good ?? delta.trend === "up") : true;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-foreground-muted">{label}</p>
        {icon && (
          <span className="flex size-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground [&_svg]:size-4">
            {icon}
          </span>
        )}
      </div>
      <NumericText className="mt-2 block text-3xl">{value}</NumericText>
      {delta && (
        <p className="mt-2 flex flex-wrap items-center gap-x-1.5 text-xs">
          {/* The arrow, the +/- sign and the hidden label carry the meaning, not only the color */}
          <span className={cn("inline-flex items-center gap-1 font-semibold", isGood ? "text-success" : "text-danger")}>
            {delta.trend === "up" ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
            <span className="sr-only">{isGood ? "Better:" : "Worse:"}</span>
            {delta.value}
          </span>
          {period && <span className="text-foreground-muted">{period}</span>}
        </p>
      )}
    </Card>
  );
}