import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state/EmptyState";

export function NoAccessPage() {
  return (
    <EmptyState
      icon={<Lock />}
      title="You don't have access to this page"
      description="Your role doesn't include this module. Ask an administrator if you need access."
      action={
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/dashboard">Back to dashboard</Link>
        </Button>
      }
    />
  );
}