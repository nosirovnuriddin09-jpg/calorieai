import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSleepAction } from "@/app/actions/dashboard";
import { queryKeys } from "@/lib/queryKeys";

export function useAddSleep(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof addSleepAction>[0]) => addSleepAction(input),
    onSuccess: (result) => {
      if (result?.error) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.sleep(userId) });
    },
  });
}
