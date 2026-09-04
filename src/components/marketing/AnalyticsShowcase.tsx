import WeeklyBarChart from "@/components/analytics/WeeklyBarChart";
import WeightLineChart from "@/components/analytics/WeightLineChart";
import FadeInSection from "./FadeInSection";
import type { DailyPoint, WeightPoint } from "@/lib/analyticsData";

const DEMO_CALORIES: DailyPoint[] = [
  { date: "1", label: "Mon", value: 1850 },
  { date: "2", label: "Tue", value: 2100 },
  { date: "3", label: "Wed", value: 1720 },
  { date: "4", label: "Thu", value: 1950 },
  { date: "5", label: "Fri", value: 2200 },
  { date: "6", label: "Sat", value: 1600 },
  { date: "7", label: "Sun", value: 1880 },
];

const DEMO_WEIGHT: WeightPoint[] = [
  { date: "1", weightKg: 71.4 },
  { date: "2", weightKg: 71.1 },
  { date: "3", weightKg: 70.8 },
  { date: "4", weightKg: 70.9 },
  { date: "5", weightKg: 70.5 },
  { date: "6", weightKg: 70.2 },
];

export default function AnalyticsShowcase() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <FadeInSection className="text-center max-w-lg mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Look back. Learn forward.</h2>
        <p className="text-base text-muted-2 mt-4">
          Weekly patterns and trends, without digging through spreadsheets.
        </p>
      </FadeInSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-10">
        <FadeInSection>
          <div className="bg-surface rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03] h-full">
            <h3 className="text-sm font-semibold mb-4">Calories this week</h3>
            <WeeklyBarChart data={DEMO_CALORIES} color="#f5a623" unit=" kcal" />
          </div>
        </FadeInSection>

        <FadeInSection delayMs={100}>
          <div className="bg-surface rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03] h-full">
            <h3 className="text-sm font-semibold mb-4">Weight trend</h3>
            <WeightLineChart data={DEMO_WEIGHT} color="#8b6ee8" />
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
