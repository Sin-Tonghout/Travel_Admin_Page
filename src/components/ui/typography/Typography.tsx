import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const colorVariants = {
  default: "text-foreground",
  muted: "text-foreground-muted",
  primary: "text-primary",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
} as const;

const headingVariants = cva("text-balance", {
  variants: {
    level: {
      display: "text-4xl font-bold leading-[1.15] tracking-tight",
      h1: "text-3xl font-bold leading-tight tracking-tight",
      h2: "text-2xl font-bold leading-snug tracking-tight",
      h3: "text-xl font-semibold leading-snug",
      h4: "text-base font-semibold leading-normal",
      h5: "text-sm font-semibold leading-normal",
    },
    color: colorVariants,
  },
  defaultVariants: { level: "h1", color: "default" },
});

type HeadingLevel = NonNullable<VariantProps<typeof headingVariants>["level"]>;
const tagFor: Record<HeadingLevel, ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
};

interface HeadingProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, "color">,
    VariantProps<typeof headingVariants> {
  as?: ElementType;
}

export function Heading({ level = "h1", color, as, className, ...props }: HeadingProps) {
  const Tag = as ?? tagFor[level ?? "h1"];
  return <Tag className={cn(headingVariants({ level, color }), className)} {...props} />;
}

const textVariants = cva("", {
  variants: {
    size: { base: "text-sm", sm: "text-xs", lg: "text-base" },
    weight: { regular: "font-normal", medium: "font-medium", semibold: "font-semibold", bold: "font-bold" },
    color: colorVariants,
    italic: { true: "italic" },
    align: { left: "text-left", center: "text-center", right: "text-right" },
  },
  defaultVariants: { size: "base", weight: "regular", color: "default" },
});

interface TextProps
  extends Omit<HTMLAttributes<HTMLParagraphElement>, "color">,
    VariantProps<typeof textVariants> {
  as?: ElementType;
}

export function Text({ as: Tag = "p", size, weight, color, italic, align, className, ...props }: TextProps) {
  return (
    <Tag className={cn(textVariants({ size, weight, color, italic, align }), className)} {...props} />
  );
}

export function Caption({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("text-[11px] font-medium tracking-wide text-foreground-muted", className)} {...props} />;
}

export function NumericText({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("font-bold tabular-nums tracking-tight", className)} {...props} />;
}

interface TitleProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageTitle({ title, description, actions }: TitleProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-1">
        <Heading level="h1">{title}</Heading>
        {description && <Text color="muted">{description}</Text>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionTitle({ title, description, actions }: TitleProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="space-y-0.5">
        <Heading level="h3">{title}</Heading>
        {description && <Text size="sm" color="muted">{description}</Text>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}