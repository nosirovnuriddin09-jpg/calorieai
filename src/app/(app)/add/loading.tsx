function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-black/[0.04] ${className}`} />;
}

// Shown while the add page's server component (auth check + today's
// step log) resolves. Matches AddClient's 6-tile grid shape.
export default function Loading() {
  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">
      <div>
        <Pulse className="h-7 w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Pulse key={i} className="h-[84px] rounded-[24px]" />
        ))}
      </div>
    </div>
  );
}
