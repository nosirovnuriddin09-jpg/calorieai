"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { UtensilsCrossed, Camera, Droplets, Dumbbell, Moon, Footprints } from "lucide-react";
import Toast from "@/components/Toast";
import type { AddMealInput } from "@/components/meals/AddMealModal";
import type { AnalyzedMealInput } from "@/components/meals/AnalyzeFoodModal";
import type { AddExerciseInput } from "@/components/exercise/AddExerciseModal";
import type { AddSleepInput } from "@/components/sleep/AddSleepModal";
import { useAddMeal } from "@/hooks/mutations/meals";
import { useAddWater } from "@/hooks/mutations/water";
import { useAddExercise } from "@/hooks/mutations/exercise";
import { useAddSleep } from "@/hooks/mutations/sleep";
import { useUpdateSteps } from "@/hooks/mutations/steps";
import { useStepsForDate } from "@/hooks/queries/steps";
import { getLocalDateString } from "@/lib/dateRange";

// Each modal is loaded only once the user actually opens it, instead of
// being bundled into /add's initial JS chunk. AnalyzeFoodModal is the
// heaviest of the six (Gemini photo-analysis flow, image upload) and the
// one this matters most for.
const AddMealModal = dynamic(() => import("@/components/meals/AddMealModal"));
const AnalyzeFoodModal = dynamic(() => import("@/components/meals/AnalyzeFoodModal"));
const AddWaterModal = dynamic(() => import("@/components/water/AddWaterModal"));
const AddExerciseModal = dynamic(() => import("@/components/exercise/AddExerciseModal"));
const AddSleepModal = dynamic(() => import("@/components/sleep/AddSleepModal"));
const EditStepsModal = dynamic(() => import("@/components/steps/EditStepsModal"));

interface AddClientProps {
  userId: string;
  currentSteps: number;
  stepsGoal: number;
}

type ModalKind = "meal" | "photo" | "water" | "exercise" | "sleep" | "steps" | null;

export default function AddClient({ userId, currentSteps: initialSteps, stepsGoal }: AddClientProps) {
  const [openModal, setOpenModal] = useState<ModalKind>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { data: currentSteps = initialSteps } = useStepsForDate(userId, getLocalDateString(), initialSteps);
  const addMeal = useAddMeal(userId);
  const addWater = useAddWater(userId);
  const addExercise = useAddExercise(userId);
  const addSleep = useAddSleep(userId);
  const updateSteps = useUpdateSteps(userId);

  const finish = (message: string) => {
    setOpenModal(null);
    setToastMessage(message);
  };

  const handleAddMeal = async (meal: AddMealInput) => {
    const result = await addMeal.mutateAsync(meal);
    if (result?.error) return result;
    finish("Meal added");
  };

  const handleAddAnalyzedMeal = async (meal: AnalyzedMealInput) => {
    const result = await addMeal.mutateAsync(meal);
    if (result?.error) return result;
    finish("Meal added");
  };

  const handleAddWater = async (amountMl: number) => {
    const result = await addWater.mutateAsync(amountMl);
    if (result?.error) return result;
    finish("Water logged");
  };

  const handleAddExercise = async (input: AddExerciseInput) => {
    const result = await addExercise.mutateAsync(input);
    if (result?.error) return result;
    finish("Exercise logged");
  };

  const handleAddSleep = async (input: AddSleepInput) => {
    const result = await addSleep.mutateAsync(input);
    if (result?.error) return result;
    finish("Sleep logged");
  };

  const handleUpdateSteps = async (steps: number) => {
    const result = await updateSteps.mutateAsync(steps);
    if (result?.error) return result;
    finish("Steps updated");
  };

  const tiles = [
    {
      id: "meal" as const,
      icon: UtensilsCrossed,
      label: "Add a meal",
      description: "Log calories, protein, carbs, fat & fiber",
      bg: "bg-yellow-bg",
      accent: "text-yellow-accent",
    },
    {
      id: "photo" as const,
      icon: Camera,
      label: "Snap a meal",
      description: "Let AI estimate the nutrition from a photo",
      bg: "bg-purple-bg",
      accent: "text-purple-accent",
    },
    {
      id: "water" as const,
      icon: Droplets,
      label: "Log water",
      description: "Quick amounts or a custom pour",
      bg: "bg-blue-bg",
      accent: "text-blue-accent",
    },
    {
      id: "exercise" as const,
      icon: Dumbbell,
      label: "Log exercise",
      description: "Duration, calories burned & notes",
      bg: "bg-green-bg",
      accent: "text-green-accent",
    },
    {
      id: "sleep" as const,
      icon: Moon,
      label: "Log sleep",
      description: "Bedtime, wake time & quality",
      bg: "bg-purple-bg",
      accent: "text-purple-accent",
    },
    {
      id: "steps" as const,
      icon: Footprints,
      label: "Update steps",
      description: "Set today's step count",
      bg: "bg-yellow-bg",
      accent: "text-yellow-accent",
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-5 max-w-2xl mx-auto">
        <div>
          <h1 className="text-xl font-bold">Quick add</h1>
          <p className="text-sm text-muted mt-1">Log anything in a couple of taps</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tiles.map((tile) => (
            <button
              key={tile.id}
              onClick={() => setOpenModal(tile.id)}
              className="text-left bg-surface rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow flex items-start gap-4"
            >
              <div className={`h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center ${tile.bg}`}>
                <tile.icon size={20} className={tile.accent} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{tile.label}</p>
                <p className="text-xs text-muted mt-0.5">{tile.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AddMealModal open={openModal === "meal"} onClose={() => setOpenModal(null)} onSubmit={handleAddMeal} />
      <AnalyzeFoodModal
        open={openModal === "photo"}
        onClose={() => setOpenModal(null)}
        userId={userId}
        onSubmit={handleAddAnalyzedMeal}
      />
      <AddWaterModal open={openModal === "water"} onClose={() => setOpenModal(null)} onSubmit={handleAddWater} />
      <AddExerciseModal
        open={openModal === "exercise"}
        onClose={() => setOpenModal(null)}
        onSubmit={handleAddExercise}
      />
      <AddSleepModal open={openModal === "sleep"} onClose={() => setOpenModal(null)} onSubmit={handleAddSleep} />
      <EditStepsModal
        open={openModal === "steps"}
        onClose={() => setOpenModal(null)}
        currentSteps={currentSteps}
        stepsGoal={stepsGoal}
        onSubmit={handleUpdateSteps}
      />
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </>
  );
}
