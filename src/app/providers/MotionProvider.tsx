import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Shared motion settings. "user" respects the OS reduced-motion preference. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}