"use client";

import { useActionState, useMemo, useState } from "react";
import { Armchair, Bike, Dumbbell, Footprints, Minus, Plus, TrendingDown, TrendingUp, Equal } from "lucide-react";
import { completeOnboarding, type OnboardingResult } from "@/app/onboarding/actions";
import { calculateSuggestedCalorieGoal } from "@/lib/calorieCalculator";
import type { ActivityLevel, Gender, GoalType } from "@/types/models";
import AuthField from "@/components/auth/AuthField";
import SubmitButton from "@/components/auth/SubmitButton";
import OptionCard from "./OptionCard";
import StepDots from "./StepDots";

interface OnboardingFlowProps {
  defaultName: string;
}

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string; description: string; icon: typeof Armchair }[] = [
  { value: "sedentary", label: "Sedentary", description: "Little to no exercise", icon: Armchair },
  { value: "lightly_active", label: "Lightly active", description: "Light exercise 1-3 days/week", icon: Footprints },
  { value: "moderately_active", label: "Moderately active", description: "Moderate exercise 3-5 days/week", icon: Bike },
  { value: "very_active", label: "Very active", description: "Hard exercise 6-7 days/week", icon: Dumbbell },
];

const GOAL_OPTIONS: { value: GoalType; label: string; description: string; icon: typeof TrendingDown }[] = [
  { value: "lose_weight", label: "Lose weight", description: "A moderate calorie deficit", icon: TrendingDown },
  { value: "maintain_weight", label: "Maintain weight", description: "Stay around your current weight", icon: Equal },
  { value: "gain_weight", label: "Gain weight", description: "A moderate calorie surplus", icon: TrendingUp },
];

const initialState: OnboardingResult = {};

export default function OnboardingFlow({ defaultName }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);

  const [fullName, setFullName] = useState(defaultName);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | "">("");
  const [goalType, setGoalType] = useState<GoalType | "">("");
  const [calorieGoal, setCalorieGoal] = useState<number | null>(null);

  const [state, formAction] = useActionState(completeOnboarding, initialState);

  const steps = [
    { title: "What's your name?", subtitle: "Let's get to know you" },
    { title: "Tell us about yourself", subtitle: "This helps us personalize your goals" },
    { title: "How active are you?", subtitle: "Pick what matches your week best" },
    { title: "What's your goal?", subtitle: "We'll suggest a daily calorie target" },
    { title: "Your daily calorie goal", subtitle: "Feel free to fine-tune this number" },
  ];

  const canContinue = useMemo(() => {
    switch (step) {
      case 0:
        return fullName.trim().length > 0;
      case 1:
        return Boolean(age && gender && heightCm && weightKg);
      case 2:
        return Boolean(activityLevel);
      case 3:
        return Boolean(goalType);
      default:
        return true;
    }
  }, [step, fullName, age, gender, heightCm, weightKg, activityLevel, goalType]);

  const goNext = () => {
    if (step === 3 && goalType && age && gender && heightCm && weightKg && activityLevel) {
      const suggested = calculateSuggestedCalorieGoal({
        age: Number(age),
        gender: gender as Gender,
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        activityLevel: activityLevel as ActivityLevel,
        goalType: goalType as GoalType,
      });
      setCalorieGoal(suggested);
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const adjustCalories = (delta: number) => {
    setCalorieGoal((c) => Math.max(800, (c ?? 0) + delta));
  };

  const current = steps[step];

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-background">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="h-11 w-11 rounded-2xl bg-foreground flex items-center justify-center text-background font-semibold text-sm">
            M
          </div>
        </div>

        <div className="bg-surface rounded-[28px] p-7 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03]">
          <StepDots total={steps.length} current={step} />

          <h1 className="text-xl font-bold text-center mb-1">{current.title}</h1>
          <p className="text-sm text-muted text-center mb-6">{current.subtitle}</p>

          <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="full_name" value={fullName} />
            <input type="hidden" name="age" value={age} />
            <input type="hidden" name="gender" value={gender} />
            <input type="hidden" name="height_cm" value={heightCm} />
            <input type="hidden" name="weight_kg" value={weightKg} />
            <input type="hidden" name="activity_level" value={activityLevel} />
            <input type="hidden" name="goal_type" value={goalType} />
            <input type="hidden" name="daily_calorie_goal" value={calorieGoal ?? ""} />

            {step === 0 && (
              <AuthField
                id="name"
                label="Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                autoFocus
              />
            )}

            {step === 1 && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <AuthField
                    id="age"
                    label="Age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="28"
                    min={1}
                    max={120}
                  />
                  <AuthField
                    id="height"
                    label="Height (cm)"
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="170"
                    min={1}
                  />
                </div>
                <AuthField
                  id="weight"
                  label="Weight (kg)"
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="65"
                  min={1}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-2 px-1">Gender</label>
                  <div className="grid grid-cols-2 gap-2">
                    {GENDER_OPTIONS.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        label={opt.label}
                        selected={gender === opt.value}
                        onClick={() => setGender(opt.value)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-2">
                {ACTIVITY_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    icon={opt.icon}
                    label={opt.label}
                    description={opt.description}
                    selected={activityLevel === opt.value}
                    onClick={() => setActivityLevel(opt.value)}
                  />
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-2">
                {GOAL_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    icon={opt.icon}
                    label={opt.label}
                    description={opt.description}
                    selected={goalType === opt.value}
                    onClick={() => setGoalType(opt.value)}
                  />
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col items-center gap-4 py-2">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => adjustCalories(-50)}
                    className="h-9 w-9 rounded-full bg-background border border-black/[0.06] flex items-center justify-center hover:bg-black/[0.03]"
                    aria-label="Decrease"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="text-center">
                    <p className="text-3xl font-bold tracking-tight">{calorieGoal}</p>
                    <p className="text-xs text-muted mt-0.5">calories / day</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => adjustCalories(50)}
                    className="h-9 w-9 rounded-full bg-background border border-black/[0.06] flex items-center justify-center hover:bg-black/[0.03]"
                    aria-label="Increase"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <p className="text-xs text-muted text-center max-w-[85%]">
                  This is an estimate based on your details. You can change it anytime from your profile.
                </p>
              </div>
            )}

            {state?.error && (
              <p className="text-sm text-pink-accent bg-pink-bg rounded-2xl px-4 py-2.5">{state.error}</p>
            )}

            <div className="flex items-center gap-3 mt-2">
              {step > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="h-11 px-5 rounded-full border border-black/[0.08] text-sm font-medium hover:bg-black/[0.02] transition-colors"
                >
                  Back
                </button>
              )}
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canContinue}
                  className="flex-1 h-11 rounded-full bg-cta text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  Continue
                </button>
              ) : (
                <div className="flex-1">
                  <SubmitButton>Get started</SubmitButton>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
