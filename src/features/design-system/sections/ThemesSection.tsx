import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Alert } from "@/components/ui/alert/Alert";
import { Badge } from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input/Input";
import { Switch } from "@/components/ui/switch/Switch";
import { useTheme } from "@/hooks/useTheme";
import type { ReactNode } from "react";

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="space-y-5">
      <div>
        <h2 id={`${id}-title`} className="text-2xl font-semibold">
          {title}
        </h2>
        <p className="mt-1 text-sm text-foreground-muted">{description}</p>
      </div>
      {children}
    </section>
  );
}

function ThemePreview({ mode }: { mode: "light" | "dark" }) {
  return (
    <div className={`${mode} space-y-4 rounded-xl border bg-background p-5 text-foreground`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold capitalize">{mode} theme</span>
        <Badge variant="success">Confirmed</Badge>
      </div>
      <div className="space-y-3 rounded-lg border bg-surface p-4 shadow-sm">
        <p className="text-base font-semibold">Angkor Sunrise Tour</p>
        <p className="text-sm text-foreground-muted">3 travelers · Nov 12 · $420</p>
        <Input placeholder="Search bookings" leadingIcon={<Search />} />
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button size="sm">Confirm</Button>
            <Button size="sm" variant="outline">Details</Button>
          </div>
          <Switch defaultChecked aria-label="Published" />
        </div>
      </div>
      <Alert variant="warning" title="Payment pending">
        Awaiting bank transfer.
      </Alert>
    </div>
  );
}

export function ThemesSection() {
  const { theme, resolvedTheme } = useTheme();

  return (
    <Section
      id="themes"
      title="Themes"
      description="Light and dark use the same token names. The theme is saved, and 'system' follows your OS."
    >
      <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-surface p-5">
        <ThemeToggle />
        <p className="text-sm text-foreground-muted">
          Selected: <strong className="text-foreground">{theme}</strong> · Applied:{" "}
          <strong className="text-foreground">{resolvedTheme}</strong>
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <ThemePreview mode="light" />
        <ThemePreview mode="dark" />
      </div>
    </Section>
  );
}