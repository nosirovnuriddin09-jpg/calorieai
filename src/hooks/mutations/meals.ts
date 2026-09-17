import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMealAction, updateMealAction, deleteMealAction } from "@/app/actions/dashboard";
import { queryKeys } from "@/lib/queryKeys";
import type { AddMealInput } from "@/components/meals/AddMealModal";

/**
 * Meals feed both the dashboard bundle (all three ranges) and the diary
 * (per-date). queryKeys.meals(userId) is a prefix of both
 * queryKeys.mealsByRange(...) and queryKeys.mealsByDate(...), so
 * invalidating it cascades to every range and every cached day in one
 * call — without also invalidating water/exercise/sleep/steps, which
 * didn't change.
 */
function invalidateMeals(queryClient: ReturnType<typeof useQueryClient>, userId: string) {
  queryClient.invalidateQueries({ queryKey: queryKeys.meals(userId) });
}

export function useAddMeal(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddMealInput) => addMealAction(input),
    onSuccess: (result) => {
      if (result?.error) return;
      invalidateMeals(queryClient, userId);
    },
  });
}

export function useUpdateMeal(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mealId, input }: { mealId: string; input: AddMealInput }) =>
      updateMealAction(mealId, input),
    onSuccess: (result) => {
      if (result?.error) return;
      invalidateMeals(queryClient, userId);
    },
  });
}

export function useDeleteMeal(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mealId: string) => deleteMealAction(mealId),
    onSuccess: () => {
      invalidateMeals(queryClient, userId);
    },
  });
}
