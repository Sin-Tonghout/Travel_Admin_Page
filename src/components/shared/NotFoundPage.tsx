import { SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state/EmptyState";

export function NotFoundPage() {
  return (
    <EmptyState
      icon={<SearchX />}
      title="Page not found"
      description="The page you're looking for doesn't exist or has moved."
      action={
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/dashboard">Back to dashboard</Link>
        </Button>
      }
    />
  );
}