import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toParam } from "@/features/dashboard/lib/date-range";
import type { ResolvedRange } from "@/features/dashboard/lib/date-range";
import { fetchDashboard } from "@/features/dashboard/services/dashboardService";
import type { DashboardOptions } from "@/features/dashboard/services/dashboardService";
import { queryKeys } from "@/services/query-keys";

export function useDashboard(range: ResolvedRange, flags: DashboardOptions) {
  return useQuery({
    queryKey: queryKeys.dashboard(toParam(range.from), toParam(range.to), `${flags.fail ? 1 : 0}${flags.empty ? 1 : 0}`),
    queryFn: () => fetchDashboard(range, flags),
    placeholderData: keepPreviousData, // keep showing the old numbers while a new range loads
    retry: flags.fail ? 0 : 1,
  });
}