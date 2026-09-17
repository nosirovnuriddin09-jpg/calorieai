import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addWaterAction } from "@/app/actions/dashboard";
import { queryKeys } from "@/lib/queryKeys";
import type { WaterLog } from "@/types/models";

/**
 * Optimistic: adjusting water is low-risk to predict (it's just adding a
 * number) and the dashboard's "today" water total should feel instant.
 * On error, the snapshot is restored and the real query is refetched.
 */
export function useAddWater(userId: string) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.waterByRange(userId, "today");

  return useMutation({
    mutationFn: (amountMl: number) => addWaterAction(amountMl),
    onMutate: async (amountMl: number) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);

      queryClient.setQueryData<WaterLog[]>(queryKey, (old) => {
        if (!old) return old;
        const now = new Date().toISOString();
        // Not a real row (no id from the server yet) — good enough for an
        // instant total; invalidation after settle replaces it with the
        // real log.
        const optimisticLog: WaterLog = {
          id: `optimistic-${Date.now()}`,
          user_id: userId,
          amount_ml: amountMl,
          logged_at: now,
          created_at: now,
        };
        return [...old, optimisticLog];
      });

      return { previous };
    },
    onError: (_err, _amountMl, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: (result) => {
      if (result?.error) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.water(userId) });
    },
  });
}
