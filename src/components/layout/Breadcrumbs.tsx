import { ChevronRight, House } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { allNavItems } from "@/lib/navigation";

const labelBySegment: Record<string, string> = Object.fromEntries(
  allNavItems.map((item) => [item.path.split("/").pop() as string, item.label]),
);

const titleCase = (segment: string) =>
  segment.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean).slice(1); // drop "admin"

  const crumbs = segments.map((segment, i) => ({
    label: labelBySegment[segment] ?? (/\d/.test(segment) ? segment : titleCase(segment)),
    to: `/admin/${segments.slice(0, i + 1).join("/")}`,
  }));

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex items-center gap-1.5 text-sm">
        <li className="shrink-0">
          <Link
            to="/admin/dashboard"
            aria-label="Home"
            className="text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <House className="size-4" />
          </Link>
        </li>
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.to} className="flex min-w-0 items-center gap-1.5">
              <ChevronRight aria-hidden className="size-3.5 shrink-0 text-foreground-muted" />
              {isLast ? (
                <span aria-current="page" className="truncate font-semibold">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.to}
                  className="truncate text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}