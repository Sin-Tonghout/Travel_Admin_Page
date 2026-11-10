import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { BookingForm } from "@/features/bookings/components/BookingForm";
import { useCreateBooking } from "@/features/bookings/hooks/useBookings";

export function NewBookingPage() {
  const navigate = useNavigate();
  const create = useCreateBooking();

  return (
    <>
      <PageHeader title="New booking" description="Create a reservation on behalf of a customer." />
      <BookingForm
        mode="create"
        cancelTo="/admin/bookings"
        isSubmitting={create.isPending}
        onSubmit={(input) =>
          create.mutate(input, { onSuccess: (record) => navigate(`/admin/bookings/${record.id}`) })
        }
      />
    </>
  );
}