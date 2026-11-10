import { Bell, CalendarDays, Eye, LayoutDashboard, MoreHorizontal, Pencil, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { Button, IconButton } from "@/components/ui/button";
import { CommandPalette } from "@/components/ui/command-palette/CommandPalette";
import type { CommandAction } from "@/components/ui/command-palette/CommandPalette";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog/Dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/components/ui/drawer/Drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown/DropdownMenu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover/Popover";
import { toast } from "@/components/ui/toast/Toaster";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { Panel, Section } from "@/features/design-system/components/Section";

export function OverlaysSection() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  const actions: CommandAction[] = [
    { id: "dash", group: "Navigate", label: "Go to Dashboard", icon: <LayoutDashboard />, shortcut: "G D", onSelect: () => toast("Dashboard") },
    { id: "cust", group: "Navigate", label: "Go to Customers", icon: <Users />, shortcut: "G C", onSelect: () => toast("Customers") },
    { id: "new", group: "Actions", label: "Create new booking", icon: <Plus />, shortcut: "N", onSelect: () => toast("New booking") },
    { id: "cal", group: "Actions", label: "Open availability calendar", icon: <CalendarDays />, onSelect: () => toast("Calendar") },
  ];

  return (
    <Section
      id="overlays"
      title="Overlays"
      description="Dialogs, drawers, popovers, menus, tooltips, toasts and the command palette. Try Esc, Tab and the arrow keys."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Dialog (destructive confirmation with undo)">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" leadingIcon={<Trash2 className="size-4" />}>
                Delete booking
              </Button>
            </DialogTrigger>
            <DialogContent
              size="sm"
              title="Delete this booking?"
              description="BK-1006 will be removed. You can undo this for a few seconds."
              footer={
                <>
                  <DialogClose asChild>
                    <Button variant="ghost">Keep it</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        toast("Booking deleted", {
                          action: { label: "Undo", onClick: () => toast.success("Booking restored") },
                        })
                      }
                    >
                      Delete
                    </Button>
                  </DialogClose>
                </>
              }
            />
          </Dialog>
        </Panel>

        <Panel title="Drawer">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Open booking drawer</Button>
            </DrawerTrigger>
            <DrawerContent
              title="Booking BK-1001"
              description="Jane Doe · Angkor Sunrise Tour"
              footer={
                <>
                  <DrawerClose asChild>
                    <Button variant="ghost">Close</Button>
                  </DrawerClose>
                  <Button onClick={() => toast.success("Booking confirmed")}>Confirm</Button>
                </>
              }
            >
              <p className="text-sm text-foreground-muted">Detail panels slide in without leaving the list.</p>
            </DrawerContent>
          </Drawer>
        </Panel>

        <Panel title="Popover and tooltip">
          <div className="flex flex-wrap items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" leadingIcon={<Bell className="size-4" />}>
                  Notifications
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <p className="text-sm font-semibold">3 new bookings</p>
                <p className="text-sm text-foreground-muted">Review them in the Bookings list.</p>
              </PopoverContent>
            </Popover>
            <Tooltip content="Tooltips appear on hover and focus">
              <Button variant="ghost">Hover or focus me</Button>
            </Tooltip>
          </div>
        </Panel>

        <Panel title="Dropdown menu">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton label="Row actions" icon={<MoreHorizontal className="size-4" />} variant="outline" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem icon={<Eye />}>View</DropdownMenuItem>
              <DropdownMenuItem icon={<Pencil />} shortcut="E">
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={<Trash2 />} destructive>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Panel>

        <Panel title="Toasts">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="success" onClick={() => toast.success("Payment verified")}>
              Success
            </Button>
            <Button size="sm" variant="destructive" onClick={() => toast.error("Payment failed")}>
              Error
            </Button>
            <Button size="sm" variant="warning" onClick={() => toast.warning("Capacity almost full")}>
              Warning
            </Button>
            <Button size="sm" variant="secondary" onClick={() => toast.info("New booking received")}>
              Info
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
                  loading: "Saving…",
                  success: "Saved",
                  error: "Could not save",
                })
              }
            >
              Loading → success
            </Button>
          </div>
        </Panel>

        <Panel title="Command palette">
          <Button variant="outline" onClick={() => setPaletteOpen(true)}>
            Open command palette
          </Button>
          <p className="text-xs text-foreground-muted">
            The global Ctrl/Cmd + K shortcut arrives with the shortcut system in Phase 5.
          </p>
        </Panel>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} actions={actions} />
    </Section>
  );
}