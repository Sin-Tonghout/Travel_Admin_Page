import { NavLink } from "react-router-dom";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { useCurrentUser } from "@/hooks/useAuth";
import { getVisibleNav } from "@/lib/navigation";
import type { NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

function NavItemLink({ item, collapsed, onNavigate }: { item: NavItem; collapsed: boolean; onNavigate?: () => void }) {
  const Icon = item.icon;

  const link = (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      aria-label={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-sidebar-accent",
          isActive
            ? "bg-sidebar-active text-sidebar-active-foreground"
            : "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground",
          collapsed && "justify-center px-0",
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span aria-hidden className="absolute inset-y-1.5 left-0 w-1 rounded-full bg-sidebar-accent" />
          )}
          <Icon className="size-5 shrink-0" />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  );

  return collapsed ? (
    <Tooltip content={item.label} side="right">
      {link}
    </Tooltip>
  ) : (
    link
  );
}

export function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
  const user = useCurrentUser();
  const groups = getVisibleNav(user.role);

  return (
    <nav aria-label="Main navigation" className="space-y-5">
      {groups.map((group, index) => (
        <div key={group.label}>
          {collapsed ? (
            index > 0 && <div aria-hidden className="mx-3 mb-3 h-px bg-sidebar-border" />
          ) : (
            <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wide text-sidebar-muted">
              {group.label}
            </p>
          )}
          <ul className="space-y-0.5">
            {group.items.map((item) => (
              <li key={item.path}>
                <NavItemLink item={item} collapsed={collapsed} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}