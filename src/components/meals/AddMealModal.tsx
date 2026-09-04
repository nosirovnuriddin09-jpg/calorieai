"use client";

import { useEffect, useState } from "react";
import { Coffee, Sun, Moon, Cookie, Loader2 } from "lucide-react";
import Modal from "@/components/Modal";
import AuthField from "@/components/auth/AuthField";
import OptionCard from "@/components/onboarding/OptionCard";
import type { Meal, MealType } from "@/types/models";

export interface AddMealInput {
  name: string;
  mealType: MealType;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  consumedAt?: string;
}

interface AddMealModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: AddMealInput) => Promise<{ error?: string } | void>;
  editingMeal?: Meal | null;
}

const MEAL_TYPE_OPTIONS: { value: MealType; label: string; icon: typeof Coffee }[] = [
  { value: "breakfast", label: "Breakfast", icon: Coffee },
  { value: "lunch", label: "Lunch", icon: Sun },
  { value: "dinner", label: "Dinner", icon: Moon },
  { value: "snack", label: "Snack", icon: Cookie },
];

function nowForDatetimeLocal(): string {
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function AddMealModal({ open, onClose, onSubmit, editingMeal }: AddMealModalProps) {
  const isEditing = Boolean(editingMeal);
  const [mealType, setMealType] = useState<MealType>("snack");
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [fiber, setFiber] = useState("");
  const [consumedAt, setConsumedAt] = useState(nowForDatetimeLocal());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setMealType("snack");
    setName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setFiber("");
    setConsumedAt(nowForDatetimeLocal());
    setError(null);
  };

  useEffect(() => {
    if (open && editingMeal) {
      setMealType(editingMeal.meal_type);
      setName(editingMeal.name);
      setCalories(String(editingMeal.calories));
      setProtein(editingMeal.protein != null ? String(editingMeal.protein) : "");
      setCarbs(editingMeal.carbs != null ? String(editingMeal.carbs) : "");
      setFat(editingMeal.fat != null ? String(editingMeal.fat) : "");
      setFiber(editingMeal.fiber != null ? String(editingMeal.fiber) : "");
      setConsumedAt(toDatetimeLocal(editingMeal.consumed_at));
      setError(null);
    } else if (open && !editingMeal) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editingMeal]);

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const submit = async () => {
    const caloriesNum = parseFloat(calories);
    if (!name.trim() || Number.isNaN(caloriesNum) || caloriesNum < 0) {
      setError("Please provide a meal name and a valid calorie amount.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await onSubmit({
        name: name.trim(),
        mealType,
        calories: caloriesNum,
        protein: protein ? parseFloat(protein) : undefined,
        carbs: carbs ? parseFloat(carbs) : undefined,
        fat: fat ? parseFloat(fat) : undefined,
        fiber: fiber ? parseFloat(fiber) : undefined,
        consumedAt: new Date(consumedAt).toISOString(),
      });
      if (result?.error) {
        setError(result.error);
        return;
      }
      reset();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title={isEditing ? "Edit meal" : "Add a meal"}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2">
          {MEAL_TYPE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              selected={mealType === opt.value}
              onClick={() => setMealType(opt.value)}
            />
          ))}
        </div>

        <AuthField
          id="meal-name"
          label="Meal name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Grilled chicken salad"
          autoFocus
        />

        <div className="grid grid-cols-2 gap-3">
          <AuthField
            id="meal-calories"
            label="Calories"
            type="number"
            min={0}
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="0"
          />
          <AuthField
            id="meal-time"
            label="Date & time"
            type="datetime-local"
            value={consumedAt}
            onChange={(e) => setConsumedAt(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <AuthField
            id="meal-protein"
            label="Protein (g)"
            type="number"
            min={0}
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            placeholder="0"
          />
          <AuthField
            id="meal-carbs"
            label="Carbs (g)"
            type="number"
            min={0}
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            placeholder="0"
          />
          <AuthField
            id="meal-fat"
            label="Fat (g)"
            type="number"
            min={0}
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            placeholder="0"
          />
          <AuthField
            id="meal-fiber"
            label="Fiber (g)"
            type="number"
            min={0}
            value={fiber}
            onChange={(e) => setFiber(e.target.value)}
            placeholder="0"
          />
        </div>

        {error && <p className="text-sm text-pink-accent bg-pink-bg rounded-2xl px-4 py-2.5">{error}</p>}

        <button
          onClick={submit}
          disabled={submitting}
          className="h-11 rounded-full bg-cta text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {isEditing ? "Save changes" : "Save meal"}
        </button>
      </div>
    </Modal>
  );
}
