import type { ReactNode } from "react";
import { Heading, Text } from "@/components/ui/typography/Typography";

interface SectionProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function Section({ id, title, description, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 space-y-5">
      <div className="space-y-1 border-b pb-3">
        <Heading level="h2">{title}</Heading>
        {description && <Text color="muted">{description}</Text>}
      </div>
      {children}
    </section>
  );
}

export function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="space-y-4 rounded-xl border bg-surface p-5">
      {title && <Heading level="h4">{title}</Heading>}
      {children}
    </div>
  );
}