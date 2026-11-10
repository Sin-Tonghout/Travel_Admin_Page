import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { NoAccessPage } from "@/components/shared/NoAccessPage";
import { useAuth, useCurrentUser } from "@/hooks/useAuth";
import { canAccess } from "@/lib/permissions";
import type { AppModule } from "@/lib/permissions";

/** Sends signed-out visitors to /login and remembers where they were going. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return <>{children}</>;
}

/**
 * Shows a "no access" page when the role can't use the module.
 * Must be rendered inside <RequireAuth>. The server still has to enforce
 * permissions on every protected request.
 */
export function RequirePermission({ module, children }: { module: AppModule; children: ReactNode }) {
  const user = useCurrentUser();
  if (!canAccess(user.role, module)) return <NoAccessPage />;
  return <>{children}</>;
}