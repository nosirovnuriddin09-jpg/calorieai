"use client";

import { useState } from "react";
import { Loader2, Droplets } from "lucide-react";
import Modal from "@/components/Modal";
import AuthField from "@/components/auth/AuthField";

interface AddWaterModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (amountMl: number) => Promise<{ error?: string } | void>;
}

const QUICK_AMOUNTS = [100, 250, 500];

export default function AddWaterModal({ open, onClose, onSubmit }: AddWaterModalProps) {
  const [selected, setSelected] = useState<number | null>(250);
  const [custom, setCustom] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setSelected(250);
    setCustom("");
    setError(null);
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const chooseQuick = (amount: number) => {
    setSelected(amount);
    setCustom("");
  };

  const submit = async () => {
    const amount = custom ? parseInt(custom, 10) : selected;
    if (!amount || Number.isNaN(amount) || amount <= 0) {
      setError("Please choose or enter a valid amount.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await onSubmit(amount);
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
    <Modal open={open} onClose={handleClose} title="Log water">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
          {QUICK_AMOUNTS.map((amount) => {
            const isSelected = !custom && selected === amount;
            return (
              <button
                key={amount}
                type="button"
                onClick={() => chooseQuick(amount)}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl py-4 border transition-colors ${
                  isSelected
                    ? "bg-cta text-background border-cta"
                    : "bg-background border-black/[0.06] hover:border-black/[0.12]"
                }`}
              >
                <Droplets size={18} className={isSelected ? "text-blue-accent" : "text-blue-accent"} />
                <span className="text-sm font-semibold">+{amount}ml</span>
              </button>
            );
          })}
        </div>

        <AuthField
          id="water-custom"
          label="Custom amount (ml)"
          type="number"
          min={1}
          value={custom}
          onChange={(e) => {
            setCustom(e.target.value);
            setSelected(null);
          }}
          placeholder="e.g. 350"
        />

        {error && <p className="text-sm text-pink-accent bg-pink-bg rounded-2xl px-4 py-2.5">{error}</p>}

        <button
          onClick={submit}
          disabled={submitting}
          className="h-11 rounded-full bg-cta text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          Add water
        </button>
      </div>
    </Modal>
  );
}
