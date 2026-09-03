"use client";

import { useState } from "react";
import { Flame, Wheat, Beef, Droplet, Plus } from "lucide-react";
import CalorieRing from "./CalorieRing";
import { CalorieState } from "@/lib/types";

interface CalorieProgressCardProps {
  calories: CalorieState;
  onAddCalories: (amount: number) => void;
}

export default function CalorieProgressCard({ calories, onAddCalories }: CalorieProgressCardProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState("");

  const remaining = Math.max(calories.goal - calories.food + calories.exercise, 0);
  const progress = Math.min(calories.food / calories.goal, 1);

  const macros = [
    { label: "Protein", value: "40/70g", icon: Beef, color: "text-yellow-accent" },
    { label: "Carbs", value: "40/175g", icon: Wheat, color: "text-green-accent" },
    { label: "Fat", value: "40/70g", icon: Droplet, color: "text-blue-accent" },
  ];

  const submit = () => {
    const n = parseInt(amount, 10);
    if (!Number.isNaN(n) && n > 0) {
      onAddCalories(n);
      setAmount("");
      setShowAdd(false);
    }
  };

  return (
    <div className="bg-surface rounded-[28px] p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03]">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold">Calories</h2>
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="flex items-center gap-1 text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          <Plus size={14} /> Edit
        </button>
      </div>

      {showAdd && (
        <div className="mb-4 flex items-center gap-2">
          <input
            autoFocus
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Add calories eaten"
            className="flex-1 h-10 rounded-full bg-background border border-black/[0.06] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-accent/40"
          />
          <button
            onClick={submit}
            className="h-10 px-4 rounded-full bg-foreground text-background text-sm font-medium"
          >
            Add
          </button>
        </div>
      )}

      <div className="flex flex-col items-center py-2">
        <div className="relative">
          <CalorieRing progress={progress} size={220} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Flame size={20} className="text-yellow-accent mb-1" />
            <span className="text-3xl font-bold tracking-tight">{remaining}</span>
            <span className="text-xs text-muted mt-0.5">Remaining</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {macros.map((m) => (
          <div key={m.label} className="flex flex-col items-center gap-1 py-2">
            <m.icon size={16} className={m.color} />
            <span className="text-xs text-muted">{m.label}</span>
            <span className="text-sm font-semibold">{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
