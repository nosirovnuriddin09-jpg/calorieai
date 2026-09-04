import { Dumbbell } from "lucide-react";
import type { ExerciseLog } from "@/types/models";

interface ExerciseHistoryListProps {
  logs: ExerciseLog[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function ExerciseHistoryList({ logs }: ExerciseHistoryListProps) {
  if (logs.length === 0) {
    return <p className="text-sm text-muted py-6 text-center">No workouts logged this week.</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      {logs.map((log) => (
        <div
          key={log.id}
          className="flex items-center gap-3 py-2.5 px-1 border-b border-black/[0.04] last:border-none"
        >
          <div className="h-9 w-9 rounded-full bg-green-bg flex items-center justify-center shrink-0">
            <Dumbbell size={15} className="text-green-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{log.exercise_name}</p>
            <p className="text-xs text-muted">{formatDate(log.performed_at)} · {log.duration_minutes} min</p>
          </div>
          <p className="text-sm font-semibold shrink-0">{log.calories_burned} kcal</p>
        </div>
      ))}
    </div>
  );
}
