import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input/Input";
import { Label } from "@/components/ui/label/Label";
import { Switch } from "@/components/ui/switch/Switch";
import { Textarea } from "@/components/ui/textarea/Textarea";
import { CambodiaMap } from "@/features/destinations/components/CambodiaMap";
import { StringListField } from "@/features/tours/components/StringListField";
import { TourImagesField } from "@/features/tours/components/TourImagesField";
import type { DestinationInput } from "@/types/destination";

interface Props {
  initial?: DestinationInput;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (input: DestinationInput) => void;
  onCancel: () => void;
}

const EMPTY: DestinationInput = {
  name: "",
  region: "",
  description: "",
  highlights: [],
  bestSeason: "",
  latitude: 12.5657,
  longitude: 104.991,
  images: [],
  published: false,
  featured: false,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-surface p-6">
      <h2 className="text-base font-semibold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

export function DestinationForm({
  initial = EMPTY,
  submitLabel,
  submitting,
  onSubmit,
  onCancel,
}: Props) {
  const [name, setName] = useState(initial.name);
  const [region, setRegion] = useState(initial.region);
  const [description, setDescription] = useState(initial.description);
  const [bestSeason, setBestSeason] = useState(initial.bestSeason);
  const [highlights, setHighlights] = useState(initial.highlights);
  const [images, setImages] = useState(initial.images);
  const [lat, setLat] = useState(String(initial.latitude));
  const [lng, setLng] = useState(String(initial.longitude));
  const [published, setPublished] = useState(initial.published);
  const [featured, setFeatured] = useState(initial.featured);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const latNum = Number(lat);
  const lngNum = Number(lng);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Enter a name (at least 2 characters).";
    if (region.trim().length < 2) next.region = "Enter the province or region.";
    if (lat.trim() === "" || !Number.isFinite(latNum) || latNum < -90 || latNum > 90)
      next.lat = "Enter a latitude between -90 and 90.";
    if (lng.trim() === "" || !Number.isFinite(lngNum) || lngNum < -180 || lngNum > 180)
      next.lng = "Enter a longitude between -180 and 180.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSubmit({
      name: name.trim(),
      region: region.trim(),
      description: description.trim(),
      highlights: highlights.map((h) => h.trim()).filter(Boolean),
      bestSeason: bestSeason.trim(),
      latitude: latNum,
      longitude: lngNum,
      images,
      published,
      featured: published && featured,
    });
  };

  const error = (key: string) =>
    errors[key] ? (
      <p id={`${key}-error`} role="alert" className="mt-1 text-xs text-danger">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <Section title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {error("name")}
          </div>
          <div>
            <Label htmlFor="region">Province / region</Label>
            <Input
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              aria-invalid={!!errors.region}
              aria-describedby={errors.region ? "region-error" : undefined}
            />
            {error("region")}
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="mt-1 text-xs text-text-secondary">
            At least 20 characters are needed to publish.
          </p>
        </div>
        <div>
          <Label htmlFor="bestSeason">Best season</Label>
          <Input
            id="bestSeason"
            placeholder="November to March"
            value={bestSeason}
            onChange={(e) => setBestSeason(e.target.value)}
          />
        </div>
        <StringListField
          value={highlights}
          onChange={setHighlights}
          itemLabel="Highlight"
          placeholder="e.g. Sunrise at Angkor Wat"
        />
      </Section>

      <Section title="Location">
        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  inputMode="decimal"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  aria-invalid={!!errors.lat}
                  aria-describedby={errors.lat ? "lat-error" : undefined}
                />
                {error("lat")}
              </div>
              <div>
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  inputMode="decimal"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  aria-invalid={!!errors.lng}
                  aria-describedby={errors.lng ? "lng-error" : undefined}
                />
                {error("lng")}
              </div>
            </div>
            <p className="text-xs text-text-secondary">
              Type the coordinates, or click the map to set them. The map is schematic, so
              use exact values for precision.
            </p>
          </div>
          <CambodiaMap
            draft={{ latitude: latNum, longitude: lngNum }}
            onPick={(la, lo) => {
              setLat(String(la));
              setLng(String(lo));
            }}
          />
        </div>
      </Section>

      <Section title="Photos">
        <TourImagesField value={images} onChange={setImages} />
        <p className="text-xs text-text-secondary">The first photo is the cover.</p>
      </Section>

      <Section title="Visibility">
        <label className="flex items-center justify-between gap-4 text-sm text-text-primary">
          Published
          <Switch
            checked={published}
            onCheckedChange={(v) => {
              setPublished(v);
              if (!v) setFeatured(false);
            }}
            aria-label="Published"
          />
        </label>
        <label className="flex items-center justify-between gap-4 text-sm text-text-primary">
          <span>
            Featured
            {!published && (
              <span className="block text-xs text-text-secondary">
                Publish first to feature it.
              </span>
            )}
          </span>
          <Switch
            checked={featured}
            disabled={!published}
            onCheckedChange={setFeatured}
            aria-label="Featured"
          />
        </label>
      </Section>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
