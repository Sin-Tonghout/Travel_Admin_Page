import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, Mail, Search } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { DatePicker } from "@/components/ui/date-picker/DatePicker";
import { Input } from "@/components/ui/input/Input";
import { Label } from "@/components/ui/label/Label";
import { MultiSelect } from "@/components/ui/multi-select/MultiSelect";
import { RadioGroup, RadioItem } from "@/components/ui/radio/RadioGroup";
import { Select } from "@/components/ui/select/Select";
import { Switch } from "@/components/ui/switch/Switch";
import { Textarea } from "@/components/ui/textarea/Textarea";
import { toast } from "@/components/ui/toast/Toaster";
import { Panel, Section } from "@/features/design-system/components/Section";

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

function Field({ id, label, required, error, hint, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="flex items-center gap-1.5 text-xs font-medium text-danger">
          <CircleAlert className="size-3.5" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-foreground-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const tourOptions = [
  { value: "angkor", label: "Angkor Sunrise Tour" },
  { value: "kulen", label: "Kulen Mountain" },
  { value: "tonle", label: "Tonle Sap Village" },
];

const schema = z.object({
  name: z.string().min(2, "Enter at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  tour: z.string().min(1, "Choose a tour"),
  date: z
    .date()
    .optional()
    .refine((d) => d !== undefined, "Pick a travel date"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function BookingForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", tour: "", notes: "" },
  });

  const onSubmit = async (values: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Booking saved", { description: `${values.name} · ${values.email}` });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field id="f-name" label="Customer name" required error={errors.name?.message}>
        <Input
          id="f-name"
          placeholder="Jane Doe"
          invalid={!!errors.name}
          aria-describedby={errors.name ? "f-name-error" : undefined}
          {...register("name")}
        />
      </Field>

      <Field id="f-email" label="Email" required error={errors.email?.message}>
        <Input
          id="f-email"
          type="email"
          placeholder="jane@example.com"
          leadingIcon={<Mail />}
          invalid={!!errors.email}
          aria-describedby={errors.email ? "f-email-error" : undefined}
          {...register("email")}
        />
      </Field>

      <Field id="f-tour" label="Tour" required error={errors.tour?.message}>
        <Controller
          name="tour"
          control={control}
          render={({ field }) => (
            <Select
              id="f-tour"
              options={tourOptions}
              value={field.value}
              onValueChange={field.onChange}
              placeholder="Choose a tour"
              invalid={!!errors.tour}
            />
          )}
        />
      </Field>

      <Field id="f-date" label="Travel date" required error={errors.date?.message}>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker id="f-date" value={field.value} onChange={field.onChange} invalid={!!errors.date} />
          )}
        />
      </Field>

      <div className="sm:col-span-2">
        <Field id="f-notes" label="Notes" hint="Visible to staff only.">
          <Textarea id="f-notes" placeholder="Dietary needs, pickup details…" {...register("notes")} />
        </Field>
      </div>

      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" loading={isSubmitting}>
          Save booking
        </Button>
        <Button type="button" variant="ghost" onClick={() => reset()}>
          Reset
        </Button>
      </div>
    </form>
  );
}

export function FormsSection() {
  const [tours, setTours] = useState<string[]>(["angkor"]);
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <Section
      id="forms"
      title="Forms"
      description="Every control in its default, invalid and disabled states, plus a real validated form (React Hook Form + Zod)."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Text inputs">
          <Field id="s-default" label="Default" hint="Helper text sits below the field.">
            <Input id="s-default" placeholder="Placeholder" aria-describedby="s-default-hint" />
          </Field>
          <Field id="s-icon" label="With icon">
            <Input id="s-icon" placeholder="Search bookings" leadingIcon={<Search />} />
          </Field>
          <Field id="s-invalid" label="Invalid" error="This email is already registered">
            <Input id="s-invalid" defaultValue="jane@example.com" invalid aria-describedby="s-invalid-error" />
          </Field>
          <Field id="s-disabled" label="Disabled">
            <Input id="s-disabled" defaultValue="Read-only value" disabled />
          </Field>
          <Field id="s-area" label="Textarea">
            <Textarea id="s-area" placeholder="Longer notes" />
          </Field>
        </Panel>

        <Panel title="Selection">
          <Field id="s-select" label="Select">
            <Select id="s-select" options={tourOptions} placeholder="Choose a tour" />
          </Field>
          <Field id="s-select-bad" label="Select (invalid)" error="Choose a tour">
            <Select id="s-select-bad" options={tourOptions} invalid />
          </Field>
          <Field id="s-multi" label="Multi-select">
            <MultiSelect options={tourOptions} value={tours} onChange={setTours} placeholder="All tours" />
          </Field>
          <Field id="s-date" label="Date picker">
            <DatePicker id="s-date" value={date} onChange={setDate} />
          </Field>
        </Panel>

        <Panel title="Checkbox, radio and switch">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox id="k1" defaultChecked />
              <Label htmlFor="k1">Checked</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="k2" />
              <Label htmlFor="k2">Unchecked</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="k3" checked="indeterminate" />
              <Label htmlFor="k3">Indeterminate</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="k4" disabled />
              <Label htmlFor="k4">Disabled</Label>
            </div>
          </div>
          <RadioGroup defaultValue="card">
            <div className="flex items-center gap-2">
              <RadioItem value="card" id="p1" />
              <Label htmlFor="p1">Card</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioItem value="bank" id="p2" />
              <Label htmlFor="p2">Bank transfer</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioItem value="cash" id="p3" disabled />
              <Label htmlFor="p3">Cash (disabled)</Label>
            </div>
          </RadioGroup>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Switch id="w1" defaultChecked />
              <Label htmlFor="w1">On</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="w2" />
              <Label htmlFor="w2">Off</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="w3" disabled />
              <Label htmlFor="w3">Disabled</Label>
            </div>
          </div>
        </Panel>

        <Panel title="Validated form">
          <p className="text-sm text-foreground-muted">Submit it empty to see the validation messages.</p>
          <BookingForm />
        </Panel>
      </div>
    </Section>
  );
}