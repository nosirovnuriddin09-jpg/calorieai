"use client";

interface PromoCardProps {
  title: string;
  description: string;
  ctaLabel: string;
  onCta?: () => void;
}

export default function PromoCard({ title, description, ctaLabel, onCta }: PromoCardProps) {
  return (
    <div className="rounded-[28px] p-6 bg-lime-bg relative overflow-hidden">
      <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-white/25" />
      <h3 className="text-base font-bold mb-1 relative">{title}</h3>
      <p className="text-sm text-lime-dark/80 mb-4 leading-snug max-w-[85%] relative">{description}</p>
      <button
        onClick={onCta}
        className="h-10 px-5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity relative"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
