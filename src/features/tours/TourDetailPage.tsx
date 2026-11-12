import { format, parseISO } from "date-fns";
import { Check, ImageOff, Pencil, Star } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CollapsibleSection } from "@/components/shared/CollapsibleSection";
import { FieldGrid, ReadOnlyField, SubHeading } from "@/components/shared/ReadOnlyField";
import { Badge } from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/Card";
import { ImageGallery } from "@/components/ui/image-gallery/ImageGallery";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";
import { calculatePrice } from "@/features/bookings/lib/pricing";
import { DeleteTourDialog } from "@/features/tours/components/DeleteTourDialog";
import { TourLoadError } from "@/features/tours/components/TourLoadError";
import { TourStatusBadge } from "@/features/tours/components/TourStatusBadge";
import { useSetTourFeatured, useSetTourPublished, useTour } from "@/features/tours/hooks/useTours";
import { categoryLabel } from "@/features/tours/lib/constants";
import { useCurrentUser } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/formatters";
import type { TourListItem } from "@/types/tour";

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function DetailSkeleton() {
  return (
    <div role="status" aria-busy="true" className="space-y-6">
      <span className="sr-only">Loading tour…</span>
      <Skeleton className="h-9 w-72" />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-[30rem] w-full" />
      </div>
    </div>
  );
}

export function TourDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const { data: tour, isLoading, isError, error, refetch } = useTour(id);
  const publish = useSetTourPublished();
  const feature = useSetTourFeatured();
  const [deleteTarget, setDeleteTarget] = useState<TourListItem | null>(null);

  if (isLoading) return <DetailSkeleton />;
  if (isError || !tour) return <TourLoadError error={error} onRetry={() => refetch()} />;

  const canDelete = user.role === "super_admin" || user.role === "admin";
  const childPrice = Math.round(tour.price * (1 - tour.childDiscountPercent / 100));
  const example = calculatePrice(tour, 2, 1);
  const gallery = tour.images.map((img, i) => ({ src: img.url, alt: img.caption || `${tour.name}, photo ${i + 1}` }));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{tour.name}</h1>
        <TourStatusBadge published={tour.published} featured={tour.featured} />
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
        {/* On phones the summary and its actions come first. */}
        <aside className="order-1 space-y-4 lg:sticky lg:top-24 lg:order-2">
          <Card className="overflow-hidden">
            <div className="border-b px-6 py-5">
              <p className="text-3xl font-bold tabular-nums">{formatCurrency(tour.price)}</p>
              <p className="text-sm text-foreground-muted">
                per adult · {formatCurrency(childPrice)} per child ({tour.childDiscountPercent}% off)
              </p>
            </div>

            <div className="space-y-4 p-6">
              <dl className="space-y-2 text-sm">
                {[
                  ["Destination", tour.destination],
                  ["Category", categoryLabel(tour.category)],
                  ["Duration", plural(tour.durationDays, "day", "days")],
                  ["Capacity", `${tour.capacity} travelers`],
                  ["Bookings", String(tour.bookingCount)],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3">
                    <dt className="text-foreground-muted">{label}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="space-y-3 border-t pt-4">
                <Button
                  size="lg"
                  fullWidth
                  variant={tour.published ? "outline" : "primary"}
                  loading={publish.isPending}
                  onClick={() => publish.mutate({ id: tour.id, published: !tour.published })}
                >
                  {tour.published ? "Unpublish tour" : "Publish tour"}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline">
                    <Link to={`/admin/tours/${tour.id}/edit`}>
                      <Pencil className="size-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    leadingIcon={<Star className="size-4" />}
                    disabled={!tour.published && !tour.featured}
                    loading={feature.isPending}
                    onClick={() => feature.mutate({ id: tour.id, featured: !tour.featured })}
                  >
                    {tour.featured ? "Unfeature" : "Feature"}
                  </Button>
                </div>

                {canDelete && (
                  <Button
                    variant="outline"
                    fullWidth
                    className="border-danger/40 text-danger hover:bg-danger-subtle"
                    onClick={() => setDeleteTarget(tour)}
                  >
                    Delete tour
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <CardContent className="space-y-1 p-4 text-xs text-foreground-muted">
              <p>Created {format(parseISO(tour.createdAt), "MMM d, yyyy")}</p>
              <p>Last updated {format(parseISO(tour.updatedAt), "MMM d, yyyy · h:mm a")}</p>
            </CardContent>
          </Card>
        </aside>

        <div className="order-2 space-y-4 lg:order-1">
          {gallery.length > 0 ? (
            <Card>
              <CardContent className="p-4">
                <ImageGallery images={gallery} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                <ImageOff aria-hidden className="size-8 text-foreground-muted" />
                <p className="font-semibold">No photos yet</p>
                <p className="max-w-sm text-sm text-foreground-muted">A tour needs at least one photo before it can be published.</p>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/admin/tours/${tour.id}/edit`}>Add photos</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <CollapsibleSection index={1} title="Overview">
            <SubHeading>Description</SubHeading>
            <p className="text-sm leading-relaxed">
              {tour.description.trim() || <span className="text-foreground-muted">No description yet.</span>}
            </p>

            {tour.highlights.length > 0 && (
              <>
                <SubHeading className="mt-8">Highlights</SubHeading>
                <ul className="space-y-2 text-sm">
                  {tour.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
                      {h}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <SubHeading className="mt-8">At a glance</SubHeading>
            <FieldGrid>
              <ReadOnlyField label="Destination">{tour.destination}</ReadOnlyField>
              <ReadOnlyField label="Category">{categoryLabel(tour.category)}</ReadOnlyField>
              <ReadOnlyField label="Duration">{plural(tour.durationDays, "day", "days")}</ReadOnlyField>
            </FieldGrid>
          </CollapsibleSection>

          <CollapsibleSection index={2} title="Itinerary">
            {tour.itinerary.length === 0 ? (
              <p className="text-sm text-foreground-muted">No itinerary has been added yet.</p>
            ) : (
              <ol className="relative space-y-6 before:absolute before:bottom-3 before:left-4 before:top-3 before:w-px before:bg-border">
                {tour.itinerary.map((item, index) => (
                  <li key={item.id} className="relative flex gap-4">
                    <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-surface text-sm font-bold">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{item.title}</span>
                        <Badge variant="outline">{item.label}</Badge>
                      </p>
                      {item.description && <p className="mt-1 text-sm text-foreground-muted">{item.description}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </CollapsibleSection>

          <CollapsibleSection index={3} title="Pricing & capacity">
            <SubHeading>Prices</SubHeading>
            <FieldGrid>
              <ReadOnlyField label="Adult price">{formatCurrency(tour.price)}</ReadOnlyField>
              <ReadOnlyField label="Child discount">{tour.childDiscountPercent}%</ReadOnlyField>
              <ReadOnlyField label="Child price">{formatCurrency(childPrice)}</ReadOnlyField>
            </FieldGrid>

            <SubHeading className="mt-8">Capacity</SubHeading>
            <FieldGrid cols={2}>
              <ReadOnlyField label="Largest group">{plural(tour.capacity, "traveler", "travelers")}</ReadOnlyField>
              <ReadOnlyField label="Example: 2 adults + 1 child">{formatCurrency(example.total)}</ReadOnlyField>
            </FieldGrid>
          </CollapsibleSection>
        </div>
      </div>

      <DeleteTourDialog
        tour={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => navigate("/admin/tours")}
      />
    </div>
  );
}