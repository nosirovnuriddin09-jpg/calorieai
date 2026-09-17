// Hand-derived from supabase/migrations/0001_init_schema.sql and
// 0002_profile_default_goals.sql — the actual current schema this app's
// services/*.ts and app/actions/*.ts query against.
//
// The previous version of this file was generated against a different,
// superseded schema (see supabase/schema.sql: daily_stats, meals.eaten_at,
// profiles.tdee_goal, etc.) and didn't match the live migrations at all —
// every services/*.ts call against water_logs/exercise_logs/sleep_logs/
// step_logs/weight_logs/daily_goals failed to typecheck as a result.
//
// Regenerate this from the live project once `supabase login` / a DB
// connection string is available:
//   supabase gen types typescript --project-id <ref> --schema public > src/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          age: number | null;
          gender: Database["public"]["Enums"]["gender"] | null;
          height_cm: number | null;
          weight_kg: number | null;
          activity_level: Database["public"]["Enums"]["activity_level"] | null;
          daily_calorie_goal: number | null;
          onboarding_completed: boolean;
          default_water_goal_ml: number | null;
          default_steps_goal: number | null;
          default_sleep_goal_minutes: number | null;
          goal_type: Database["public"]["Enums"]["goal_type"] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          age?: number | null;
          gender?: Database["public"]["Enums"]["gender"] | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          activity_level?: Database["public"]["Enums"]["activity_level"] | null;
          daily_calorie_goal?: number | null;
          onboarding_completed?: boolean;
          default_water_goal_ml?: number | null;
          default_steps_goal?: number | null;
          default_sleep_goal_minutes?: number | null;
          goal_type?: Database["public"]["Enums"]["goal_type"] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          age?: number | null;
          gender?: Database["public"]["Enums"]["gender"] | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          activity_level?: Database["public"]["Enums"]["activity_level"] | null;
          daily_calorie_goal?: number | null;
          onboarding_completed?: boolean;
          default_water_goal_ml?: number | null;
          default_steps_goal?: number | null;
          default_sleep_goal_minutes?: number | null;
          goal_type?: Database["public"]["Enums"]["goal_type"] | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      meals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          meal_type: Database["public"]["Enums"]["meal_type"];
          calories: number;
          protein: number | null;
          carbs: number | null;
          fat: number | null;
          fiber: number | null;
          image_url: string | null;
          consumed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          meal_type: Database["public"]["Enums"]["meal_type"];
          calories?: number;
          protein?: number | null;
          carbs?: number | null;
          fat?: number | null;
          fiber?: number | null;
          image_url?: string | null;
          consumed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          meal_type?: Database["public"]["Enums"]["meal_type"];
          calories?: number;
          protein?: number | null;
          carbs?: number | null;
          fat?: number | null;
          fiber?: number | null;
          image_url?: string | null;
          consumed_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      water_logs: {
        Row: {
          id: string;
          user_id: string;
          amount_ml: number;
          logged_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount_ml: number;
          logged_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount_ml?: number;
          logged_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      exercise_logs: {
        Row: {
          id: string;
          user_id: string;
          exercise_name: string;
          duration_minutes: number;
          calories_burned: number;
          notes: string | null;
          performed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_name: string;
          duration_minutes: number;
          calories_burned?: number;
          notes?: string | null;
          performed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exercise_name?: string;
          duration_minutes?: number;
          calories_burned?: number;
          notes?: string | null;
          performed_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      sleep_logs: {
        Row: {
          id: string;
          user_id: string;
          sleep_duration_minutes: number;
          sleep_start: string;
          sleep_end: string;
          sleep_quality: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          sleep_duration_minutes: number;
          sleep_start: string;
          sleep_end: string;
          sleep_quality?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          sleep_duration_minutes?: number;
          sleep_start?: string;
          sleep_end?: string;
          sleep_quality?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };

      step_logs: {
        Row: {
          id: string;
          user_id: string;
          steps: number;
          logged_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          steps?: number;
          logged_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          steps?: number;
          logged_date?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      daily_goals: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          calorie_goal: number | null;
          water_goal_ml: number | null;
          steps_goal: number | null;
          sleep_goal_minutes: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date?: string;
          calorie_goal?: number | null;
          water_goal_ml?: number | null;
          steps_goal?: number | null;
          sleep_goal_minutes?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          calorie_goal?: number | null;
          water_goal_ml?: number | null;
          steps_goal?: number | null;
          sleep_goal_minutes?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      weight_logs: {
        Row: {
          id: string;
          user_id: string;
          weight_kg: number;
          logged_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          weight_kg: number;
          logged_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          weight_kg?: number;
          logged_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      gender: "male" | "female" | "other" | "prefer_not_to_say";
      activity_level: "sedentary" | "lightly_active" | "moderately_active" | "very_active";
      meal_type: "breakfast" | "lunch" | "dinner" | "snack";
      goal_type: "lose_weight" | "maintain_weight" | "gain_weight";
    };
    CompositeTypes: Record<string, never>;
  };
};

// Convenience aliases for the check-constraint "enums" above (Postgres
// doesn't have real enum types here, just text + check constraints, so
// these aren't in Database["public"]["Enums"] by codegen — they're
// declared by hand to match). Consumed by src/types/models.ts.
export type Gender = Database["public"]["Enums"]["gender"];
export type ActivityLevel = Database["public"]["Enums"]["activity_level"];
export type MealType = Database["public"]["Enums"]["meal_type"];
export type GoalType = Database["public"]["Enums"]["goal_type"];
