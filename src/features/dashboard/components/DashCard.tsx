import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/Card";

interface DashCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function DashCard({ title, description, action, className, children }: DashCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex items-start justify-between gap-3 space-y-0">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function ViewAllLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex shrink-0 items-center gap-1 rounded-md text-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
    >
      {label}
      <ArrowRight aria-hidden className="size-4" />
    </Link>
  );
}