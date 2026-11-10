import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import type { ReactNode } from "react";

export interface CommandAction {
  id: string;
  label: string;
  group: string;
  icon?: ReactNode;
  shortcut?: string;
  onSelect: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actions: CommandAction[];
}

export function CommandPalette({ open, onOpenChange, actions }: CommandPaletteProps) {
  const groups = Array.from(new Set(actions.map((a) => a.group)));

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="anim-overlay fixed inset-0 z-50 bg-black/50" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="anim-pop fixed left-1/2 top-[15vh] z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border bg-surface shadow-lg"
        >
          <DialogPrimitive.Title className="sr-only">Command palette</DialogPrimitive.Title>
          <Command label="Command palette">
            <div className="flex items-center gap-2 border-b px-4">
              <Search className="size-4 text-foreground-muted" />
              <Command.Input
                placeholder="Type a command or search…"
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-foreground-muted"
              />
            </div>
            <Command.List className="max-h-80 overflow-y-auto p-2">
              <Command.Empty className="px-3 py-8 text-center text-sm text-foreground-muted">
                No results found.
              </Command.Empty>
              {groups.map((group) => (
                <Command.Group
                  key={group}
                  heading={group}
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-foreground-muted"
                >
                  {actions
                    .filter((a) => a.group === group)
                    .map((a) => (
                      <Command.Item
                        key={a.id}
                        value={`${a.group} ${a.label}`}
                        onSelect={() => {
                          a.onSelect();
                          onOpenChange(false);
                        }}
                        className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm data-[selected=true]:bg-surface-muted"
                      >
                        {a.icon && <span className="[&_svg]:size-4">{a.icon}</span>}
                        <span className="flex-1">{a.label}</span>
                        {a.shortcut && (
                          <kbd className="rounded border bg-surface-muted px-1.5 py-0.5 text-[11px] font-medium text-foreground-muted">
                            {a.shortcut}
                          </kbd>
                        )}
                      </Command.Item>
                    ))}
                </Command.Group>
              ))}
            </Command.List>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}