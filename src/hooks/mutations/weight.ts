import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addWeightLogAction } from "@/app/actions/analytics";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Replaces AnalyticsClient's previous router.refresh() (a full RSC
 * re-render of the whole page) with a targeted invalidation of just the
 * weekly analytics query.
 */
export function useAddWeight(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (weightKg: number) => addWeightLogAction(weightKg),
    onSuccess: (result) => {
      if (result?.error) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.analyticsWeekly(userId) });
    },
  });
}
