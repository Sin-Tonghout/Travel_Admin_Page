import { PageContainer } from "@/components/layout/PageContainer";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Heading, Text } from "@/components/ui/typography/Typography";
import { AnimationSection } from "./sections/AnimationSection";
import { ButtonsSection } from "./sections/ButtonsSection";
import { ColorsSection } from "./sections/ColorsSection";
import { DataDisplaySection } from "./sections/DataDisplaySection";
import { DocsSection } from "./sections/DocsSection";
import { FormsSection } from "./sections/FormsSection";
import { OverlaysSection } from "./sections/OverlaysSection";
import { ResponsiveSection } from "./sections/ResponsiveSection";
import { ThemesSection } from "./sections/ThemesSection";
import { TypographySection } from "./sections/TypographySection";

const navItems = [
  { id: "colors", label: "Color tokens" },
  { id: "themes", label: "Themes" },
  { id: "typography", label: "Typography" },
  { id: "buttons", label: "Buttons" },
  { id: "forms", label: "Forms" },
  { id: "overlays", label: "Overlays" },
  { id: "data", label: "Data display" },
  { id: "animation", label: "Animation" },
  { id: "responsive", label: "Responsive" },
  { id: "docs", label: "Documentation" },
];

export function DesignSystemPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b bg-background">
        <PageContainer className="flex h-16 items-center justify-between gap-4">
          <div>
            <Heading level="h3">Design system</Heading>
            <Text size="sm" color="muted">
              Travel Admin component playground
            </Text>
          </div>
          <ThemeToggle />
        </PageContainer>
      </header>

      <PageContainer className="grid gap-8 py-8 lg:grid-cols-[200px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <nav aria-label="Playground sections" className="flex gap-1 overflow-x-auto lg:flex-col">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 space-y-14">
          <ColorsSection />
          <ThemesSection />
          <TypographySection />
          <ButtonsSection />
          <FormsSection />
          <OverlaysSection />
          <DataDisplaySection />
          <AnimationSection />
          <ResponsiveSection />
          <DocsSection />
        </main>
      </PageContainer>
    </div>
  );
}