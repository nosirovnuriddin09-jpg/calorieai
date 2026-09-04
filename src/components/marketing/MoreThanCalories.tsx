import { Moon, Droplets, Footprints, Dumbbell, Scale } from "lucide-react";
import FadeInSection from "./FadeInSection";

export default function MoreThanCalories() {
  return (
    <section id="progress" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <FadeInSection>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-xl">More than calories.</h2>
        <p className="text-base text-muted-2 mt-4 max-w-md">
          Water, sleep, steps, exercise and weight — the rest of the picture, in one place.
        </p>
      </FadeInSection>

      <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-[auto_auto] gap-4 mt-10">
        {/* Sleep — large, spans 2 rows on the left */}
        <FadeInSection className="col-span-2 lg:col-span-2 row-span-2">
          <div className="bg-purple-bg rounded-[28px] p-6 h-full flex flex-col justify-between min-h-[220px]">
            <div className="h-10 w-10 rounded-full bg-white/60 flex items-center justify-center">
              <Moon size={18} className="text-purple-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-2">Sleep</p>
              <p className="text-2xl font-bold mt-1">7h 45m</p>
              <p className="text-xs text-muted-2 mt-1">97% of your goal</p>
            </div>
          </div>
        </FadeInSection>

        {/* Water — top right */}
        <FadeInSection delayMs={100} className="col-span-1 lg:col-span-2">
          <div className="bg-blue-bg rounded-[24px] p-5 h-full flex flex-col justify-between min-h-[100px]">
            <div className="h-8 w-8 rounded-full bg-white/60 flex items-center justify-center">
              <Droplets size={15} className="text-blue-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-2">Water</p>
              <p className="text-lg font-bold">1.8L</p>
            </div>
          </div>
        </FadeInSection>

        {/* Steps — under water */}
        <FadeInSection delayMs={150} className="col-span-1 lg:col-span-2">
          <div className="bg-yellow-bg rounded-[24px] p-5 h-full flex flex-col justify-between min-h-[100px]">
            <div className="h-8 w-8 rounded-full bg-white/60 flex items-center justify-center">
              <Footprints size={15} className="text-yellow-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-2">Steps</p>
              <p className="text-lg font-bold">8,214</p>
            </div>
          </div>
        </FadeInSection>

        {/* Exercise — bottom left */}
        <FadeInSection delayMs={200} className="col-span-1 lg:col-span-2">
          <div className="bg-green-bg rounded-[24px] p-5 h-full flex flex-col justify-between min-h-[120px]">
            <div className="h-8 w-8 rounded-full bg-white/60 flex items-center justify-center">
              <Dumbbell size={15} className="text-green-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-2">Exercise</p>
              <p className="text-lg font-bold">35 min</p>
              <p className="text-xs text-muted-2 mt-0.5">260 kcal burned</p>
            </div>
          </div>
        </FadeInSection>

        {/* Weight progress — bottom right */}
        <FadeInSection delayMs={250} className="col-span-1 lg:col-span-2">
          <div className="bg-pink-bg rounded-[24px] p-5 h-full flex flex-col justify-between min-h-[120px]">
            <div className="h-8 w-8 rounded-full bg-white/60 flex items-center justify-center">
              <Scale size={15} className="text-pink-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-2">Weight progress</p>
              <p className="text-lg font-bold">-1.2 kg</p>
              <p className="text-xs text-muted-2 mt-0.5">over 30 days</p>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
