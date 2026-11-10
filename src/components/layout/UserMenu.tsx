import { Keyboard, LogOut, Monitor, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar/Avatar";
import { Badge } from "@/components/ui/badge/Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown/DropdownMenu";
import { toast } from "@/components/ui/toast/Toaster";
import { useAuth, useCurrentUser } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { canAccess, roleLabels } from "@/lib/permissions";

export function UserMenu({ onOpenShortcuts }: { onOpenShortcuts: () => void }) {
  const user = useCurrentUser();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Avatar name={user.name} size="sm" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <div className="space-y-1 px-2.5 py-2">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-foreground-muted">{user.email}</p>
          <Badge variant="primary" className="mt-1">
            {roleLabels[user.role]}
          </Badge>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<User />} onSelect={() => toast.info("The profile page is coming soon")}>
          Profile
        </DropdownMenuItem>
        {canAccess(user.role, "settings") && (
          <DropdownMenuItem icon={<Settings />} onSelect={() => navigate("/admin/settings")}>
            Settings
          </DropdownMenuItem>
        )}
        <DropdownMenuItem icon={<Keyboard />} shortcut="?" onSelect={onOpenShortcuts}>
          Keyboard shortcuts
        </DropdownMenuItem>
        {theme !== "system" && (
          <DropdownMenuItem icon={<Monitor />} onSelect={() => setTheme("system")}>
            Use device theme
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          icon={<LogOut />}
          destructive
          onSelect={() => {
            logout();
            navigate("/login", { replace: true });
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}