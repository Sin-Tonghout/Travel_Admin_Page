import type { TourCategory } from "@/types/tour";

export const tourCategories: { value: TourCategory; label: string }[] = [
  { value: "culture", label: "Culture" },
  { value: "adventure", label: "Adventure" },
  { value: "nature", label: "Nature" },
  { value: "city", label: "City" },
  { value: "food", label: "Food" },
];

export const categoryLabel = (category: TourCategory) =>
  tourCategories.find((c) => c.value === category)?.label ?? category;