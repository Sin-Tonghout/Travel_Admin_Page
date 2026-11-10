import { CalendarCheck, CreditCard, DollarSign, Menu, Users } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { Button, IconButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card/Card";
import { Text } from "@/components/ui/typography/Typography";
import { Panel, Section } from "@/features/design-system/components/Section";
import { BookingStatusBadge } from "@/features/bookings/components/BookingStatusBadge";
import { bookings } from "@/mocks/bookings";

const frames = [
  { label: "Desktop", width: 1024 },
  { label: "Tablet", width: 768 },
  { label: "Mobile", width: 375 },
] as const;

function DashboardFrame() {
  return (
    <div className="space-y-4 bg-background p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <IconButton label="Menu" icon={<Menu className="size-5" />} variant="ghost" className="@4xl:hidden" />
          <span className="text-lg font-bold">Dashboard</span>
        </div>
        <Button size="sm">New booking</Button>
      </div>

      <div className="grid grid-cols-1 gap-3 @xl:grid-cols-2 @4xl:grid-cols-4">
        <StatCard label="Revenue" value="$128k" icon={<DollarSign />} delta={{ value: "+12%", trend: "up" }} />
        <StatCard label="Bookings" value="1,284" icon={<CalendarCheck />} delta={{ value: "+8%", trend: "up" }} />
        <StatCard label="Pending" value="$6.2k" icon={<CreditCard />} delta={{ value: "-3%", trend: "down" }} />
        <StatCard label="Customers" value="214" icon={<Users />} delta={{ value: "+6%", trend: "up" }} />
      </div>

      <div className="grid grid-cols-1 gap-3 @xl:grid-cols-2">
        {bookings.slice(0, 4).map((b) => (
          <Card key={b.id} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{b.customer}</p>
              <p className="truncate text-xs text-foreground-muted">{b.tour}</p>
            </div>
            <BookingStatusBadge status={b.status} />
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ResponsiveSection() {
  return (
    <Section
      id="responsive"
      title="Responsive previews"
      description="The same components in desktop, tablet and mobile widths. Scroll sideways if the frames are wider than your window."
    >
      <Panel>
        <div className="flex items-start gap-6 overflow-x-auto pb-2">
          {frames.map(({ label, width }) => (
            <div key={label} className="shrink-0 space-y-2">
              <Text size="sm" weight="semibold">
                {label} <span className="font-normal text-foreground-muted">· {width}px</span>
              </Text>
              <div className="overflow-hidden rounded-xl border">
                <div className="@container" style={{ width }}>
                  <DashboardFrame />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </Section>
  );
}