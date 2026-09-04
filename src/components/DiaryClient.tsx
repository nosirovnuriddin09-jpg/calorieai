"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import DiaryDateNav from "@/components/diary/DiaryDateNav";
import DiaryMealGroup from "@/components/diary/DiaryMealGroup";
import AddMealModal, { type AddMealInput } from "@/components/meals/AddMealModal";
import Toast from "@/components/Toast";
import { useDiaryDay } from "@/hooks/useDiaryDay";
import { getLocalDateString } from "@/lib/dateRange";
import { MEAL_TYPE_ORDER } from "@/lib/diaryData";
import { addMealAction, updateMealAction, deleteMealAction } from "@/app/actions/dashboard";
import type { Meal } from "@/types/models";

interface DiaryClientProps {
  userId: string;
}

export default function DiaryClient({ userId }: DiaryClientProps) {
  const [date, setDate] = useState(getLocalDateString());
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { data, loading, error } = useDiaryDay(userId, date, refreshKey);

  const bump = () => setRefreshKey((k) => k + 1);

  const openAddModal = () => {
    setEditingMeal(null);
    setModalOpen(true);
  };

  const openEditModal = (meal: Meal) => {
    setEditingMeal(meal);
    setModalOpen(true);
  };

  const handleSubmit = async (input: AddMealInput) => {
    const result = editingMeal ? await updateMealAction(editingMeal.id, input) : await addMealAction(input);
    if (result?.error) return result;
    bump();
    setToastMessage(editingMeal ? "Meal updated" : "Meal added");
  };

  const handleDelete = async (mealId: string) => {
    await deleteMealAction(mealId);
    bump();
    setToastMessage("Meal removed");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5 max-w-2xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold">Diary</h1>
            {data && <p className="text-sm text-muted mt-1">{data.totalCalories} kcal total</p>}
          </div>
          <div className="flex items-center gap-2">
            <DiaryDateNav date={date} onChange={setDate} />
            <button
              onClick={openAddModal}
              aria-label="Add meal"
              className="h-11 w-11 rounded-full bg-cta text-background flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {loading && !data && (
          <div className="flex flex-col gap-5">
            {MEAL_TYPE_ORDER.map((t) => (
              <div key={t} className="h-32 rounded-[28px] bg-black/[0.04] animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-surface rounded-[28px] p-10 text-center text-sm text-muted shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03]">
            {error}
          </div>
        )}

        {data &&
          MEAL_TYPE_ORDER.map((mealType) => (
            <DiaryMealGroup
              key={mealType}
              mealType={mealType}
              meals={data.groups[mealType]}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
      </div>

      <AddMealModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingMeal(null);
        }}
        onSubmit={handleSubmit}
        editingMeal={editingMeal}
      />
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </DashboardLayout>
  );
}
