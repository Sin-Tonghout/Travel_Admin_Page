import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva("relative inline-flex shrink-0 overflow-hidden rounded-full", {
  variants: {
    size: { sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-14 text-base" },
  },
  defaultVariants: { size: "md" },
});

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string;
  name: string;
  className?: string;
}

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

export function Avatar({ src, name, size, className }: AvatarProps) {
  return (
    <AvatarPrimitive.Root className={cn(avatarVariants({ size }), className)}>
      <AvatarPrimitive.Image src={src} alt={name} className="size-full object-cover" />
      <AvatarPrimitive.Fallback className="flex size-full items-center justify-center bg-secondary font-semibold text-secondary-foreground">
        {initials(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}