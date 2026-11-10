import { Inbox, RefreshCw, SearchX, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface StateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

function StateLayout({ title, description, icon, action }: StateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-surface px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-surface-muted text-foreground-muted [&_svg]:size-6">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold">{title}</p>
        {description && <p className="max-w-sm text-sm text-foreground-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState(props: Omit<StateProps, "icon"> & { icon?: ReactNode }) {
  return <StateLayout icon={<Inbox />} {...props} />;
}

export function NoResults({ onClear }: { onClear?: () => void }) {
  return (
    <StateLayout
      icon={<SearchX />}
      title="No results found"
      description="Try adjusting your search or filters."
      action={
        onClear && (
          <Button variant="outline" size="sm" onClick={onClear}>
            Clear filters
          </Button>
        )
      }
    />
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <StateLayout
      icon={<TriangleAlert />}
      title={title}
      description={description}
      action={
        onRetry && (
          <Button variant="outline" size="sm" leadingIcon={<RefreshCw className="size-4" />} onClick={onRetry}>
            Try again
          </Button>
        )
      }
    />
  );
}