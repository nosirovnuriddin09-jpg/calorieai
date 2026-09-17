import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertStepsAction } from "@/app/actions/dashboard";
import { queryKeys } from "@/lib/queryKeys";
import { getLocalDateString } from "@/lib/dateRange";

/**
 * Optimistic: setting today's step count is a simple, fully-predictable
 * write (the new value IS the input), so the UI updates instantly. Backs
 * both the Add page's per-date steps query and the dashboard's "today"
 * steps-by-range query, since both read the same underlying step_logs row.
 */
export function useUpdateSteps(userId: string) {
  const queryClient = useQueryClient();
  const date = getLocalDateString();
  const stepsKey = [...queryKeys.steps(userId), "date", date] as const;
  const dashboardStepsKey = queryKeys.stepsByRange(userId, "today");

  return useMutation({
    mutationFn: (steps: number) => upsertStepsAction(steps, date),
    onMutate: async (steps: number) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: stepsKey }),
        queryClient.cancelQueries({ queryKey: dashboardStepsKey }),
      ]);

      const previousSteps = queryClient.getQueryData(stepsKey);
      const previousDashboardSteps = queryClient.getQueryData(dashboardStepsKey);

      queryClient.setQueryData(stepsKey, steps);

      return { previousSteps, previousDashboardSteps };
    },
    onError: (_err, _steps, context) => {
      if (context?.previousSteps !== undefined) {
        queryClient.setQueryData(stepsKey, context.previousSteps);
      }
      if (context?.previousDashboardSteps !== undefined) {
        queryClient.setQueryData(dashboardStepsKey, context.previousDashboardSteps);
      }
    },
    onSettled: (result) => {
      if (result?.error) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.steps(userId) });
    },
  });
}
