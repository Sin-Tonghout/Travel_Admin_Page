import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";

const MONTH = /^\d{4}-\d{2}$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

export function useAvailabilityParams() {
  const [params, setParams] = useSearchParams();

  const monthParam = params.get("month");
  const dateParam = params.get("date");
  const tour = params.get("tour") ?? undefined;
  const month = monthParam && MONTH.test(monthParam) ? monthParam : format(new Date(), "yyyy-MM");
  const date = dateParam && DAY.test(dateParam) ? dateParam : undefined;

  const update = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    setParams(next, { replace: true });
  };

  return {
    tour,
    month,
    date,
    setTour: (id: string) => update({ tour: id, date: undefined }),
    setMonth: (value: string) => update({ month: value, date: undefined }),
    setDate: (value: string | undefined) => update({ date: value }),
  };
}