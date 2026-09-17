function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-black/[0.04] ${className}`} />;
}

// Shown while the analytics page's server component (auth check + the
// weekly meals/water/exercise/weight fetch) resolves. Shaped to match
// AnalyticsClient's actual sections so there's no layout jump once real
// content replaces it.
export default function Loading() {
  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto">
      <div>
        <Pulse className="h-7 w-40" />
      </div>
      <Pulse className="h-[220px] rounded-[28px]" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Pulse className="h-[220px] rounded-[28px]" />
        <Pulse className="h-[220px] rounded-[28px]" />
      </div>
      <Pulse className="h-32 rounded-[28px]" />
      <Pulse className="h-48 rounded-[28px]" />
    </div>
  );
}
