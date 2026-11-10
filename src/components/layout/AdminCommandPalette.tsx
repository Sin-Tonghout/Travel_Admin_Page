import { Command, Keyboard, LogOut, Moon, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CommandPalette } from "@/components/ui/command-palette/CommandPalette";
import type { CommandAction } from "@/components/ui/command-palette/CommandPalette";
import { useAuth, useCurrentUser } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { getVisibleNav } from "@/lib/navigation";
import { canAccess } from "@/lib/permissions";
import { formatShortcut } from "@/lib/shortcuts";

interface AdminCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShowShortcuts: () => void;
  onNewBooking: () => void;
}

export function AdminCommandPalette({ open, onOpenChange, onShowShortcuts, onNewBooking }: AdminCommandPaletteProps) {
  const user = useCurrentUser();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();

  const navigation: CommandAction[] = getVisibleNav(user.role)
    .flatMap((g) => g.items)
    .map((item) => {
      const Icon = item.icon;
      return {
        id: item.path,
        group: "Navigate",
        label: `Go to ${item.label}`,
        icon: <Icon />,
        shortcut: item.goKey ? formatShortcut(`g ${item.goKey}`) : undefined,
        onSelect: () => navigate(item.path),
      };
    });

  const actions: CommandAction[] = [
    ...navigation,
    ...(canAccess(user.role, "bookings")
      ? [
          {
            id: "new-booking",
            group: "Actions",
            label: "Create new booking",
            icon: <Plus />,
            shortcut: formatShortcut("n"),
            onSelect: onNewBooking,
          },
        ]
      : []),
    {
      id: "toggle-theme",
      group: "Actions",
      label: resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme",
      icon: <Moon />,
      onSelect: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    },
    {
      id: "shortcuts",
      group: "Actions",
      label: "Keyboard shortcuts",
      icon: <Keyboard />,
      shortcut: formatShortcut("shift+?"),
      onSelect: onShowShortcuts,
    },
    {
      id: "logout",
      group: "Actions",
      label: "Log out",
      icon: <LogOut />,
      onSelect: () => {
        logout();
        navigate("/login", { replace: true });
      },
    },
  ];

  return <CommandPalette open={open} onOpenChange={onOpenChange} actions={actions} />;
}

export { Command as CommandIcon };