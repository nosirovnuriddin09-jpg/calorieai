import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getProfile } from "@/services/profiles";
import { queryKeys } from "@/lib/queryKeys";
import type { Profile } from "@/types/models";

/**
 * Profile changes rarely (onboarding, occasional settings edits), so it
 * gets a much longer staleTime than day-to-day tracking data.
 */
export function useProfile(userId: string, initialProfile?: Profile | null) {
  return useQuery({
    queryKey: queryKeys.profile(userId),
    queryFn: () => {
      const supabase = createClient();
      return getProfile(supabase, userId);
    },
    initialData: initialProfile,
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
  });
}
