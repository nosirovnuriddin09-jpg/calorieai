"use client";

import { useState } from "react";
import { PersonStanding, Bike, Dumbbell, Waves, Flower2, MoreHorizontal, Loader2 } from "lucide-react";
import Modal from "@/components/Modal";
import AuthField from "@/components/auth/AuthField";
import OptionCard from "@/components/onboarding/OptionCard";

export interface AddExerciseInput {
  exerciseName: string;
  durationMinutes: number;
  caloriesBurned: number;
  notes?: string;
  performedAt?: string;
}

interface AddExerciseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: AddExerciseInput) => Promise<{ error?: string } | void>;
}

const PRESETS: { label: string; icon: typeof PersonStanding }[] = [
  { label: "Running", icon: PersonStanding },
  { label: "Cycling", icon: Bike },
  { label: "Strength", icon: Dumbbell },
  { label: "Swimming", icon: Waves },
  { label: "Yoga", icon: Flower2 },
  { label: "Other", icon: MoreHorizontal },
];

function nowForDatetimeLocal(): string {
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function AddExerciseModal({ open, onClose, onSubmit }: AddExerciseModalProps) {
  const [preset, setPreset] = useState("Running");
  const [customName, setCustomName] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [notes, setNotes] = useState("");
  const [performedAt, setPerformedAt] = useState(nowForDatetimeLocal());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOther = preset === "Other";

  const reset = () => {
    setPreset("Running");
    setCustomName("");
    setDuration("");
    setCalories("");
    setNotes("");
    setPerformedAt(nowForDatetimeLocal());
    setError(null);
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const submit = async () => {
    const exerciseName = isOther ? customName.trim() : preset;
    const durationNum = parseInt(duration, 10);
    const caloriesNum = parseInt(calories, 10);

    if (!exerciseName) {
      setError("Please name your exercise.");
      return;
    }
    if (Number.isNaN(durationNum) || durationNum <= 0) {
      setError("Please provide a valid duration in minutes.");
      return;
    }
    if (Number.isNaN(caloriesNum) || caloriesNum < 0) {
      setError("Please provide a valid calories burned amount.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await onSubmit({
        exerciseName,
        durationMinutes: durationNum,
        caloriesBurned: caloriesNum,
        notes: notes.trim() || undefined,
        performedAt: new Date(performedAt).toISOString(),
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
    <Modal open={open} onClose={handleClose} title="Add exercise">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((opt) => (
            <OptionCard
              key={opt.label}
              icon={opt.icon}
              label={opt.label}
              selected={preset === opt.label}
              onClick={() => setPreset(opt.label)}
            />
          ))}
        </div>

        {isOther && (
          <AuthField
            id="exercise-name"
            label="Exercise name"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="e.g. Rock climbing"
            autoFocus
          />
        )}

        <div className="grid grid-cols-2 gap-3">
          <AuthField
            id="exercise-duration"
            label="Duration (minutes)"
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="30"
          />
          <AuthField
            id="exercise-calories"
            label="Calories burned"
            type="number"
            min={0}
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="0"
          />
        </div>

        <AuthField
          id="exercise-time"
          label="Date & time"
          type="datetime-local"
          value={performedAt}
          onChange={(e) => setPerformedAt(e.target.value)}
        />

        <AuthField
          id="exercise-notes"
          label="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did it feel?"
        />

        {error && <p className="text-sm text-pink-accent bg-pink-bg rounded-2xl px-4 py-2.5">{error}</p>}

        <button
          onClick={submit}
          disabled={submitting}
          className="h-11 rounded-full bg-cta text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          Save exercise
        </button>
      </div>
    </Modal>
  );
}
