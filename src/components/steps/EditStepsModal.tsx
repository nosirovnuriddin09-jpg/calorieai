"use client";

import { useEffect, useState } from "react";
import { Loader2, Footprints } from "lucide-react";
import Modal from "@/components/Modal";
import AuthField from "@/components/auth/AuthField";

interface EditStepsModalProps {
  open: boolean;
  onClose: () => void;
  currentSteps: number;
  stepsGoal: number;
  onSubmit: (steps: number) => Promise<{ error?: string } | void>;
}

export default function EditStepsModal({ open, onClose, currentSteps, stepsGoal, onSubmit }: EditStepsModalProps) {
  const [steps, setSteps] = useState(String(currentSteps));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSteps(String(currentSteps));
      setError(null);
    }
  }, [open, currentSteps]);

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const submit = async () => {
    const n = parseInt(steps, 10);
    if (Number.isNaN(n) || n < 0) {
      setError("Please enter a valid step count.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await onSubmit(n);
      if (result?.error) {
        setError(result.error);
        return;
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Update today's steps">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-2xl bg-yellow-bg px-4 py-3">
          <div className="h-9 w-9 rounded-full bg-white/60 flex items-center justify-center shrink-0">
            <Footprints size={16} className="text-yellow-accent" />
          </div>
          <div>
            <p className="text-xs text-muted-2">Daily goal</p>
            <p className="text-sm font-semibold">{stepsGoal.toLocaleString("en-US")} steps</p>
          </div>
        </div>

        <AuthField
          id="steps-count"
          label="Steps today"
          type="number"
          min={0}
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          placeholder="0"
          autoFocus
        />

        {error && <p className="text-sm text-pink-accent bg-pink-bg rounded-2xl px-4 py-2.5">{error}</p>}

        <button
          onClick={submit}
          disabled={submitting}
          className="h-11 rounded-full bg-cta text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          Save steps
        </button>
      </div>
    </Modal>
  );
}
