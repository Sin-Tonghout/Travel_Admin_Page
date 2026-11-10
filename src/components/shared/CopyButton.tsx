import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { IconButton } from "@/components/ui/button";
import { toast } from "@/components/ui/toast/Toaster";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied", { description: text });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy to the clipboard");
    }
  };

  return (
    <IconButton
      label={copied ? "Copied" : label}
      icon={copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      size="icon-sm"
      variant="ghost"
      onClick={copy}
    />
  );
}