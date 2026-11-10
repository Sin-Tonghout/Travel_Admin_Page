export const semanticColors = [
  "background",
  "surface",
  "surface-muted",
  "border",
  "foreground",
  "foreground-muted",
  "primary",
  "primary-hover",
  "secondary",
  "accent",
  "highlight",
  "success",
  "warning",
  "danger",
  "info",
] as const;

export type SemanticColor = (typeof semanticColors)[number];

export const cssVar = (name: SemanticColor) => `var(--${name})`;