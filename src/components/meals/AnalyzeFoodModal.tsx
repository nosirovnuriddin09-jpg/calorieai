"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, Sparkles, RotateCcw } from "lucide-react";
import Modal from "@/components/Modal";
import AuthField from "@/components/auth/AuthField";
import { createClient } from "@/lib/supabase/client";
import { uploadFoodImage } from "@/services/foodImages";
import type { FoodAnalysisResult } from "@/lib/foodAnalysisSchema";
import type { MealType } from "@/types/models";

export interface AnalyzedMealInput {
  name: string;
  mealType: MealType;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  imageUrl?: string;
}

interface AnalyzeFoodModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onSubmit: (input: AnalyzedMealInput) => Promise<{ error?: string } | void>;
}

type Stage = "select" | "uploading" | "analyzing" | "review" | "error";

const CONFIDENCE_LABEL: Record<FoodAnalysisResult["confidence"], string> = {
  low: "Low confidence",
  medium: "Medium confidence",
  high: "High confidence",
};

export default function AnalyzeFoodModal({ open, onClose, userId, onSubmit }: AnalyzeFoodModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>("select");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [fiber, setFiber] = useState("");
  const [confidence, setConfidence] = useState<FoodAnalysisResult["confidence"]>("low");
  const [description, setDescription] = useState("");

  const reset = () => {
    setStage("select");
    setPreviewUrl(null);
    setImageUrl(null);
    setErrorMessage(null);
    setName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setFiber("");
    setDescription("");
  };

  const handleClose = () => {
    if (stage === "uploading" || stage === "analyzing" || submitting) return;
    reset();
    onClose();
  };

  const handleFileSelected = async (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    setStage("uploading");
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const uploadedUrl = await uploadFoodImage(supabase, userId, file);
      setImageUrl(uploadedUrl);

      setStage("analyzing");
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/food-analysis", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      const analysis: FoodAnalysisResult = data.analysis;
      setName(analysis.food_name);
      setDescription(analysis.description);
      setCalories(String(analysis.calories));
      setProtein(String(analysis.protein));
      setCarbs(String(analysis.carbs));
      setFat(String(analysis.fat));
      setFiber(String(analysis.fiber));
      setConfidence(analysis.confidence);
      setStage("review");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
      setStage("error");
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelected(file);
    e.target.value = "";
  };

  const submit = async () => {
    const caloriesNum = parseFloat(calories);
    if (!name.trim() || Number.isNaN(caloriesNum) || caloriesNum < 0) {
      setErrorMessage("Please provide a food name and a valid calorie amount.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    try {
      const result = await onSubmit({
        name: name.trim(),
        mealType: "snack",
        calories: caloriesNum,
        protein: protein ? parseFloat(protein) : undefined,
        carbs: carbs ? parseFloat(carbs) : undefined,
        fat: fat ? parseFloat(fat) : undefined,
        fiber: fiber ? parseFloat(fiber) : undefined,
        imageUrl: imageUrl ?? undefined,
      });
      if (result?.error) {
        setErrorMessage(result.error);
        return;
      }
      reset();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Snap a meal">
      <div className="flex flex-col gap-4">
        {stage === "select" && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-black/[0.1] py-12 hover:border-black/[0.2] hover:bg-black/[0.02] transition-colors"
          >
            <div className="h-14 w-14 rounded-full bg-yellow-bg flex items-center justify-center">
              <Camera size={24} className="text-yellow-accent" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">Upload a food photo</p>
              <p className="text-xs text-muted mt-0.5">JPEG, PNG, or WebP — up to 8MB</p>
            </div>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          className="hidden"
          onChange={onFileInputChange}
        />

        {previewUrl && (stage === "uploading" || stage === "analyzing" || stage === "review" || stage === "error") && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Selected food" className="w-full h-48 object-cover rounded-2xl" />
        )}

        {stage === "uploading" && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted py-4">
            <Loader2 size={16} className="animate-spin" />
            Uploading photo…
          </div>
        )}

        {stage === "analyzing" && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted py-4">
            <Sparkles size={16} className="animate-pulse text-purple-accent" />
            Analyzing with AI…
          </div>
        )}

        {stage === "error" && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-pink-accent bg-pink-bg rounded-2xl px-4 py-2.5">{errorMessage}</p>
            <button
              type="button"
              onClick={() => {
                setStage("select");
                setPreviewUrl(null);
                setErrorMessage(null);
              }}
              className="h-10 rounded-full border border-black/[0.08] text-sm font-medium hover:bg-black/[0.02] transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} /> Try another photo
            </button>
          </div>
        )}

        {stage === "review" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 rounded-2xl bg-purple-bg px-4 py-2.5">
              <Sparkles size={14} className="text-purple-accent shrink-0" />
              <p className="text-xs text-muted-2">
                AI estimate · {CONFIDENCE_LABEL[confidence]} — review and adjust before saving
              </p>
            </div>

            {description && <p className="text-sm text-muted">{description}</p>}

            <AuthField
              id="analyzed-name"
              label="Food name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <AuthField
              id="analyzed-calories"
              label="Calories"
              type="number"
              min={0}
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />

            <div className="grid grid-cols-3 gap-3">
              <AuthField
                id="analyzed-protein"
                label="Protein (g)"
                type="number"
                min={0}
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
              <AuthField
                id="analyzed-carbs"
                label="Carbs (g)"
                type="number"
                min={0}
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />
              <AuthField
                id="analyzed-fat"
                label="Fat (g)"
                type="number"
                min={0}
                value={fat}
                onChange={(e) => setFat(e.target.value)}
              />
            </div>

            <AuthField
              id="analyzed-fiber"
              label="Fiber (g)"
              type="number"
              min={0}
              value={fiber}
              onChange={(e) => setFiber(e.target.value)}
            />

            {errorMessage && (
              <p className="text-sm text-pink-accent bg-pink-bg rounded-2xl px-4 py-2.5">{errorMessage}</p>
            )}

            <button
              onClick={submit}
              disabled={submitting}
              className="h-11 rounded-full bg-cta text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Confirm and save meal
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
