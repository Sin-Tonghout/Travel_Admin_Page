import { Construction } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/empty-state/EmptyState";

interface PlaceholderPageProps {
  title: string;
  phase: number;
}

export function PlaceholderPage({ title, phase }: PlaceholderPageProps) {
  return (
    <>
      <PageHeader title={title} description={`The ${title.toLowerCase()} module.`} />
      <EmptyState
        icon={<Construction />}
        title={`${title} is coming soon`}
        description={`This page is built in Phase ${phase} of the roadmap.`}
      />
    </>
  );
}