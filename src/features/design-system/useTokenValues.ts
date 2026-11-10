import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";

/** `names` must be a stable (module-level) array. */
export function useTokenValues(names: readonly string[]) {
  const { resolvedTheme } = useTheme();
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    // Wait a frame so ThemeProvider has applied the class first.
    const id = requestAnimationFrame(() => {
      const style = getComputedStyle(document.documentElement);
      const next: Record<string, string> = {};
      names.forEach((n) => {
        next[n] = style.getPropertyValue(`--${n}`).trim();
      });
      setValues(next);
    });
    return () => cancelAnimationFrame(id);
  }, [resolvedTheme, names]);

  return values;
}