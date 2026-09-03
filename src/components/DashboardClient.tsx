"use client";

import { useState } from "react";
import { Footprints, Moon, Droplets, Activity, UtensilsCrossed, Dumbbell, Users, Plus, Minus } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardHeader from "@/components/DashboardHeader";
import TimeRangeTabs from "@/components/TimeRangeTabs";
import CalorieProgressCard from "@/components/CalorieProgressCard";
import HealthMetricCard from "@/components/HealthMetricCard";
import DailyMeals from "@/components/DailyMeals";
import SocialCard from "@/components/SocialCard";
import DiscoverCard from "@/components/DiscoverCard";
import PromoCard from "@/components/PromoCard";
import { TimeRange, CalorieState, DailyStats, Meal } from "@/lib/types";
import { initialCalories, initialMeals, initialStats, rangeMultiplier } from "@/lib/mockData";

interface DashboardClientProps {
  userName: string;
}

export default function DashboardClient({ userName }: DashboardClientProps) {
  const [range, setRange] = useState<TimeRange>("today");
  const [calories, setCalories] = useState<CalorieState>(initialCalories);
  const [stats, setStats] = useState<DailyStats>(initialStats);
  const [meals, setMeals] = useState<Meal[]>(initialMeals);

  const mult = rangeMultiplier[range];
  const scaledCalories: CalorieState = {
    goal: Math.round(calories.goal * mult),
    food: Math.round(calories.food * mult),
    exercise: Math.round(calories.exercise * mult),
  };
  const scaledSteps = Math.round(stats.steps * mult);
  const scaledStepsGoal = Math.round(stats.stepsGoal * mult);
  const scaledActivityMinutes = Math.round(stats.activityMinutes * mult);
  const scaledActivityGoal = Math.round(stats.activityGoal * mult);

  const addCalories = (amount: number) => {
    setCalories((prev) => ({ ...prev, food: prev.food + amount }));
  };

  const addMeal = (meal: Omit<Meal, "id">) => {
    setMeals((prev) => [{ ...meal, id: `m${Date.now()}` }, ...prev]);
    addCalories(meal.calories);
  };

  const adjustWater = (deltaMl: number) => {
    setStats((prev) => ({
      ...prev,
      waterMl: Math.max(0, Math.min(prev.waterGoalMl, prev.waterMl + deltaMl)),
    }));
  };

  const addExercise = () => {
    setStats((prev) => ({
      ...prev,
      activityMinutes: Math.min(prev.activityGoal, prev.activityMinutes + 10),
      activityCaloriesBurned: prev.activityCaloriesBurned + 80,
    }));
    setCalories((prev) => ({ ...prev, exercise: prev.exercise + 80 }));
  };

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
            <CalorieProgressCard calories={scaledCalories} onAddCalories={addCalories} />

            <div className="grid grid-cols-2 gap-4">
              <HealthMetricCard
                icon={Footprints}
                label="Walk Steps"
                value={scaledSteps.toLocaleString()}
                sublabel={`${Math.round((scaledSteps / scaledStepsGoal) * 100)}% Goal`}
                progress={scaledSteps / scaledStepsGoal}
                bgClass="bg-yellow-bg"
                accentClass="text-yellow-accent"
                iconWrapClass="bg-white/60"
              />
              <HealthMetricCard
                icon={Moon}
                label="Sleep"
                value={`${stats.sleepHours}h ${stats.sleepMinutes}m`}
                sublabel={`${stats.sleepGoalPercent}% Goal`}
                progress={stats.sleepGoalPercent / 100}
                bgClass="bg-purple-bg"
                accentClass="text-purple-accent"
                iconWrapClass="bg-white/60"
              />
              <HealthMetricCard
                icon={Droplets}
                label="Water"
                value={`${(stats.waterMl / 1000).toFixed(1)}L`}
                sublabel={`Goal ${(stats.waterGoalMl / 1000).toFixed(1)}L`}
                progress={stats.waterMl / stats.waterGoalMl}
                bgClass="bg-blue-bg"
                accentClass="text-blue-accent"
                iconWrapClass="bg-white/60"
                action={
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => adjustWater(-250)}
                      aria-label="Remove water"
                      className="h-6 w-6 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <button
                      onClick={() => adjustWater(250)}
                      aria-label="Add water"
                      className="h-6 w-6 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                }
              />
              <HealthMetricCard
                icon={Activity}
                label="Activity"
                value={`${scaledActivityMinutes} min`}
                sublabel={`${stats.activityCaloriesBurned} kcal burned`}
                progress={scaledActivityMinutes / scaledActivityGoal}
                bgClass="bg-green-bg"
                accentClass="text-green-accent"
                iconWrapClass="bg-white/60"
                action={
                  <button
                    onClick={addExercise}
                    aria-label="Log exercise"
                    className="h-6 w-6 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                }
              />
            </div>
          </div>

          <DailyMeals meals={meals} onAddMeal={addMeal} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5 min-w-0">
          <SocialCard />

          <div>
            <h2 className="text-base font-semibold mb-3">Discover</h2>
            <div className="flex flex-col gap-3">
              <DiscoverCard
                icon={UtensilsCrossed}
                title="Meal Plans"
                description="Cook, taste, record, repeat"
                bgClass="bg-yellow-bg"
                accentClass="text-yellow-accent"
              />
              <DiscoverCard
                icon={Dumbbell}
                title="Exercise"
                description="Sweating is self-love"
                bgClass="bg-green-bg"
                accentClass="text-green-accent"
              />
              <DiscoverCard
                icon={Users}
                title="Friends"
                description="Your support squad"
                bgClass="bg-pink-bg"
                accentClass="text-pink-accent"
              />
            </div>
          </div>

          <PromoCard
            title="Feel after workout?"
            description="Track your mood to maintain an accurate history and identify changes in cortisol levels."
            ctaLabel="Check mood levels"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
