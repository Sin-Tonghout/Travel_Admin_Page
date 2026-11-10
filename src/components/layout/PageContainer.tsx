import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6 lg:w-[90%] lg:max-w-[1600px] lg:px-0", className)}>
      {children}
    </div>
  );
}