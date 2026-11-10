import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { MotionProvider } from "@/app/providers/MotionProvider";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { ShortcutProvider } from "@/app/providers/ShortcutProvider";
import { TooltipProvider } from "@/components/ui/tooltip/Tooltip";
import { Toaster } from "@/components/ui/toast/Toaster";
import App from "@/app/App";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <MotionProvider>
        <QueryProvider>
          <AuthProvider>
            <ShortcutProvider>
              <TooltipProvider>
                <App />
                <Toaster />
              </TooltipProvider>
            </ShortcutProvider>
          </AuthProvider>
        </QueryProvider>
      </MotionProvider>
    </ThemeProvider>
  </StrictMode>,
);