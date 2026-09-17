import { MEAL_TYPE_ORDER } from "@/lib/diaryData";

// Matches the loading state DiaryClient already renders internally while
// its own query is in flight, so there's no visual mismatch/flash
// between this route-level fallback and the client-side one that takes
// over once the page has mounted.
export default function Loading() {
  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">
      {MEAL_TYPE_ORDER.map((t) => (
        <div key={t} className="h-32 rounded-[28px] bg-black/[0.04] animate-pulse" />
      ))}
    </div>
  );
}
