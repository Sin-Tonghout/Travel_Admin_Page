import { Plane } from "lucide-react";
import type { ReactNode } from "react";

const rings = Array.from({ length: 11 }, (_, i) => {
  const base = 50 + i * 38;
  const points = Array.from({ length: 97 }, (_unused, k) => {
    const t = (k / 96) * Math.PI * 2;
    const r = base + 12 * Math.sin(3 * t + i * 0.6) + 7 * Math.sin(5 * t - i * 0.9);
    return `${(r * Math.cos(t)).toFixed(1)} ${(r * Math.sin(t)).toFixed(1)}`;
  });
  return `M${points.join(" L")}Z`;
});

/** Slowly turning topographic lines plus a dashed travel route. */
function TravelBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 size-[150%] -translate-x-1/2 -translate-y-1/2">
        <svg viewBox="-450 -450 900 900" className="anim-contour size-full text-sidebar-muted" fill="none" stroke="currentColor" strokeWidth={1} opacity={0.22}>
          {rings.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
      </div>
      <svg viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full text-sidebar-accent" fill="none">
        <path
          d="M60 700 C 180 520, 80 380, 260 300 S 480 160, 540 80"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="4 10"
          className="anim-route"
          opacity={0.7}
        />
        <circle cx={60} cy={700} r={6} fill="currentColor" />
        <circle cx={540} cy={80} r={6} fill="currentColor" />
      </svg>
    </div>
  );
}

function Brand({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <span className="flex size-10 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
        <Plane className="size-5" />
      </span>
      <span className="text-lg font-bold tracking-tight">Travel Admin</span>
    </div>
  );
}

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <TravelBackground />
        <Brand className="relative z-10" />
        <div className="relative z-10 max-w-md space-y-3">
          <h2 className="text-4xl font-bold leading-tight tracking-tight">Every journey, in one place.</h2>
          <p className="text-base text-sidebar-muted">
            Manage bookings, tours, destinations and payments from a single, fast admin workspace.
          </p>
        </div>
        <p className="relative z-10 text-sm text-sidebar-muted">© Travel Admin</p>
      </div>

      <div className="flex items-center justify-center bg-background p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Plane className="size-5" />
              </span>
              <span className="text-lg font-bold tracking-tight">Travel Admin</span>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}