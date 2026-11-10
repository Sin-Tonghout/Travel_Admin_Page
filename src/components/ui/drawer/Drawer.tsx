import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

const tones = {
  default: {
    content: "bg-surface",
    header: "border-b",
    description: "text-foreground-muted",
    close: "text-foreground-muted hover:bg-surface-muted hover:text-foreground",
    footer: "border-t",
  },
  sidebar: {
    content: "border-sidebar-border bg-sidebar text-sidebar-foreground",
    header: "border-b border-sidebar-border",
    description: "text-sidebar-muted",
    close: "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground",
    footer: "border-t border-sidebar-border",
  },
} as const;

interface DrawerContentProps {
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  side?: "left" | "right";
  variant?: keyof typeof tones;
  className?: string;
}

export function DrawerContent({
  title,
  description,
  children,
  footer,
  side = "right",
  variant = "default",
  className,
}: DrawerContentProps) {
  const tone = tones[variant];

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="anim-overlay fixed inset-0 z-50 bg-black/50" />
      <DialogPrimitive.Content
        className={cn(
          "fixed inset-y-0 z-50 flex w-full max-w-md flex-col border shadow-lg",
          tone.content,
          side === "right" ? "anim-drawer-right right-0 border-r-0" : "anim-drawer-left left-0 border-l-0",
          className,
        )}
      >
        <div className={cn("flex items-start justify-between gap-4 p-5", tone.header)}>
          <div className="space-y-1">
            <DialogPrimitive.Title className="text-lg font-semibold">{title}</DialogPrimitive.Title>
            <DialogPrimitive.Description className={description ? cn("text-sm", tone.description) : "sr-only"}>
              {description ?? title}
            </DialogPrimitive.Description>
          </div>
          <DialogPrimitive.Close
            aria-label="Close"
            className={cn(
              "rounded-md p-1 transition-colors focus-visible:outline-2 focus-visible:outline-ring",
              tone.close,
            )}
          >
            <X className="size-4" />
          </DialogPrimitive.Close>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && <div className={cn("flex justify-end gap-2 p-4", tone.footer)}>{footer}</div>}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}