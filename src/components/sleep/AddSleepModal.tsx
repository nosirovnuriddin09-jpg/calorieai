"use client";

import { useMemo, useState } from "react";
import { Loader2, Moon } from "lucide-react";
import Modal from "@/components/Modal";
import AuthField from "@/components/auth/AuthField";
import StarRating from "./StarRating";

export interface AddSleepInput {
  sleepStart: string;
  sleepEnd: string;
  sleepQuality?: number;
}

interface AddSleepModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: AddSleepInput) => Promise<{ error?: string } | void>;
}

function toDatetimeLocal(d: Date): string {
  const copy = new Date(d);
  copy.setSeconds(0, 0);
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
  return copy.toISOString().slice(0, 16);
}

function defaultSleepStart(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(22, 30, 0, 0);
  return toDatetimeLocal(d);
}

function defaultSleepEnd(): string {
  const d = new Date();
  d.setHours(7, 0, 0, 0);
  return toDatetimeLocal(d);
}

function formatDuration(minutes: number): string {
  if (minutes <= 0) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export default function AddSleepModal({ open, onClose, onSubmit }: AddSleepModalProps) {
  const [sleepStart, setSleepStart] = useState(defaultSleepStart());
  const [sleepEnd, setSleepEnd] = useState(defaultSleepEnd());
  const [quality, setQuality] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const durationMinutes = useMemo(() => {
    const start = new Date(sleepStart).getTime();
    const end = new Date(sleepEnd).getTime();
    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 0;
    return Math.round((end - start) / 60_000);
  }, [sleepStart, sleepEnd]);

  const reset = () => {
    setSleepStart(defaultSleepStart());
    setSleepEnd(defaultSleepEnd());
    setQuality(0);
    setError(null);
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const submit = async () => {
    if (durationMinutes <= 0) {
      setError("Sleep end time must be after the start time.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await onSubmit({
        sleepStart: new Date(sleepStart).toISOString(),
        sleepEnd: new Date(sleepEnd).toISOString(),
        sleepQuality: quality || undefined,
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
    <Modal open={open} onClose={handleClose} title="Log sleep">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <AuthField
            id="sleep-start"
            label="Went to bed"
            type="datetime-local"
            value={sleepStart}
            onChange={(e) => setSleepStart(e.target.value)}
          />
          <AuthField
            id="sleep-end"
            label="Woke up"
            type="datetime-local"
            value={sleepEnd}
            onChange={(e) => setSleepEnd(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-purple-bg px-4 py-3">
          <div className="h-9 w-9 rounded-full bg-white/60 flex items-center justify-center shrink-0">
            <Moon size={16} className="text-purple-accent" />
          </div>
          <div>
            <p className="text-xs text-muted-2">Total sleep</p>
            <p className="text-sm font-semibold">{formatDuration(durationMinutes)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-2 px-1">Sleep quality (optional)</label>
          <StarRating value={quality} onChange={setQuality} />
        </div>

        {error && <p className="text-sm text-pink-accent bg-pink-bg rounded-2xl px-4 py-2.5">{error}</p>}

        <button
          onClick={submit}
          disabled={submitting}
          className="h-11 rounded-full bg-cta text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          Save sleep
        </button>
      </div>
    </Modal>
  );
}
