import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartTooltipStyle } from "./RevenueChart";

export interface BookingsPoint {
  label: string;
  bookings: number;
}

export function BookingsChart({ data }: { data: BookingsPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--foreground-muted)", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--foreground-muted)", fontSize: 12 }} width={32} />
        <Tooltip
          cursor={{ fill: "var(--surface-muted)" }}
          contentStyle={chartTooltipStyle}
          formatter={(value) => [String(value), "Bookings"]}
        />
        <Bar dataKey="bookings" fill="var(--primary)" radius={[6, 6, 0, 0]} animationDuration={600} />
      </BarChart>
    </ResponsiveContainer>
  );
}