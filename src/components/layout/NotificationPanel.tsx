import { Bell, CalendarCheck, CreditCard, Info, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge/Badge";
import { Button, IconButton } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover/Popover";
import { initialNotifications } from "@/mocks/notifications";
import type { NotificationType } from "@/mocks/notifications";
import { cn } from "@/lib/utils";

const icons = {
  booking: CalendarCheck,
  payment: CreditCard,
  review: Star,
  system: Info,
} satisfies Record<NotificationType, unknown>;

export function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialNotifications);
  const unread = items.filter((n) => !n.read).length;

  const markRead = (id: string) => setItems((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setItems((list) => list.map((n) => ({ ...n, read: true })));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <IconButton
          label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
          variant="ghost"
          icon={
            <span className="relative inline-flex">
              <Bell className="size-5" />
              {unread > 0 && (
                <span
                  aria-hidden
                  className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-danger-foreground"
                >
                  {unread}
                </span>
              )}
            </span>
          }
        />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[22rem] max-w-[calc(100vw-2rem)] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <Button size="xs" variant="ghost" disabled={unread === 0} onClick={markAllRead}>
            Mark all as read
          </Button>
        </div>

        <ul className="max-h-80 divide-y overflow-y-auto">
          {items.map((n) => {
            const Icon = icons[n.type];
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => markRead(n.id)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className={cn("truncate text-sm", n.read ? "font-medium" : "font-bold")}>{n.title}</span>
                      {!n.read && <Badge variant="info">New</Badge>}
                    </span>
                    <span className="block text-sm text-foreground-muted">{n.body}</span>
                    <span className="block text-xs text-foreground-muted">{n.time}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="border-t p-2">
          <Link
            to="/admin/notifications"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-center text-sm font-semibold text-primary transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-ring"
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}