import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { TourForm } from "@/features/tours/components/TourForm";
import { useCreateTour } from "@/features/tours/hooks/useTours";

export function NewTourPage() {
  const navigate = useNavigate();
  const create = useCreateTour();

  return (
    <>
      <PageHeader title="Add tour" description="Create a new tour or package. Save it as a draft until it's ready to publish." />
      <TourForm
        mode="create"
        cancelTo="/admin/tours"
        isSubmitting={create.isPending}
        onSubmit={(input) => create.mutate(input, { onSuccess: (tour) => navigate(`/admin/tours/${tour.id}`) })}
      />
    </>
  );
}