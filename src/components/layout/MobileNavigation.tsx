import { SidebarNav } from "@/components/layout/SidebarNav";
import { Drawer, DrawerContent } from "@/components/ui/drawer/Drawer";

interface MobileNavigationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNavigation({ open, onOpenChange }: MobileNavigationProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent title="Travel Admin" side="left" variant="sidebar" className="max-w-72">
        <SidebarNav onNavigate={() => onOpenChange(false)} />
      </DrawerContent>
    </Drawer>
  );
}