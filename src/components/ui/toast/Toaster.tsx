import { Toaster as Sonner, toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";

export function Toaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      theme={resolvedTheme}
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "!bg-surface !text-foreground !border !border-border !shadow-lg !rounded-lg",
          description: "!text-foreground-muted",
        },
      }}
    />
  );
}

export { toast };