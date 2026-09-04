"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UtensilsCrossed, Camera, Droplets, Dumbbell, Moon, Footprints } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import Toast from "@/components/Toast";
import AddMealModal, { type AddMealInput } from "@/components/meals/AddMealModal";
import AnalyzeFoodModal, { type AnalyzedMealInput } from "@/components/meals/AnalyzeFoodModal";
import AddWaterModal from "@/components/water/AddWaterModal";
import AddExerciseModal, { type AddExerciseInput } from "@/components/exercise/AddExerciseModal";
import AddSleepModal, { type AddSleepInput } from "@/components/sleep/AddSleepModal";
import EditStepsModal from "@/components/steps/EditStepsModal";
import {
  addMealAction,
  addWaterAction,
  addExerciseAction,
  addSleepAction,
  upsertStepsAction,
} from "@/app/actions/dashboard";
import { getLocalDateString } from "@/lib/dateRange";

interface AddClientProps {
  userId: string;
  currentSteps: number;
  stepsGoal: number;
}

type ModalKind = "meal" | "photo" | "water" | "exercise" | "sleep" | "steps" | null;

export default function AddClient({ userId, currentSteps, stepsGoal }: AddClientProps) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState<ModalKind>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const finish = (message: string) => {
    setOpenModal(null);
    setToastMessage(message);
    router.refresh();
  };

  const handleAddMeal = async (meal: AddMealInput) => {
    const result = await addMealAction(meal);
    if (result?.error) return result;
    finish("Meal added");
  };

  const handleAddAnalyzedMeal = async (meal: AnalyzedMealInput) => {
    const result = await addMealAction(meal);
    if (result?.error) return result;
    finish("Meal added");
  };

  const handleAddWater = async (amountMl: number) => {
    const result = await addWaterAction(amountMl);
    if (result?.error) return result;
    finish("Water logged");
  };

  const handleAddExercise = async (input: AddExerciseInput) => {
    const result = await addExerciseAction(input);
    if (result?.error) return result;
    finish("Exercise logged");
  };

  const handleAddSleep = async (input: AddSleepInput) => {
    const result = await addSleepAction(input);
    if (result?.error) return result;
    finish("Sleep logged");
  };

  const handleUpdateSteps = async (steps: number) => {
    const result = await upsertStepsAction(steps, getLocalDateString());
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
    <DashboardLayout>
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
    </DashboardLayout>
  );
}
