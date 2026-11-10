export const typeScale = {
  display: { size: 36, weight: 700, lineHeight: 1.15, tracking: "-0.02em" },
  h1: { size: 30, weight: 700, lineHeight: 1.2, tracking: "-0.015em" },
  h2: { size: 24, weight: 700, lineHeight: 1.25, tracking: "-0.01em" },
  h3: { size: 20, weight: 600, lineHeight: 1.3, tracking: "-0.005em" },
  h4: { size: 16, weight: 600, lineHeight: 1.4, tracking: "0" },
  body: { size: 14, weight: 400, lineHeight: 1.5, tracking: "0" },
  bodyStrong: { size: 14, weight: 600, lineHeight: 1.5, tracking: "0" },
  small: { size: 12, weight: 500, lineHeight: 1.4, tracking: "0.01em" },
  caption: { size: 11, weight: 500, lineHeight: 1.4, tracking: "0.02em" },
} as const;

export type TypeToken = keyof typeof typeScale;
export const fontWeights = [400, 500, 600, 700] as const;