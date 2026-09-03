"use client";

const avatarColors = ["bg-yellow-accent", "bg-green-accent", "bg-blue-accent", "bg-pink-accent"];

export default function SocialCard() {
  return (
    <div className="rounded-[28px] p-6 bg-pink-bg relative overflow-hidden">
      <div className="flex -space-x-3 mb-4">
        {avatarColors.map((c, i) => (
          <div
            key={i}
            className={`h-10 w-10 rounded-full ${c} border-2 border-pink-bg flex items-center justify-center text-white text-xs font-semibold`}
          >
            {String.fromCharCode(65 + i)}
          </div>
        ))}
      </div>
      <h3 className="text-base font-bold mb-1">Together is better!</h3>
      <p className="text-sm text-muted-2 mb-4 leading-snug">
        Invite your crew to join MuseFit and keep each other accountable.
      </p>
      <button className="h-10 px-5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
        Invite friends
      </button>
    </div>
  );
}
