import { Camera, Sparkles, ArrowDown } from "lucide-react";
import FadeInSection from "./FadeInSection";

export default function FoodAnalysisStory() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <FadeInSection>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-md">
            See your food differently.
          </h2>
          <p className="text-base text-muted-2 mt-4 max-w-md leading-relaxed">
            Take a photo of your meal and get an estimated nutritional breakdown —
            calories, protein, carbs and fat, ready to log or adjust.
          </p>
          <p className="text-sm text-muted mt-4 max-w-md">
            Results are AI estimates. Always feel free to fine-tune the numbers
            before saving.
          </p>
        </FadeInSection>

        <FadeInSection delayMs={150}>
          <div className="flex flex-col items-center gap-3 max-w-xs mx-auto">
            {/* Step 1: photo */}
            <div className="w-full bg-surface rounded-[24px] p-3 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-black/[0.03]">
              <div className="h-32 w-full rounded-2xl bg-gradient-to-br from-yellow-bg via-green-bg to-blue-bg flex items-center justify-center">
                <Camera size={26} className="text-muted-2" />
              </div>
            </div>

            <ArrowDown size={16} className="text-muted" />

            {/* Step 2: analyzing */}
            <div className="w-full flex items-center justify-center gap-2 text-sm text-muted py-1">
              <Sparkles size={15} className="text-purple-accent animate-pulse" />
              Analyzing with AI…
            </div>

            <ArrowDown size={16} className="text-muted" />

            {/* Step 3: result */}
            <div className="w-full bg-surface rounded-[24px] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-black/[0.03]">
              <div className="flex items-center gap-2 rounded-2xl bg-purple-bg px-3 py-2 mb-4">
                <Sparkles size={13} className="text-purple-accent shrink-0" />
                <p className="text-[11px] text-muted-2">AI estimate · High confidence</p>
              </div>
              <p className="text-sm font-semibold mb-3">Chicken rice bowl</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold">650</span>
                <span className="text-xs text-muted">kcal</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p className="text-xs text-muted">Protein</p>
                  <p className="text-sm font-semibold">42g</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted">Carbs</p>
                  <p className="text-sm font-semibold">72g</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted">Fat</p>
                  <p className="text-sm font-semibold">18g</p>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
