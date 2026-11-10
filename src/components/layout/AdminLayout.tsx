import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminCommandPalette } from "@/components/layout/AdminCommandPalette";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageTransition } from "@/components/layout/PageTransition";
import { ShortcutHelpDialog } from "@/components/layout/ShortcutHelpDialog";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useAdminShortcuts } from "@/components/layout/useAdminShortcuts";
// import { toast } from "@/components/ui/toast/Toaster";
import { cn } from "@/lib/utils";

const COLLAPSE_KEY = "travel-admin-sidebar-collapsed";

function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === "true";
  } catch {
    return false;
  }
}

export function AdminLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, String(!c));
      } catch {
        /* storage unavailable, ignore */
      }
      return !c;
    });
  };

  const newBooking = useCallback(() => {
    navigate("/admin/bookings/new");
  }, [navigate]);

  useAdminShortcuts({
    onTogglePalette: () => setPaletteOpen((o) => !o),
    onOpenHelp: () => setHelpOpen(true),
    onNewBooking: newBooking,
  });

  // Close the mobile drawer if the window grows to desktop width.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setMobileOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <Sidebar collapsed={collapsed} />

      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding-left] duration-[250ms] ease-[cubic-bezier(0.2,0,0,1)]",
          collapsed ? "lg:pl-[72px]" : "lg:pl-64",
        )}
      >
        <Topbar
          collapsed={collapsed}
          onToggleCollapse={toggleCollapsed}
          onOpenMobile={() => setMobileOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenShortcuts={() => setHelpOpen(true)}
        />
        <main id="main-content" tabIndex={-1} className="flex-1 py-6 outline-none">
          <PageContainer className="lg:w-full lg:px-8">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </PageContainer>
        </main>
      </div>

      <MobileNavigation open={mobileOpen} onOpenChange={setMobileOpen} />
      <AdminCommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onShowShortcuts={() => setHelpOpen(true)}
        onNewBooking={newBooking}
      />
      <ShortcutHelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}