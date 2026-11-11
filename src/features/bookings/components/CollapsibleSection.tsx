import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card/Card";
import { cn } from "@/lib/utils";

/** The rounded grey pill that sits in a section header (an Edit link, a badge, …). */
export function HeaderPill({ children }: { children: ReactNode }) {
  return (
    <div className="hidden items-center gap-2 rounded-full bg-surface-muted px-3.5 py-1.5 text-sm sm:flex">
      {children}
    </div>
  );
}

interface CollapsibleSectionProps {
  index: number;
  title: string;
  defaultOpen?: boolean;
  headerExtra?: ReactNode;
  children: ReactNode;
}

export function CollapsibleSection({ index, title, defaultOpen = true, headerExtra, children }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();
  const toggle = () => setOpen((o) => !o);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 sm:px-8 sm:py-5">
        <h2 className="min-w-0 flex-1">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={bodyId}
            onClick={toggle}
            className="w-full rounded-md py-1 text-left text-xl font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-ring"
          >
            {index}. {title}
          </button>
        </h2>
        {headerExtra}
        {/* Mouse shortcut only. The title button above is the accessible control. */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          onClick={toggle}
          className="flex size-9 shrink-0 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-surface-muted"
        >
          <ChevronDown className={cn("size-5 transition-transform duration-200", open && "rotate-180")} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={bodyId}
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t px-6 py-6 sm:px-8 sm:py-8">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}