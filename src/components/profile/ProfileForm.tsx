"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { updateProfileDetails, type ProfileFormResult } from "@/app/profile/actions";
import AuthField from "@/components/auth/AuthField";
import SubmitButton from "@/components/auth/SubmitButton";
import OptionCard from "@/components/onboarding/OptionCard";
import type { ActivityLevel, Gender, Profile } from "@/types/models";

interface ProfileFormProps {
  profile: Profile;
}

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: "sedentary", label: "Sedentary" },
  { value: "lightly_active", label: "Lightly active" },
  { value: "moderately_active", label: "Moderately active" },
  { value: "very_active", label: "Very active" },
];

const initialState: ProfileFormResult = {};

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction] = useActionState(updateProfileDetails, initialState);

  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [gender, setGender] = useState<Gender | "">(profile.gender ?? "");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | "">(profile.activity_level ?? "");
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setShowSaved(true);
      const t = setTimeout(() => setShowSaved(false), 2500);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="gender" value={gender} />
      <input type="hidden" name="activity_level" value={activityLevel} />

      <section className="bg-surface rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03] flex flex-col gap-4">
        <h2 className="text-base font-semibold">Basic information</h2>

        <AuthField
          id="full_name"
          name="full_name"
          label="Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <AuthField id="age" name="age" type="number" label="Age" defaultValue={profile.age ?? ""} min={1} max={120} />
          <AuthField
            id="height_cm"
            name="height_cm"
            type="number"
            label="Height (cm)"
            defaultValue={profile.height_cm ?? ""}
            min={1}
          />
        </div>

        <AuthField
          id="weight_kg"
          name="weight_kg"
          type="number"
          label="Weight (kg)"
          defaultValue={profile.weight_kg ?? ""}
          min={1}
          step="0.1"
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
      </section>

      <section className="bg-surface rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03] flex flex-col gap-4">
        <h2 className="text-base font-semibold">Activity level</h2>
        <div className="grid grid-cols-2 gap-2">
          {ACTIVITY_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              selected={activityLevel === opt.value}
              onClick={() => setActivityLevel(opt.value)}
            />
          ))}
        </div>
      </section>

      <section className="bg-surface rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03] flex flex-col gap-4">
        <h2 className="text-base font-semibold">Daily goals</h2>
        <div className="grid grid-cols-2 gap-3">
          <AuthField
            id="daily_calorie_goal"
            name="daily_calorie_goal"
            type="number"
            label="Calories"
            defaultValue={profile.daily_calorie_goal ?? ""}
            min={800}
          />
          <AuthField
            id="default_water_goal_ml"
            name="default_water_goal_ml"
            type="number"
            label="Water (ml)"
            defaultValue={profile.default_water_goal_ml ?? ""}
            min={0}
          />
          <AuthField
            id="default_steps_goal"
            name="default_steps_goal"
            type="number"
            label="Steps"
            defaultValue={profile.default_steps_goal ?? ""}
            min={0}
          />
          <AuthField
            id="default_sleep_goal_minutes"
            name="default_sleep_goal_minutes"
            type="number"
            label="Sleep (minutes)"
            defaultValue={profile.default_sleep_goal_minutes ?? ""}
            min={0}
          />
        </div>
      </section>

      {state?.error && (
        <p className="text-sm text-pink-accent bg-pink-bg rounded-2xl px-4 py-2.5">{state.error}</p>
      )}

      <div className="flex items-center gap-3">
        <div className="w-44">
          <SubmitButton>Save changes</SubmitButton>
        </div>
        {showSaved && (
          <span className="flex items-center gap-1.5 text-sm text-green-accent">
            <CheckCircle2 size={16} /> Saved
          </span>
        )}
      </div>
    </form>
  );
}
