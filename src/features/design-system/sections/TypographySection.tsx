import {
  Caption,
  Heading,
  NumericText,
  Text,
} from "@/components/ui/typography/Typography";
import { fontWeights, typeScale } from "@/design-system/tokens/typography";
import { Panel, Section } from "../components/Section";

const colors = [
  "default",
  "muted",
  "primary",
  "accent",
  "success",
  "warning",
  "danger",
  "info",
] as const;

export function TypographySection() {
  return (
    <Section
      id="typography"
      title="Typography"
      description="One font family (Plus Jakarta Sans). Hierarchy comes from size, weight, color, line height and spacing together."
    >
      <Panel title="Type scale">
        <ul className="divide-y">
          {Object.entries(typeScale).map(([name, t]) => (
            <li
              key={name}
              className="grid items-baseline gap-2 py-3 md:grid-cols-[180px_1fr]"
            >
              <span className="text-xs text-foreground-muted">
                <span className="block text-sm font-semibold text-foreground">
                  {name}
                </span>
                {t.size}px · {t.weight} · lh {t.lineHeight} · {t.tracking}
              </span>
              <span
                style={{
                  fontSize: t.size,
                  fontWeight: t.weight,
                  lineHeight: t.lineHeight,
                  letterSpacing: t.tracking,
                }}
              >
                Plan unforgettable journeys
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Weights and styles">
          <ul className="space-y-2">
            {fontWeights.map((w) => (
              <li key={w} className="flex flex-wrap items-baseline gap-4 text-lg">
                <span style={{ fontWeight: w }}>Booking confirmed</span>
                <span style={{ fontWeight: w, fontStyle: "italic" }}>
                  Booking confirmed
                </span>
                <span className="text-xs text-foreground-muted">{w}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Text colors">
          <ul className="grid grid-cols-2 gap-2">
            {colors.map((c) => (
              <li key={c}>
                <Text color={c} weight="semibold">
                  {c}
                </Text>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Heading component">
          <Heading level="display">Display</Heading>
          <Heading level="h1">Heading 1</Heading>
          <Heading level="h2">Heading 2</Heading>
          <Heading level="h3">Heading 3</Heading>
          <Heading level="h4">Heading 4</Heading>
          <Heading level="h5">Heading 5</Heading>
        </Panel>

        <Panel title="Text, Caption and NumericText">
          <Text size="lg">Large body text for introductions.</Text>
          <Text>Standard body text used across the interface.</Text>
          <Text size="sm" color="muted">
            Small supporting text and metadata.
          </Text>
          <Text italic>Italic text for notes.</Text>
          <Caption>Caption · helper text</Caption>
          <div className="flex items-baseline gap-3">
            <NumericText className="text-4xl">$128,450</NumericText>
            <Text color="muted" size="sm">
              tabular figures keep numbers aligned
            </Text>
          </div>
        </Panel>
      </div>
    </Section>
  );
}
