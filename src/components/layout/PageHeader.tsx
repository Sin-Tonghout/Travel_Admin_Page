import type { ReactNode } from "react";
import { PageTitle } from "@/components/ui/typography/Typography";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader(props: PageHeaderProps) {
  return (
    <div className="mb-6">
      <PageTitle {...props} />
    </div>
  );
}