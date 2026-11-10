import { Command, Menu, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { NotificationPanel } from "@/components/layout/NotificationPanel";
import { UserMenu } from "@/components/layout/UserMenu";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { IconButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input/Input";
import { formatShortcut } from "@/lib/shortcuts";

interface TopbarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
  onOpenPalette: () => void;
  onOpenShortcuts: () => void;
}

export function Topbar({ collapsed, onToggleCollapse, onOpenMobile, onOpenPalette, onOpenShortcuts }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background px-4 sm:gap-3 sm:px-6 lg:px-8">
      <IconButton
        label="Open navigation"
        icon={<Menu className="size-5" />}
        className="lg:hidden"
        onClick={onOpenMobile}
      />
      <IconButton
        label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        icon={collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
        className="hidden lg:inline-flex"
        onClick={onToggleCollapse}
      />

      <div className="min-w-0 flex-1">
        <Breadcrumbs />
      </div>

      <div className="relative hidden w-72 md:block">
        <Input
          id="global-search"
          type="search"
          placeholder="Search bookings, customers…"
          aria-label="Global search"
          leadingIcon={<Search />}
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border bg-surface-muted px-1.5 py-0.5 text-[11px] font-medium text-foreground-muted">
          /
        </kbd>
      </div>

      <IconButton
        label={`Command palette (${formatShortcut("mod+k")})`}
        icon={<Command className="size-5" />}
        className="hidden sm:inline-flex"
        onClick={onOpenPalette}
      />
      <NotificationPanel />
      <ThemeToggle showReset={false} />
      <UserMenu onOpenShortcuts={onOpenShortcuts} />
    </header>
  );
}