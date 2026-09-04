// Mirrors supabase/migrations/0001_init_schema.sql.
// If the schema changes, regenerate with:
//   npx supabase gen types typescript --project-id <ref> > src/types/database.ts
export type Gender = "male" | "female" | "other" | "prefer_not_to_say";
export type ActivityLevel = "sedentary" | "lightly_active" | "moderately_active" | "very_active";
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
export type GoalType = "lose_weight" | "maintain_weight" | "gain_weight";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          age: number | null;
          gender: Gender | null;
          height_cm: number | null;
          weight_kg: number | null;
          activity_level: ActivityLevel | null;
          daily_calorie_goal: number | null;
          onboarding_completed: boolean;
          default_water_goal_ml: number | null;
          default_steps_goal: number | null;
          default_sleep_goal_minutes: number | null;
          goal_type: GoalType | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          age?: number | null;
          gender?: Gender | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          activity_level?: ActivityLevel | null;
          daily_calorie_goal?: number | null;
          onboarding_completed?: boolean;
          default_water_goal_ml?: number | null;
          default_steps_goal?: number | null;
          default_sleep_goal_minutes?: number | null;
          goal_type?: GoalType | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      meals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          meal_type: MealType;
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
          meal_type: MealType;
          calories: number;
          protein?: number | null;
          carbs?: number | null;
          fat?: number | null;
          fiber?: number | null;
          image_url?: string | null;
          consumed_at?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["meals"]["Insert"]>;
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
        Update: Partial<Database["public"]["Tables"]["water_logs"]["Insert"]>;
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
        Update: Partial<Database["public"]["Tables"]["exercise_logs"]["Insert"]>;
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
        Update: Partial<Database["public"]["Tables"]["sleep_logs"]["Insert"]>;
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
        Update: Partial<Database["public"]["Tables"]["step_logs"]["Insert"]>;
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
        Update: Partial<Database["public"]["Tables"]["daily_goals"]["Insert"]>;
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
        Update: Partial<Database["public"]["Tables"]["weight_logs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
