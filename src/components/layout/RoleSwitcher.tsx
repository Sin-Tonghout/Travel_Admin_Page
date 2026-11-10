import { Select } from "@/components/ui/select/Select";
import { useAuth } from "@/hooks/useAuth";
import { roleLabels, roles } from "@/lib/permissions";
import type { Role } from "@/types/auth";

export function RoleSwitcher() {
  const { user, login } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-sidebar-muted">Dev: view as</p>
      <Select
        value={user.role}
        onValueChange={(v) => login(v as Role)}
        options={roles.map((r) => ({ value: r, label: roleLabels[r] }))}
        className="border-sidebar-border bg-sidebar-hover text-sidebar-foreground hover:border-sidebar-muted"
      />
    </div>
  );
}