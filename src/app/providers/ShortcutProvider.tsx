import { createContext, useCallback, useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { isEditableTarget, matchesCombo, OVERLAY_SELECTOR, parseCombo } from "@/lib/shortcuts";
import type { ShortcutDef } from "@/lib/shortcuts";

interface ShortcutContextValue {
  register: (defs: ShortcutDef[]) => () => void;
  list: () => ShortcutDef[];
}

export const ShortcutContext = createContext<ShortcutContextValue | null>(null);

const SEQUENCE_TIMEOUT_MS = 1000;
const MODIFIER_KEYS = ["shift", "control", "alt", "meta"];

export function ShortcutProvider({ children }: { children: ReactNode }) {
  const registry = useRef(new Map<string, ShortcutDef>());
  const pending = useRef<{ key: string; at: number } | null>(null);

  const register = useCallback((defs: ShortcutDef[]) => {
    defs.forEach((d) => registry.current.set(d.id, d));
    return () => {
      defs.forEach((d) => {
        // Only remove our own entry, in case the id was re-registered meanwhile.
        if (registry.current.get(d.id) === d) registry.current.delete(d.id);
      });
    };
  }, []);

  const list = useCallback(() => Array.from(registry.current.values()), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing || e.repeat) return;
      const key = e.key.toLowerCase();
      if (MODIFIER_KEYS.includes(key)) return;

      const defs = Array.from(registry.current.values());
      const run = (d: ShortcutDef) => {
        if (d.handler(e) !== false) e.preventDefault();
      };

      // Modifier shortcuts (Ctrl/Cmd + …) work everywhere, including inside inputs.
      if (e.ctrlKey || e.metaKey) {
        pending.current = null;
        const hit = defs.find((d) => !d.keys.includes(" ") && matchesCombo(e, parseCombo(d.keys)));
        if (hit) run(hit);
        return;
      }

      // Plain keys pause while typing or while an overlay is open.
      if (isEditableTarget(e.target) || e.altKey || document.querySelector(OVERLAY_SELECTOR)) {
        pending.current = null;
        return;
      }

      // Second key of a sequence such as "g" then "d".
      const p = pending.current;
      pending.current = null;
      if (p && Date.now() - p.at < SEQUENCE_TIMEOUT_MS) {
        const seq = defs.find((d) => d.keys === `${p.key} ${key}`);
        if (seq) {
          run(seq);
          return;
        }
      }

      const single = defs.find((d) => !d.keys.includes(" ") && matchesCombo(e, parseCombo(d.keys)));
      if (single) {
        run(single);
        return;
      }

      if (defs.some((d) => d.keys.startsWith(`${key} `))) {
        pending.current = { key, at: Date.now() };
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = useMemo(() => ({ register, list }), [register, list]);

  return <ShortcutContext.Provider value={value}>{children}</ShortcutContext.Provider>;
}