import { Plane } from "lucide-react";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { Avatar } from "@/components/ui/avatar/Avatar";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { useCurrentUser } from "@/hooks/useAuth";
import { roleLabels } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const user = useCurrentUser();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex",
        "transition-[width] duration-[250ms] ease-[cubic-bezier(0.2,0,0,1)]",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-[18px]">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
          <Plane className="size-5" />
        </span>
        {!collapsed && <span className="truncate text-base font-bold tracking-tight">Travel Admin</span>}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        <SidebarNav collapsed={collapsed} />
      </div>

      <div className="space-y-3 border-t border-sidebar-border p-3">
        {import.meta.env.DEV && !collapsed && <RoleSwitcher />}
        {collapsed ? (
          <Tooltip content={`${user.name} · ${roleLabels[user.role]}`} side="right">
            <div className="flex justify-center">
              <Avatar name={user.name} size="sm" />
            </div>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar name={user.name} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-sidebar-muted">{roleLabels[user.role]}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}