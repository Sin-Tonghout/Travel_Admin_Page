
import { useContext, useEffect, useRef } from "react";
import { ShortcutContext } from "@/app/providers/ShortcutProvider";
import type { ShortcutDef } from "@/lib/shortcuts";

function useShortcutContext() {
  const ctx = useContext(ShortcutContext);
  if (!ctx) throw new Error("Shortcut hooks must be used inside <ShortcutProvider>");
  return ctx;
}

/** Register several shortcuts. They are removed again when the component unmounts. */
export function useShortcuts(defs: ShortcutDef[]) {
  const ctx = useShortcutContext();
  const defsRef = useRef(defs);

  // Keep the latest handlers without re-registering on every render.
  useEffect(() => {
    defsRef.current = defs;
  });

  const signature = defs.map((d) => `${d.id}:${d.keys}`).join("|");

  useEffect(() => {
    const wrapped: ShortcutDef[] = defsRef.current.map((d) => ({
      ...d,
      handler: (e) => defsRef.current.find((x) => x.id === d.id)?.handler(e),
    }));
    return ctx.register(wrapped);
  }, [ctx, signature]);
}

export function useShortcut(def: ShortcutDef) {
  useShortcuts([def]);
}

/** Returns a function that lists the currently registered shortcuts. */
export function useShortcutList() {
  return useShortcutContext().list;
}