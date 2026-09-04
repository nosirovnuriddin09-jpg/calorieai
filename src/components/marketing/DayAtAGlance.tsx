import { Moon, UtensilsCrossed, Footprints, Sparkles } from "lucide-react";
import FadeInSection from "./FadeInSection";

const MOMENTS = [
  {
    time: "Morning",
    title: "Sleep",
    description: "Wake up to last night's duration and quality, logged in seconds.",
    icon: Moon,
    bg: "bg-purple-bg",
    accent: "text-purple-accent",
    preview: (
      <div className="mt-4 rounded-xl bg-white/60 p-3">
        <p className="text-[11px] text-muted-2">Total sleep</p>
        <p className="text-lg font-bold">7h 45m</p>
      </div>
    ),
  },
  {
    time: "Throughout the day",
    title: "Meals & calories",
    description: "Log meals manually or snap a photo — calories add up automatically.",
    icon: UtensilsCrossed,
    bg: "bg-yellow-bg",
    accent: "text-yellow-accent",
    preview: (
      <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-white/60 p-3">
        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-base shrink-0">🥣</div>
        <div className="min-w-0">
          <p className="text-xs font-medium truncate">Oatmeal & berries</p>
          <p className="text-[11px] text-muted-2">320 kcal</p>
        </div>
      </div>
    ),
  },
  {
    time: "Throughout the day",
    title: "Movement",
    description: "Steps and workouts feed straight into your daily energy balance.",
    icon: Footprints,
    bg: "bg-green-bg",
    accent: "text-green-accent",
    preview: (
      <div className="mt-4 rounded-xl bg-white/60 p-3">
        <p className="text-[11px] text-muted-2">Steps today</p>
        <p className="text-lg font-bold">8,214</p>
      </div>
    ),
  },
  {
    time: "Evening",
    title: "Daily progress",
    description: "See the whole day come together — food, movement, rest.",
    icon: Sparkles,
    bg: "bg-pink-bg",
    accent: "text-pink-accent",
    preview: (
      <div className="mt-4 h-1.5 w-full rounded-full bg-white/60 overflow-hidden">
        <div className="h-full w-3/4 rounded-full bg-pink-accent" />
      </div>
    ),
  },
];

export default function DayAtAGlance() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <FadeInSection>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-xl">
          Everything your day is made of.
        </h2>
      </FadeInSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {MOMENTS.map((moment, i) => (
          <FadeInSection key={moment.title} delayMs={i * 100}>
            <div className={`rounded-[24px] p-5 h-full ${moment.bg}`}>
              <p className="text-[11px] uppercase tracking-wide text-muted-2 font-medium mb-3">{moment.time}</p>
              <div className="h-9 w-9 rounded-full bg-white/60 flex items-center justify-center mb-3">
                <moment.icon size={16} className={moment.accent} />
              </div>
              <p className="text-sm font-semibold">{moment.title}</p>
              <p className="text-xs text-muted-2 mt-1 leading-relaxed">{moment.description}</p>
              {moment.preview}
            </div>
          </FadeInSection>
        ))}
      </div>
    </section>
  );
}
