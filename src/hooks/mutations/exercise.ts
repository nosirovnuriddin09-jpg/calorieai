import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addExerciseAction, deleteExerciseAction } from "@/app/actions/dashboard";
import { queryKeys } from "@/lib/queryKeys";

export function useAddExercise(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof addExerciseAction>[0]) => addExerciseAction(input),
    onSuccess: (result) => {
      if (result?.error) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.exercise(userId) });
    },
  });
}

export function useDeleteExercise(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (logId: string) => deleteExerciseAction(logId),
    onSuccess: (result) => {
      if (result?.error) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.exercise(userId) });
    },
  });
}
