import { zodResolver } from "@hookform/resolvers/zod";
import { Check, DollarSign, Percent, X } from "lucide-react";
import type { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/Card";
import { Input } from "@/components/ui/input/Input";
import { Label } from "@/components/ui/label/Label";
import { Select } from "@/components/ui/select/Select";
import { Switch } from "@/components/ui/switch/Switch";
import { Textarea } from "@/components/ui/textarea/Textarea";
import { ItineraryField } from "@/features/tours/components/ItineraryField";
import type { ItineraryErrors } from "@/features/tours/components/ItineraryField";
import { StringListField } from "@/features/tours/components/StringListField";
import { TourImagesField } from "@/features/tours/components/TourImagesField";
import { tourCategories } from "@/features/tours/lib/constants";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { destinationNames } from "@/mocks/destinations";
import type { Tour, TourCategory, TourInput } from "@/types/tour";

const wholeNumber = z.string().regex(/^\d+$/, "Enter a whole number");

const schema = z.object({
  name: z.string().min(3, "Enter at least 3 characters"),
  destination: z.string().min(1, "Choose a destination"),
  category: z.string().min(1, "Choose a category"),
  description: z.string(),
  highlights: z.array(z.string()),
  durationDays: wholeNumber.refine((v) => Number(v) >= 1, "At least 1 day"),
  price: wholeNumber.refine((v) => Number(v) >= 1, "At least $1"),
  childDiscountPercent: wholeNumber.refine((v) => Number(v) <= 90, "At most 90%"),
  capacity: wholeNumber.refine((v) => Number(v) >= 1, "At least 1 traveler"),
  itinerary: z.array(
    z.object({
      id: z.string(),
      label: z.string().min(1, "Add a day or time"),
      title: z.string().min(1, "Add a title"),
      description: z.string(),
    }),
  ),
  images: z.array(z.object({ id: z.string(), url: z.string(), caption: z.string() })),
  published: z.boolean(),
  featured: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface TourFormProps {
  mode: "create" | "edit";
  initial?: Tour;
  onSubmit: (input: TourInput) => void;
  isSubmitting: boolean;
  cancelTo: string;
}

function Section({ index, title, children }: { index: number; title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          {index}. {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">{children}</CardContent>
    </Card>
  );
}

function CheckItem({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      {ok ? (
        <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
      ) : (
        <X aria-hidden className="mt-0.5 size-4 shrink-0 text-foreground-muted" />
      )}
      <span className={cn(!ok && "text-foreground-muted")}>
        <span className="sr-only">{ok ? "Done: " : "Missing: "}</span>
        {children}
      </span>
    </li>
  );
}

export function TourForm({ mode, initial, onSubmit, isSubmitting, cancelTo }: TourFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? "",
      destination: initial?.destination ?? "",
      category: initial?.category ?? "",
      description: initial?.description ?? "",
      highlights: initial?.highlights ?? [""],
      durationDays: String(initial?.durationDays ?? 1),
      price: initial ? String(initial.price) : "",
      childDiscountPercent: String(initial?.childDiscountPercent ?? 30),
      capacity: String(initial?.capacity ?? 20),
      itinerary: initial?.itinerary ?? [],
      images: initial?.images ?? [],
      published: initial?.published ?? false,
      featured: initial?.featured ?? false,
    },
  });

  const w = watch();
  const descriptionLength = w.description.trim().length;
  const ready = descriptionLength >= 20 && w.images.length >= 1;

  const price = Number(w.price) || 0;
  const discount = Math.min(90, Number(w.childDiscountPercent) || 0);
  const childPrice = Math.round(price * (1 - discount / 100));

  const submit = handleSubmit((v) =>
    onSubmit({
      name: v.name.trim(),
      destination: v.destination,
      category: v.category as TourCategory,
      description: v.description.trim(),
      highlights: v.highlights.map((h) => h.trim()).filter(Boolean),
      durationDays: Number(v.durationDays),
      price: Number(v.price),
      childDiscountPercent: Number(v.childDiscountPercent),
      capacity: Number(v.capacity),
      itinerary: v.itinerary.map((i) => ({
        ...i,
        label: i.label.trim(),
        title: i.title.trim(),
        description: i.description.trim(),
      })),
      images: v.images,
      published: v.published,
      featured: v.published && v.featured,
    }),
  );

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="space-y-6">
        <Section index={1} title="Basics">
          <FormField id="t-name" label="Tour name" required error={errors.name?.message}>
            <Input
              id="t-name"
              placeholder="Angkor Sunrise Tour"
              invalid={!!errors.name}
              aria-describedby={errors.name ? "t-name-error" : undefined}
              {...register("name")}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="t-destination" label="Destination" required error={errors.destination?.message}>
              <Controller
                name="destination"
                control={control}
                render={({ field }) => (
                  <Select
                    id="t-destination"
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Choose a destination"
                    invalid={!!errors.destination}
                    options={destinationNames.map((d) => ({ value: d, label: d }))}
                  />
                )}
              />
            </FormField>
            <FormField id="t-category" label="Category" required error={errors.category?.message}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    id="t-category"
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Choose a category"
                    invalid={!!errors.category}
                    options={tourCategories}
                  />
                )}
              />
            </FormField>
          </div>

          <FormField
            id="t-description"
            label="Description"
            hint={`${descriptionLength} characters. At least 20 are needed to publish.`}
          >
            <Textarea
              id="t-description"
              className="min-h-32"
              placeholder="What makes this tour special?"
              aria-describedby="t-description-hint"
              {...register("description")}
            />
          </FormField>

          <div className="space-y-2">
            <Label>Highlights</Label>
            <Controller
              name="highlights"
              control={control}
              render={({ field }) => (
                <StringListField
                  value={field.value}
                  onChange={field.onChange}
                  itemLabel="Highlight"
                  addLabel="Add highlight"
                  placeholder="Private guide and hotel pickup"
                />
              )}
            />
          </div>
        </Section>

        <Section index={2} title="Photos">
          <Controller
            name="images"
            control={control}
            render={({ field }) => <TourImagesField value={field.value} onChange={field.onChange} />}
          />
        </Section>

        <Section index={3} title="Itinerary">
          <Controller
            name="itinerary"
            control={control}
            render={({ field }) => (
              <ItineraryField
                value={field.value}
                onChange={field.onChange}
                errors={errors.itinerary as unknown as ItineraryErrors}
              />
            )}
          />
        </Section>

        <Section index={4} title="Pricing & capacity">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="t-price" label="Adult price (USD)" required error={errors.price?.message}>
              <Input
                id="t-price"
                type="number"
                min={1}
                inputMode="numeric"
                leadingIcon={<DollarSign />}
                invalid={!!errors.price}
                {...register("price")}
              />
            </FormField>
            <FormField
              id="t-discount"
              label="Child discount"
              hint="Percent taken off the adult price."
              error={errors.childDiscountPercent?.message}
            >
              <Input
                id="t-discount"
                type="number"
                min={0}
                max={90}
                inputMode="numeric"
                leadingIcon={<Percent />}
                invalid={!!errors.childDiscountPercent}
                {...register("childDiscountPercent")}
              />
            </FormField>
            <FormField id="t-duration" label="Duration (days)" required error={errors.durationDays?.message}>
              <Input id="t-duration" type="number" min={1} inputMode="numeric" invalid={!!errors.durationDays} {...register("durationDays")} />
            </FormField>
            <FormField id="t-capacity" label="Capacity (travelers)" required error={errors.capacity?.message}>
              <Input id="t-capacity" type="number" min={1} inputMode="numeric" invalid={!!errors.capacity} {...register("capacity")} />
            </FormField>
          </div>
        </Section>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <Card>
          <CardHeader>
            <CardTitle>Price preview</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-foreground-muted">Adult</dt>
                <dd className="font-semibold tabular-nums">{price > 0 ? formatCurrency(price) : "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foreground-muted">Child ({discount}% off)</dt>
                <dd className="font-semibold tabular-nums">{price > 0 ? formatCurrency(childPrice) : "—"}</dd>
              </div>
              <div className="flex justify-between border-t pt-2">
                <dt className="text-foreground-muted">Group of 2 adults + 1 child</dt>
                <dd className="font-bold tabular-nums">{price > 0 ? formatCurrency(price * 2 + childPrice) : "—"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-1.5">
              <CheckItem ok={descriptionLength >= 20}>Description of at least 20 characters</CheckItem>
              <CheckItem ok={w.images.length >= 1}>At least one photo</CheckItem>
              <CheckItem ok={w.itinerary.length >= 1}>An itinerary (recommended)</CheckItem>
            </ul>

            <div className="flex items-center justify-between gap-3 border-t pt-4">
              <Label htmlFor="t-published">Published on the website</Label>
              <Controller
                name="published"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="t-published"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!ready && !field.value}
                  />
                )}
              />
            </div>
            {!ready && !w.published && (
              <p className="text-xs text-foreground-muted">Finish the checklist above to enable publishing.</p>
            )}

            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="t-featured">Featured tour</Label>
              <Controller
                name="featured"
                control={control}
                render={({ field }) => (
                  <Switch id="t-featured" checked={field.value && w.published} onCheckedChange={field.onChange} disabled={!w.published} />
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" size="lg" loading={isSubmitting}>
            {mode === "create" ? "Create tour" : "Save changes"}
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link to={cancelTo}>Cancel</Link>
          </Button>
        </div>
      </aside>
    </form>
  );
}   