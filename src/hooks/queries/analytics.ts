import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getAnalyticsData, type AnalyticsData } from "@/lib/analyticsData";
import { queryKeys } from "@/lib/queryKeys";

/**
 * Weekly aggregates covering mostly-past days — they don't change once a
 * day is over, so this can be cached longer than "today" data. initialData
 * comes from the server-rendered page so the first paint has no loading
 * state; the query silently revalidates in the background per staleTime.
 */
export function useAnalyticsData(userId: string, initialData: AnalyticsData) {
  return useQuery({
    queryKey: queryKeys.analyticsWeekly(userId),
    queryFn: () => {
      const supabase = createClient();
      return getAnalyticsData(supabase, userId);
    },
    initialData,
    staleTime: 2 * 60_000,
    enabled: Boolean(userId),
  });
}
