"use client";

import { useState } from "react";
import { Footprints, Moon, Droplets, Activity, Plus, Minus } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardHeader from "@/components/DashboardHeader";
import TimeRangeTabs from "@/components/TimeRangeTabs";
import CalorieProgressCard from "@/components/CalorieProgressCard";
import HealthMetricCard from "@/components/HealthMetricCard";
import DailyMeals from "@/components/DailyMeals";
import DashboardSidebarContent from "@/components/DashboardSidebarContent";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import Toast from "@/components/Toast";
import AddMealModal, { type AddMealInput } from "@/components/meals/AddMealModal";
import AnalyzeFoodModal, { type AnalyzedMealInput } from "@/components/meals/AnalyzeFoodModal";
import AddWaterModal from "@/components/water/AddWaterModal";
import AddExerciseModal, { type AddExerciseInput } from "@/components/exercise/AddExerciseModal";
import AddSleepModal, { type AddSleepInput } from "@/components/sleep/AddSleepModal";
import EditStepsModal from "@/components/steps/EditStepsModal";
import { useDashboardData } from "@/hooks/useDashboardData";
import { getLocalDateString } from "@/lib/dateRange";
import {
  addMealAction,
  addWaterAction,
  addExerciseAction,
  addSleepAction,
  upsertStepsAction,
  deleteMealAction,
} from "@/app/actions/dashboard";
import type { Profile, TimeRange } from "@/types/models";

interface DashboardClientProps {
  userId: string;
  userName: string;
  initialProfile: Profile | null;
}

