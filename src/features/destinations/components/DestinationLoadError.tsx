import { Button } from "@/components/ui/button";
import { ApiError } from "@/services/api-error";

interface Props {
  error: unknown;
  onRetry: () => void;
  onBack: () => void;
}

export function DestinationLoadError({ error, onRetry, onBack }: Props) {
  const notFound = error instanceof ApiError && error.status === 404;
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-10 text-center">
      <h2 className="text-lg font-semibold text-text-primary">
        {notFound ? "Destination not found" : "Could not load this destination"}
      </h2>
      <p className="max-w-md text-sm text-text-secondary">
        {notFound ? "It may have been deleted." : error instanceof Error ? error.message : "Something went wrong."}
      </p>
      <div className="flex gap-2">
        {!notFound && <Button onClick={onRetry}>Try again</Button>}
        <Button variant="outline" onClick={onBack}>
          Back to destinations
        </Button>
      </div>
    </div>
  );
}