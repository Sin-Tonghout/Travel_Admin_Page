import { Dialog, DialogContent } from "@/components/ui/dialog/Dialog";
import { useShortcutList } from "@/hooks/useShortcut";
import { formatShortcut } from "@/lib/shortcuts";

const groupOrder = ["General", "Navigation", "Forms"];

interface Row {
  keys: string;
  description: string;
}

export function ShortcutHelpDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const list = useShortcutList();

  const groups = new Map<string, Row[]>();
  if (open) {
    list().forEach((d) => {
      const rows = groups.get(d.group) ?? [];
      rows.push({ keys: formatShortcut(d.keys), description: d.description });
      groups.set(d.group, rows);
    });
    groups.set("General", [...(groups.get("General") ?? []), { keys: "Esc", description: "Close dialog or drawer" }]);
  }

  const ordered = Array.from(groups.entries()).sort(
    ([a], [b]) =>
      (groupOrder.indexOf(a) === -1 ? 99 : groupOrder.indexOf(a)) -
      (groupOrder.indexOf(b) === -1 ? 99 : groupOrder.indexOf(b)),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Keyboard shortcuts"
        description="Single-key shortcuts pause while you type in a field."
        size="md"
      >
        <div className="max-h-[60vh] space-y-5 overflow-y-auto pr-1">
          {ordered.map(([group, rows]) => (
            <section key={group}>
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground-muted">{group}</h3>
              <ul className="divide-y">
                {rows.map((row) => (
                  <li key={row.description} className="flex items-center justify-between gap-4 py-2 text-sm">
                    <span>{row.description}</span>
                    <kbd className="shrink-0 rounded border bg-surface-muted px-2 py-0.5 text-xs font-semibold text-foreground-muted">
                      {row.keys}
                    </kbd>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}