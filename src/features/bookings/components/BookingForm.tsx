import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO, startOfDay } from "date-fns";
import { Mail, Phone } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/Card";
import { DatePicker } from "@/components/ui/date-picker/DatePicker";
import { Input } from "@/components/ui/input/Input";
import { Select } from "@/components/ui/select/Select";
import { Textarea } from "@/components/ui/textarea/Textarea";
import { PriceBreakdown } from "@/features/bookings/components/PriceBreakdown";
import { calculatePrice } from "@/features/bookings/lib/pricing";
import { tours } from "@/mocks/tours";
import type { BookingInput, BookingRecord } from "@/types/booking";

const schema = z.object({
  customerName: z.string().min(2, "Enter the customer's name"),
  customerEmail: z.string().email("Enter a valid email address"),
  customerPhone: z.string().min(6, "Enter a phone number"),
  tourId: z.string().min(1, "Choose a tour"),
  travelDate: z
    .date()
    .optional()
    .refine((d) => d !== undefined, "Pick a travel date"),
  adults: z
    .string()
    .regex(/^\d+$/, "Enter a whole number")
    .refine((v) => Number(v) >= 1, "At least 1 adult is required"),
  children: z.string().regex(/^\d+$/, "Enter a whole number"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface BookingFormProps {
  mode: "create" | "edit";
  initial?: BookingRecord;
  onSubmit: (input: BookingInput) => void;
  isSubmitting: boolean;
  cancelTo: string;
}

export function BookingForm({ mode, initial, onSubmit, isSubmitting, cancelTo }: BookingFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerName: initial?.customer ?? "",
      customerEmail: initial?.customerEmail ?? "",
      customerPhone: initial?.customerPhone ?? "",
      tourId: initial?.tourId ?? "",
      travelDate: initial ? parseISO(initial.date) : undefined,
      adults: String(initial?.adults ?? 1),
      children: String(initial?.children ?? 0),
      notes: initial?.notes ?? "",
    },
  });

  const [tourId, adultsRaw, childrenRaw] = watch(["tourId", "adults", "children"]);
  const tour = tours.find((t) => t.id === tourId);
  const adults = Number(adultsRaw) || 0;
  const children = Number(childrenRaw) || 0;
  const travelers = adults + children;
  const overCapacity = tour !== undefined && travelers > tour.capacity;
  const summary = tour ? calculatePrice(tour, adults, children) : { lines: [], total: 0 };

  const today = startOfDay(new Date());
  // When editing a booking whose date has already passed, don't grey out the calendar.
  const minDate = initial && parseISO(initial.date) < today ? undefined : today;

  const tourOptions = tours
    .filter((t) => t.published || t.id === initial?.tourId)
    .map((t) => ({ value: t.id, label: `${t.name} · ${t.destination} ($${t.price})` }));

  const submit = handleSubmit((values) => {
    if (overCapacity) return;
    onSubmit({
      customerName: values.customerName.trim(),
      customerEmail: values.customerEmail.trim(),
      customerPhone: values.customerPhone.trim(),
      tourId: values.tourId,
      travelDate: format(values.travelDate as Date, "yyyy-MM-dd"),
      adults: Number(values.adults),
      children: Number(values.children),
      notes: (values.notes ?? "").trim(),
    });
  });

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FormField id="b-name" label="Full name" required error={errors.customerName?.message}>
                <Input
                  id="b-name"
                  placeholder="Jane Doe"
                  invalid={!!errors.customerName}
                  aria-describedby={errors.customerName ? "b-name-error" : undefined}
                  {...register("customerName")}
                />
              </FormField>
            </div>
            <FormField id="b-email" label="Email" required error={errors.customerEmail?.message}>
              <Input
                id="b-email"
                type="email"
                leadingIcon={<Mail />}
                placeholder="jane@example.com"
                invalid={!!errors.customerEmail}
                aria-describedby={errors.customerEmail ? "b-email-error" : undefined}
                {...register("customerEmail")}
              />
            </FormField>
            <FormField id="b-phone" label="Phone" required error={errors.customerPhone?.message}>
              <Input
                id="b-phone"
                type="tel"
                leadingIcon={<Phone />}
                placeholder="+855 12 345 678"
                invalid={!!errors.customerPhone}
                aria-describedby={errors.customerPhone ? "b-phone-error" : undefined}
                {...register("customerPhone")}
              />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trip</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FormField id="b-tour" label="Tour" required error={errors.tourId?.message}>
                <Controller
                  name="tourId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="b-tour"
                      options={tourOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Choose a tour"
                      invalid={!!errors.tourId}
                    />
                  )}
                />
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FormField id="b-date" label="Travel date" required error={errors.travelDate?.message}>
                <Controller
                  name="travelDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="b-date"
                      value={field.value}
                      onChange={field.onChange}
                      invalid={!!errors.travelDate}
                      minDate={minDate}
                    />
                  )}
                />
              </FormField>
            </div>
            <FormField
              id="b-adults"
              label="Adults"
              required
              error={errors.adults?.message ?? (overCapacity ? `This tour holds at most ${tour?.capacity} travelers` : undefined)}
            >
              <Input
                id="b-adults"
                type="number"
                min={1}
                inputMode="numeric"
                invalid={!!errors.adults || overCapacity}
                {...register("adults")}
              />
            </FormField>
            <FormField id="b-children" label="Children" hint="30% off the adult price." error={errors.children?.message}>
              <Input
                id="b-children"
                type="number"
                min={0}
                inputMode="numeric"
                invalid={!!errors.children || overCapacity}
                {...register("children")}
              />
            </FormField>
            <div className="sm:col-span-2">
              <FormField id="b-notes" label="Notes" hint="Visible to staff only.">
                <Textarea id="b-notes" placeholder="Dietary needs, pickup details…" {...register("notes")} />
              </FormField>
            </div>
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tour ? (
              <div className="space-y-1 text-sm">
                <p className="font-semibold">{tour.name}</p>
                <p className="text-foreground-muted">
                  {tour.destination} · {tour.durationDays} {tour.durationDays === 1 ? "day" : "days"}
                </p>
                <p className="text-foreground-muted">
                  {travelers} of {tour.capacity} places
                </p>
              </div>
            ) : (
              <p className="text-sm text-foreground-muted">No tour selected yet.</p>
            )}
            <PriceBreakdown summary={summary} />
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" loading={isSubmitting} disabled={overCapacity}>
            {mode === "create" ? "Create booking" : "Save changes"}
          </Button>
          <Button asChild variant="ghost">
            <Link to={cancelTo}>Cancel</Link>
          </Button>
        </div>
      </aside>
    </form>
  );
}