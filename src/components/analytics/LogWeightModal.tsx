"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "@/components/Modal";
import AuthField from "@/components/auth/AuthField";

interface LogWeightModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (weightKg: number) => Promise<{ error?: string } | void>;
}

export default function LogWeightModal({ open, onClose, onSubmit }: LogWeightModalProps) {
  const [weight, setWeight] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (submitting) return;
    setWeight("");
    setError(null);
    onClose();
  };

  const submit = async () => {
    const n = parseFloat(weight);
    if (Number.isNaN(n) || n <= 0) {
      setError("Please enter a valid weight.");
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
      setWeight("");
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Log weight">
      <div className="flex flex-col gap-4">
        <AuthField
          id="weight-kg"
          label="Weight (kg)"
          type="number"
          min={0}
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="e.g. 70.5"
          autoFocus
        />

        {error && <p className="text-sm text-pink-accent bg-pink-bg rounded-2xl px-4 py-2.5">{error}</p>}

        <button
          onClick={submit}
          disabled={submitting}
          className="h-11 rounded-full bg-cta text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          Save weight
        </button>
      </div>
    </Modal>
  );
}
