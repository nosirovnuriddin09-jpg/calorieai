import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getDiaryDay } from "@/lib/diaryData";
import { queryKeys } from "@/lib/queryKeys";
import { getLocalDateString } from "@/lib/dateRange";

/**
 * Keyed per-date so browsing back to a previously-viewed day serves from
 * cache instantly instead of refetching. Only today can still change from
 * outside this screen (e.g. a meal logged from Home/Add), so it gets a
 * short staleTime; past days are immutable once logged and can be cached
 * far longer.
 */
export function useDiaryDay(userId: string, date: string) {
  const isToday = date === getLocalDateString();

  return useQuery({
    queryKey: queryKeys.mealsByDate(userId, date),
    queryFn: () => {
      const supabase = createClient();
      return getDiaryDay(supabase, userId, date);
    },
    staleTime: isToday ? 15_000 : 10 * 60_000,
    enabled: Boolean(userId),
  });
}
