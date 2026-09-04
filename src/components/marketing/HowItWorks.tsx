import FadeInSection from "./FadeInSection";

const STEPS = [
  {
    number: "01",
    title: "Add your meal",
    description: "Type it in or take a photo.",
  },
  {
    number: "02",
    title: "Keep living",
    description: "Track water, movement and rest as your day goes on.",
  },
  {
    number: "03",
    title: "See the bigger picture",
    description: "Understand your habits over time.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
        {STEPS.map((step, i) => (
          <FadeInSection key={step.number} delayMs={i * 120}>
            <p className="text-5xl sm:text-6xl font-bold tracking-tight text-black/[0.08]">{step.number}</p>
            <h3 className="text-xl font-semibold mt-3">{step.title}</h3>
            <p className="text-sm text-muted-2 mt-2 leading-relaxed max-w-xs">{step.description}</p>
          </FadeInSection>
        ))}
      </div>
    </section>
  );
}