export default function DashboardClient({ userId, userName, initialProfile }: DashboardClientProps) {
  const [range, setRange] = useState<TimeRange>("today");
  const [refreshKey, setRefreshKey] = useState(0);
  const [mealModalOpen, setMealModalOpen] = useState(false);
  const [analyzeFoodModalOpen, setAnalyzeFoodModalOpen] = useState(false);
  const [waterModalOpen, setWaterModalOpen] = useState(false);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [sleepModalOpen, setSleepModalOpen] = useState(false);
  const [stepsModalOpen, setStepsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { data, loading, error, refresh } = useDashboardData(userId, initialProfile, range, refreshKey);

  const bump = () => {
    setRefreshKey((k) => k + 1);
    refresh();
  };

  const handleAddCalories = async (amount: number) => {
    await addMealAction({ name: "Quick add", mealType: "snack", calories: amount });
    bump();
    setToastMessage("Calories added");
  };

  const handleAddMeal = async (meal: AddMealInput) => {
    const result = await addMealAction(meal);
    if (result?.error) return result;
    bump();
    setToastMessage("Meal added");
  };

  const handleAddAnalyzedMeal = async (meal: AnalyzedMealInput) => {
    const result = await addMealAction(meal);
    if (result?.error) return result;
    bump();
    setToastMessage("Meal added");
  };

  const handleDeleteMeal = async (mealId: string) => {
    await deleteMealAction(mealId);
    bump();
    setToastMessage("Meal removed");
  };

  const handleAdjustWater = async (deltaMl: number) => {
    await addWaterAction(deltaMl);
    bump();
  };

  const handleAddWater = async (amountMl: number) => {
    const result = await addWaterAction(amountMl);
    if (result?.error) return result;
    bump();
    setToastMessage("Water logged");
  };

  const handleAddExercise = async (input: AddExerciseInput) => {
    const result = await addExerciseAction(input);
    if (result?.error) return result;
    bump();
    setToastMessage("Exercise logged");
  };

  const handleAddSleep = async (input: AddSleepInput) => {
    const result = await addSleepAction(input);
    if (result?.error) return result;
    bump();
    setToastMessage("Sleep logged");
  };

  const handleUpdateSteps = async (steps: number) => {
    const result = await upsertStepsAction(steps, getLocalDateString());
    if (result?.error) return result;
    bump();
    setToastMessage("Steps updated");
  };

  if (loading && !data) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <div className="bg-surface rounded-[28px] p-10 text-center text-sm text-muted shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03]">
          {error ?? "Something went wrong loading your dashboard."}
        </div>
      </DashboardLayout>
    );
  }

  const remaining = Math.max(data.calories.goal - data.calories.food + data.calories.exercise, 0);
  const stepsPercent = data.steps.goal > 0 ? Math.round((data.steps.total / data.steps.goal) * 100) : 0;
  const sleepPercent = data.sleep.goalMinutes > 0 ? Math.round((data.sleep.totalMinutes / data.sleep.goalMinutes) * 100) : 0;
  const sleepHours = Math.floor(data.sleep.totalMinutes / 60);
  const sleepMins = data.sleep.totalMinutes % 60;

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5">
        {/* Main column */}
        <div className="flex flex-col gap-5 min-w-0">
          <DashboardHeader userName={userName} />

          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <TimeRangeTabs value={range} onChange={setRange} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-5 items-start">
            <CalorieProgressCard
              calories={{
                goal: data.calories.goal,
                food: data.calories.food,
                exercise: data.calories.exercise,
                protein: data.calories.protein,
                carbs: data.calories.carbs,
                fat: data.calories.fat,
              }}
              onAddCalories={handleAddCalories}
              readOnly={range !== "today"}
            />

            <div className="grid grid-cols-2 gap-4">
              <HealthMetricCard
                icon={Footprints}
                label="Walk Steps"
                value={data.steps.total.toLocaleString("en-US")}
                sublabel={`${stepsPercent}% Goal`}
                progress={data.steps.goal > 0 ? data.steps.total / data.steps.goal : 0}
                bgClass="bg-yellow-bg"
                accentClass="text-yellow-accent"
                iconWrapClass="bg-white/60"
                action={
                  range === "today" && (
                    <button
                      onClick={() => setStepsModalOpen(true)}
                      aria-label="Edit steps"
                      className="h-6 w-6 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  )
                }
              />
              <HealthMetricCard
                icon={Moon}
                label="Sleep"
                value={data.sleep.nightsLogged > 0 ? `${sleepHours}h ${sleepMins}m` : "No data"}
                sublabel={data.sleep.nightsLogged > 0 ? `${sleepPercent}% Goal` : "Log tonight's sleep"}
                progress={data.sleep.goalMinutes > 0 ? data.sleep.totalMinutes / data.sleep.goalMinutes : 0}
                bgClass="bg-purple-bg"
                accentClass="text-purple-accent"
                iconWrapClass="bg-white/60"
                action={
                  range === "today" && (
                    <button
                      onClick={() => setSleepModalOpen(true)}
                      aria-label="Log sleep"
                      className="h-6 w-6 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  )
                }
              />
              <HealthMetricCard
                icon={Droplets}
                label="Water"
                value={`${(data.water.totalMl / 1000).toFixed(1)}L`}
                sublabel={`Goal ${(data.water.goalMl / 1000).toFixed(1)}L`}
                progress={data.water.goalMl > 0 ? data.water.totalMl / data.water.goalMl : 0}
                bgClass="bg-blue-bg"
                accentClass="text-blue-accent"
                iconWrapClass="bg-white/60"
                action={
                  range === "today" && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleAdjustWater(-250)}
                        aria-label="Remove water"
                        className="h-6 w-6 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <button
                        onClick={() => setWaterModalOpen(true)}
                        aria-label="Add water"
                        className="h-6 w-6 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  )
                }
              />
              <HealthMetricCard
                icon={Activity}
                label="Activity"
                value={`${data.activity.totalMinutes} min`}
                sublabel={`${data.activity.caloriesBurned} kcal burned`}
                progress={data.activity.goalMinutes > 0 ? data.activity.totalMinutes / data.activity.goalMinutes : 0}
                bgClass="bg-green-bg"
                accentClass="text-green-accent"
                iconWrapClass="bg-white/60"
                action={
                  range === "today" && (
                    <button
                      onClick={() => setExerciseModalOpen(true)}
                      aria-label="Log exercise"
                      className="h-6 w-6 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  )
                }
              />
            </div>
          </div>

          <DailyMeals
            meals={data.meals}
            onAddClick={() => setMealModalOpen(true)}
            onAnalyzePhotoClick={() => setAnalyzeFoodModalOpen(true)}
            onDeleteMeal={handleDeleteMeal}
            readOnly={range !== "today"}
            emptyLabel={range === "today" ? "No meals logged yet today." : "No meals logged in this period."}
          />
        </div>

        {/* Right column — normal flow below xl; fixed-positioned duplicate takes over at xl+ */}
        <div className="flex flex-col gap-5 min-w-0 xl:hidden">
          <DashboardSidebarContent />
        </div>
      </div>

      <div className="hidden xl:flex flex-col gap-5 w-[360px] fixed top-6 right-[max(1rem,calc((100vw-1400px)/2+1rem))]">
        <DashboardSidebarContent />
      </div>

      <AddMealModal open={mealModalOpen} onClose={() => setMealModalOpen(false)} onSubmit={handleAddMeal} />
      <AnalyzeFoodModal
        open={analyzeFoodModalOpen}
        onClose={() => setAnalyzeFoodModalOpen(false)}
        userId={userId}
        onSubmit={handleAddAnalyzedMeal}
      />
      <AddWaterModal open={waterModalOpen} onClose={() => setWaterModalOpen(false)} onSubmit={handleAddWater} />
      <AddExerciseModal
        open={exerciseModalOpen}
        onClose={() => setExerciseModalOpen(false)}
        onSubmit={handleAddExercise}
      />
      <AddSleepModal open={sleepModalOpen} onClose={() => setSleepModalOpen(false)} onSubmit={handleAddSleep} />
      <EditStepsModal
        open={stepsModalOpen}
        onClose={() => setStepsModalOpen(false)}
        currentSteps={data.steps.total}
        stepsGoal={data.steps.goal}
        onSubmit={handleUpdateSteps}
      />
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </DashboardLayout>
  );
}
