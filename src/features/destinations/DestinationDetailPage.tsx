import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Calendar, MapPin, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";
import { Switch } from "@/components/ui/switch/Switch";
import { PageHeader } from "@/components/layout/PageHeader";
import { CambodiaMap } from "@/features/destinations/components/CambodiaMap";
import { DestinationLoadError } from "@/features/destinations/components/DestinationLoadError";
import {
  useDeleteDestination,
  useDestination,
  useSetDestinationFeatured,
  useSetDestinationPublished,
} from "@/features/destinations/hooks/useDestinations";
import { imageAlt, imageSrc } from "@/features/destinations/lib/images";

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" });

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <dt className="text-text-secondary">{label}</dt>
      <dd className="text-right font-medium text-text-primary">{children}</dd>
    </div>
  );
}

export default function DestinationDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: d, isLoading, error, refetch } = useDestination(id);
  const setPublished = useSetDestinationPublished();
  const setFeatured = useSetDestinationFeatured();
  const remove = useDeleteDestination();
  const [activeImage, setActiveImage] = useState(0);

  const back = () => navigate("/admin/destinations");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }
  if (error || !d) return <DestinationLoadError error={error} onRetry={() => refetch()} onBack={back} />;

  const images = d.images;
  const current = images[Math.min(activeImage, images.length - 1)];

  const handleDelete = () => {
    // Placeholder confirmation; swap for your DeleteDestinationDialog if you prefer.
    if (!window.confirm(`Delete "${d.name}"? This cannot be undone.`)) return;
    remove.mutate(d.id, { onSuccess: back });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={d.name}
        description={d.region}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={d.published ? "success" : "warning"}>{d.published ? "Published" : "Draft"}</Badge>
            {d.featured && <Badge variant="info">Featured</Badge>}
            <Button variant="outline" onClick={() => navigate(`/admin/destinations/${d.id}/edit`)}>
              <Pencil className="size-4" aria-hidden /> Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete} loading={remove.isPending}>
              <Trash2 className="size-4" aria-hidden /> Delete
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section aria-label="Photos" className="overflow-hidden rounded-xl border border-border bg-surface">
            {current ? (
              <>
                <img src={imageSrc(current)} alt={imageAlt(current, d.name)} className="aspect-[16/9] w-full object-cover" />
                {images.length > 1 && (
                  <ul className="flex gap-2 overflow-x-auto p-3">
                    {images.map((img, i) => (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => setActiveImage(i)}
                          aria-label={`Show photo ${i + 1}`}
                          aria-current={i === activeImage}
                          className={`block overflow-hidden rounded-md border-2 ${
                            i === activeImage ? "border-primary" : "border-transparent"
                          }`}
                        >
                          <img src={imageSrc(img)} alt="" className="h-16 w-24 object-cover" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p className="p-10 text-center text-sm text-text-secondary">No photos yet. Add some in the editor.</p>
            )}
          </section>

          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="mb-2 text-base font-semibold text-text-primary">About</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-text-primary">{d.description}</p>
            {d.highlights.length > 0 && (
              <>
                <h3 className="mb-2 mt-6 text-sm font-semibold text-text-primary">Highlights</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-text-primary">
                  {d.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-1 flex items-center gap-2 text-base font-semibold text-text-primary">
              <MapPin className="size-4" aria-hidden /> Location
            </h2>
            <CambodiaMap markers={[{ id: d.id, name: d.name, latitude: d.latitude, longitude: d.longitude }]} selectedId={d.id} />
            <dl className="mt-2 divide-y divide-border">
              <Fact label="Region">{d.region}</Fact>
              <Fact label="Coordinates">
                {d.latitude.toFixed(4)}, {d.longitude.toFixed(4)}
              </Fact>
              <Fact label="Best season">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-3.5" aria-hidden /> {d.bestSeason || "Not set"}
                </span>
              </Fact>
              <Fact label="Tours">
                {d.tourCount > 0 ? (
                  <Link className="text-text-primary underline underline-offset-2" to={`/admin/tours?destination=${encodeURIComponent(d.name)}`}>
                    {d.tourCount} {d.tourCount === 1 ? "tour" : "tours"}
                  </Link>
                ) : (
                  "None yet"
                )}
              </Fact>
              <Fact label="Updated">{fmtDate(d.updatedAt)}</Fact>
            </dl>
          </section>

          <section className="space-y-4 rounded-xl border border-border bg-surface p-5">
            <h2 className="text-base font-semibold text-text-primary">Visibility</h2>
            <label className="flex items-center justify-between gap-4 text-sm text-text-primary">
              Published
              <Switch
                checked={d.published}
                disabled={setPublished.isPending}
                onCheckedChange={(published) => setPublished.mutate({ id: d.id, published })}
                aria-label="Published"
              />
            </label>
            <label className="flex items-center justify-between gap-4 text-sm text-text-primary">
              <span>
                Featured
                {!d.published && <span className="block text-xs text-text-secondary">Publish first to feature it.</span>}
              </span>
              <Switch
                checked={d.featured}
                disabled={!d.published || setFeatured.isPending}
                onCheckedChange={(featured) => setFeatured.mutate({ id: d.id, featured })}
                aria-label="Featured"
              />
            </label>
          </section>
        </aside>
      </div>
    </div>
  );
}