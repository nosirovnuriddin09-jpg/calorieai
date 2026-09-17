import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getStepLogForDate } from "@/services/steps";
import { queryKeys } from "@/lib/queryKeys";

export function useStepsForDate(
  userId: string,
  date: string,
  initialSteps?: number
) {
  return useQuery({
    queryKey: [...queryKeys.steps(userId), "date", date],
    queryFn: async () => {
      const supabase = createClient();
      const log = await getStepLogForDate(supabase, userId, date);
      return log?.steps ?? 0;
    },
    initialData: initialSteps,
    staleTime: 15_000,
    enabled: Boolean(userId),
  });
}
