import { SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/empty-state/EmptyState";
import { ApiError } from "@/services/api-error";

export function TourLoadError({ error, onRetry }: { error: Error | null; onRetry: () => void }) {
  if (error instanceof ApiError && error.status === 404) {
    return (
      <EmptyState
        icon={<SearchX />}
        title="Tour not found"
        description={error.message}
        action={
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/tours">Back to tours</Link>
          </Button>
        }
      />
    );
  }
  return <ErrorState title="We couldn't load this tour" onRetry={onRetry} />;
}