import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useAuth";
import { useShortcuts } from "@/hooks/useShortcut";
import { allNavItems } from "@/lib/navigation";
import { canAccess } from "@/lib/permissions";
import type { ShortcutDef } from "@/lib/shortcuts";

interface Options {
  onTogglePalette: () => void;
  onOpenHelp: () => void;
  onNewBooking: () => void;
}

export function useAdminShortcuts({ onTogglePalette, onOpenHelp, onNewBooking }: Options) {
  const user = useCurrentUser();
  const navigate = useNavigate();

  const defs: ShortcutDef[] = [
    {
      id: "palette",
      keys: "mod+k",
      group: "General",
      description: "Open command palette",
      handler: () => onTogglePalette(),
    },
    {
      id: "search",
      keys: "/",
      group: "General",
      description: "Focus global search",
      handler: () => {
        const el = document.getElementById("global-search");
        // On small screens the search field is hidden, so open the palette instead.
        if (el instanceof HTMLInputElement && el.offsetParent !== null) el.focus();
        else onTogglePalette();
      },
    },
    {
      id: "help",
      keys: "shift+?",
      group: "General",
      description: "Show keyboard shortcuts",
      handler: () => onOpenHelp(),
    },
    {
      id: "submit",
      keys: "mod+enter",
      group: "Forms",
      description: "Submit the current form",
      handler: () => {
        const form = document.activeElement?.closest("form");
        if (!form) return false; // nothing to submit, leave the key alone
        form.requestSubmit();
      },
    },
  ];

  if (canAccess(user.role, "bookings")) {
    defs.push({
      id: "new-booking",
      keys: "n",
      group: "General",
      description: "Create a new booking",
      handler: () => onNewBooking(),
    });
  }

  allNavItems.forEach((item) => {
    if (item.goKey && canAccess(user.role, item.module)) {
      defs.push({
        id: `go-${item.goKey}`,
        keys: `g ${item.goKey}`,
        group: "Navigation",
        description: `Go to ${item.label}`,
        handler: () => {
          void navigate(item.path);
        },
      });
    }
  });

  useShortcuts(defs);
}