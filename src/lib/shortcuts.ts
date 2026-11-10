export interface ShortcutDef {
  id: string;
  /** "mod+k", "/", "shift+?", "mod+enter", or a sequence like "g d". */
  keys: string;
  description: string;
  group: string;
  /** Return false to leave the key press alone (not prevent its default action). */
  handler: (e: KeyboardEvent) => void | boolean;
}

export const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);

interface Combo {
  mod: boolean;
  shift: boolean;
  alt: boolean;
  key: string;
}

export function parseCombo(combo: string): Combo {
  const parts = combo.toLowerCase().split("+");
  return {
    mod: parts.includes("mod"),
    shift: parts.includes("shift"),
    alt: parts.includes("alt"),
    key: parts[parts.length - 1],
  };
}

export function matchesCombo(e: KeyboardEvent, combo: Combo): boolean {
  const hasMod = e.ctrlKey || e.metaKey;
  if (combo.mod !== hasMod) return false;
  if (combo.alt !== e.altKey) return false;
  const isAlnum = /^[a-z0-9]$/i.test(combo.key);
  if (combo.shift ? !e.shiftKey : isAlnum && e.shiftKey) return false;
  return e.key.toLowerCase() === combo.key;
}

export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

/** Open dialogs, menus and lists own the keyboard, so plain-key shortcuts pause. */
export const OVERLAY_SELECTOR = '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"]';

export function formatShortcut(keys: string): string {
  if (keys.includes(" ")) {
    return keys
      .split(" ")
      .map((k) => k.toUpperCase())
      .join(" then ");
  }
  const parts = keys.split("+").map((part) => {
    switch (part.toLowerCase()) {
      case "mod":
        return isMac ? "⌘" : "Ctrl";
      case "shift":
        return isMac ? "⇧" : "Shift";
      case "alt":
        return isMac ? "⌥" : "Alt";
      case "enter":
        return isMac ? "↩" : "Enter";
      default:
        return part.length === 1 ? part.toUpperCase() : part;
    }
  });
  return parts.join(isMac ? "" : " + ");
}