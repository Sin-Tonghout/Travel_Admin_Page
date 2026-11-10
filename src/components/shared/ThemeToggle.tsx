import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

/* ---- Tune the speed here (seconds) ---- */
const EASE = [0.4, 0, 0.2, 1] as const;
const THUMB_DURATION = 0.6; // how long the thumb takes to slide
const ICON_DURATION = 0.8; // how long the sun <-> moon morph takes
const ICON_DELAY = 0.1; // the morph starts this long after the slide starts
const TRACK_DURATION_CLASS = "duration-500"; // track color fade (Tailwind class)

const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

/** One icon that morphs between a sun and a crescent moon. */
function SunMoonIcon({ isDark }: { isDark: boolean }) {
  const reduce = useReducedMotion();
  const maskId = useId().replace(/:/g, "");
  const transition = reduce
    ? { duration: 0 }
    : { duration: ICON_DURATION, delay: ICON_DELAY, ease: EASE };

  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      initial={false}
      animate={{ rotate: isDark ? 40 : 0 }}
      transition={transition}
      aria-hidden
    >
      <mask id={maskId}>
        <rect x="0" y="0" width="24" height="24" fill="white" stroke="none" />
        <motion.circle
          r={7}
          fill="black"
          stroke="none"
          initial={false}
          animate={{ cx: isDark ? 19 : 30, cy: isDark ? 5 : 0 }}
          transition={transition}
        />
      </mask>

      <motion.circle
        cx={12}
        cy={12}
        fill="currentColor"
        stroke="none"
        mask={`url(#${maskId})`}
        initial={false}
        animate={{ r: isDark ? 9 : 5 }}
        transition={transition}
      />

      <motion.g
        initial={false}
        animate={{
          opacity: isDark ? 0 : 1,
          scale: isDark ? 0.3 : 1,
          rotate: isDark ? 90 : 0,
        }}
        transition={transition}
      >
        {RAY_ANGLES.map((angle) => (
          <line
            key={angle}
            x1={12}
            y1={1.5}
            x2={12}
            y2={4}
            transform={`rotate(${angle} 12 12)`}
          />
        ))}
      </motion.g>
    </motion.svg>
  );
}

interface ThemeToggleProps {
  /** Show a small "Use device setting" button once the user has picked a theme. */
  showReset?: boolean;
}

export function ThemeToggle({ showReset = true }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const reduce = useReducedMotion();

  return (
    <div className="flex items-center gap-2">
      {showReset && theme !== "system" && (
        <button
          type="button"
          onClick={() => setTheme("system")}
          title="Follow your device's theme"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Monitor className="size-3.5" />
          <span className="hidden sm:inline">Use device setting</span>
        </button>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Dark mode"
        title={isDark ? "Switch to light theme" : "Switch to dark theme"}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border p-0.5",
          "transition-colors",
          TRACK_DURATION_CLASS,
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          isDark ? "bg-secondary" : "bg-surface-muted",
        )}
      >
        <motion.span
          aria-hidden
          initial={false}
          animate={{ x: isDark ? 24 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: THUMB_DURATION, ease: EASE }}
          className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
        >
          <SunMoonIcon isDark={isDark} />
        </motion.span>

        <span className="sr-only">{isDark ? "Dark theme on" : "Light theme on"}</span>
      </button>
    </div>
  );
}