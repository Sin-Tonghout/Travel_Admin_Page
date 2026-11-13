import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input/Input";
import { Label } from "@/components/ui/label/Label";
import { Textarea } from "@/components/ui/textarea/Textarea";
import type { CustomerContactInput } from "@/features/customers/services/customerService";
import type { CustomerListItem } from "@/types/customer";

interface Props {
  customer: CustomerListItem;
  submitting: boolean;
  onSubmit: (input: CustomerContactInput) => void;
  onCancel: () => void;
}

export function CustomerContactForm({ customer, submitting, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone);
  const [notes, setNotes] = useState(customer.notes);
  const [nameError, setNameError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setNameError("Enter a name (at least 2 characters).");
      return;
    }
    setNameError("");
    onSubmit({ name, phone, notes });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <Label htmlFor="c-name">Name</Label>
        <Input
          id="c-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!nameError}
          aria-describedby={nameError ? "c-name-error" : undefined}
        />
        {nameError && (
          <p id="c-name-error" role="alert" className="mt-1 text-xs text-danger">
            {nameError}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="c-email">Email</Label>
        <Input id="c-email" value={customer.email} readOnly disabled />
        <p className="mt-1 text-xs text-text-secondary">Email identifies the customer and can't be changed here.</p>
      </div>
      <div>
        <Label htmlFor="c-phone">Phone</Label>
        <Input id="c-phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="c-notes">Internal notes</Label>
        <Textarea id="c-notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
        <p className="mt-1 text-xs text-text-secondary">Only visible to your team.</p>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Save changes
        </Button>
      </div>
    </form>
  );
}