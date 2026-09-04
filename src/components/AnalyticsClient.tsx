"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Scale } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import WeeklyBarChart from "@/components/analytics/WeeklyBarChart";
import WeightLineChart from "@/components/analytics/WeightLineChart";
import ExerciseHistoryList from "@/components/analytics/ExerciseHistoryList";
import NutritionAverages from "@/components/analytics/NutritionAverages";
import LogWeightModal from "@/components/analytics/LogWeightModal";
import Toast from "@/components/Toast";
import { addWeightLogAction } from "@/app/actions/analytics";
import type { AnalyticsData } from "@/lib/analyticsData";

interface AnalyticsClientProps {
  data: AnalyticsData;
}

export default function AnalyticsClient({ data }: AnalyticsClientProps) {
  const router = useRouter();
  const [weightModalOpen, setWeightModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddWeight = async (weightKg: number) => {
    const result = await addWeightLogAction(weightKg);
    if (result?.error) return result;
    setToastMessage("Weight logged");
    router.refresh();
  };

  const latestWeight = data.weightHistory[data.weightHistory.length - 1];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5 max-w-4xl mx-auto">
        <div>
          <h1 className="text-xl font-bold">Analytics</h1>
          <p className="text-sm text-muted mt-1">Your last 7 days at a glance</p>
        </div>

        <div className="bg-surface rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03]">
          <h2 className="text-base font-semibold mb-4">Calories consumed</h2>
          <WeeklyBarChart data={data.weeklyCalories} color="#f5a623" unit=" kcal" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-surface rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03]">
            <h2 className="text-base font-semibold mb-4">Water intake</h2>
            <WeeklyBarChart data={data.weeklyWater} color="#4fa8dd" unit=" ml" />
          </div>

          <div className="bg-surface rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold flex items-center gap-1.5">
                <Scale size={15} className="text-muted" /> Weight progress
              </h2>
              <div className="flex items-center gap-2">
                {latestWeight && (
                  <span className="text-xs text-muted">{latestWeight.weightKg} kg latest</span>
                )}
                <button
                  onClick={() => setWeightModalOpen(true)}
                  aria-label="Log weight"
                  className="h-7 w-7 rounded-full bg-background flex items-center justify-center hover:bg-black/[0.04] transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <WeightLineChart data={data.weightHistory} color="#8b6ee8" />
          </div>
        </div>

        <div className="bg-surface rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03]">
          <h2 className="text-base font-semibold mb-4">Nutrition averages (per logged day)</h2>
          <NutritionAverages {...data.nutritionAverages} />
        </div>

        <div className="bg-surface rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03]">
          <h2 className="text-base font-semibold mb-4">Exercise history</h2>
          <ExerciseHistoryList logs={data.exerciseHistory} />
        </div>
      </div>

      <LogWeightModal
        open={weightModalOpen}
        onClose={() => setWeightModalOpen(false)}
        onSubmit={handleAddWeight}
      />
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </DashboardLayout>
  );
}
