import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/formatters";

export interface RevenuePoint {
  label: string;
  revenue: number;
}

export const chartTooltipStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  color: "var(--foreground)",
  fontSize: 12,
  boxShadow: "var(--shadow-md)",
} as const;

const axisProps = {
  tickLine: false,
  axisLine: false,
  tick: { fill: "var(--foreground-muted)", fontSize: 12 },
} as const;

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v: number) => `$${v / 1000}k`} width={44} />
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="var(--accent)"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5 }}
          animationDuration={600}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}