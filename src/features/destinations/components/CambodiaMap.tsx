import { useRef } from "react";
import { cn } from "@/lib/utils";

export interface MapMarker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  featured?: boolean;
}

interface CambodiaMapProps {
  markers?: MapMarker[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  /** When set, clicking the map reports the clicked coordinates (used by the form). */
  onPick?: (latitude: number, longitude: number) => void;
  /** A not-yet-saved position, drawn as a ring. */
  draft?: { latitude: number; longitude: number } | null;
  showLabels?: boolean;
  className?: string;
}

const BOUNDS = { minLng: 102.2, maxLng: 107.8, minLat: 10.2, maxLat: 14.9 };
const SCALE = 100; // px per degree
const WIDTH = (BOUNDS.maxLng - BOUNDS.minLng) * SCALE;
const HEIGHT = (BOUNDS.maxLat - BOUNDS.minLat) * SCALE;

const project = (latitude: number, longitude: number) => ({
  x: (longitude - BOUNDS.minLng) * SCALE,
  y: (BOUNDS.maxLat - latitude) * SCALE,
});

// Simplified border, [longitude, latitude]. Schematic only, not survey-accurate.
const OUTLINE: [number, number][] = [
  [102.35, 13.55], [102.4, 13.95], [102.55, 14.2], [103.1, 14.35], [103.8, 14.4],
  [104.5, 14.4], [105.1, 14.25], [105.7, 14.1], [106.1, 14.3], [106.5, 14.5],
  [107.1, 14.6], [107.55, 14.7], [107.5, 14.2], [107.55, 13.8], [107.5, 12.35],
  [107.3, 12.2], [106.9, 12.05], [106.6, 11.95], [106.4, 11.7], [106.1, 11.3],
  [105.8, 11.0], [105.3, 10.95], [105.0, 10.9], [104.9, 10.5], [104.5, 10.4],
  [104.0, 10.55], [103.6, 10.65], [103.2, 11.0], [102.95, 11.4], [102.9, 11.7],
  [102.75, 12.15], [102.55, 12.2], [102.45, 12.7], [102.4, 13.1],
];

const OUTLINE_PATH =
  OUTLINE.map(([lng, lat], i) => {
    const { x, y } = project(lat, lng);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ") + " Z";

const LAKE = project(12.9, 104.0);

export function CambodiaMap({
  markers = [],
  selectedId,
  onSelect,
  onPick,
  draft,
  showLabels = false,
  className,
}: CambodiaMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const handlePick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onPick || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const fx = (e.clientX - rect.left) / rect.width;
    const fy = (e.clientY - rect.top) / rect.height;
    const lng = BOUNDS.minLng + fx * (BOUNDS.maxLng - BOUNDS.minLng);
    const lat = BOUNDS.maxLat - fy * (BOUNDS.maxLat - BOUNDS.minLat);
    onPick(Number(lat.toFixed(4)), Number(lng.toFixed(4)));
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="group"
      aria-label="Map of Cambodia"
      className={cn("h-auto w-full", onPick && "cursor-crosshair", className)}
      onClick={handlePick}
    >
      <path d={OUTLINE_PATH} className="fill-primary/10 stroke-primary/40" strokeWidth={2} strokeLinejoin="round" />
      <ellipse
        cx={LAKE.x}
        cy={LAKE.y}
        rx={55}
        ry={22}
        transform={`rotate(-25 ${LAKE.x} ${LAKE.y})`}
        className="fill-info/20 stroke-info/40"
        strokeWidth={1}
      />

      {draft && Number.isFinite(draft.latitude) && Number.isFinite(draft.longitude) && (
        <circle
          cx={project(draft.latitude, draft.longitude).x}
          cy={project(draft.latitude, draft.longitude).y}
          r={11}
          className="fill-none stroke-highlight"
          strokeWidth={3}
        />
      )}

      {markers.map((m) => {
        const { x, y } = project(m.latitude, m.longitude);
        const selected = m.id === selectedId;
        const interactive = Boolean(onSelect);
        return (
          <g
            key={m.id}
            transform={`translate(${x} ${y})`}
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-label={interactive ? m.name : undefined}
            aria-pressed={interactive ? selected : undefined}
            className={cn(interactive && "cursor-pointer outline-none focus-visible:[&>circle]:stroke-primary")}
            onClick={(e) => {
              if (!interactive) return;
              e.stopPropagation();
              onSelect?.(m.id);
            }}
            onKeyDown={(e) => {
              if (interactive && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onSelect?.(m.id);
              }
            }}
          >
            <circle
              r={selected ? 10 : 7}
              className={cn(selected ? "fill-highlight" : m.featured ? "fill-accent" : "fill-primary", "stroke-background")}
              strokeWidth={2.5}
            />
            {(showLabels || selected) && (
              <text
                x={14}
                y={4}
                className="fill-current text-primary stroke-background text-[13px] font-semibold"
                strokeWidth={3}
                style={{ paintOrder: "stroke" }}
              >
                {m.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
