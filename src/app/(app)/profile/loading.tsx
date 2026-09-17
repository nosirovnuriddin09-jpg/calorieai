function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-black/[0.04] ${className}`} />;
}

// Shown while the profile page's server component (auth check + profile
// fetch) resolves.
export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Pulse className="h-7 w-28" />
        <Pulse className="h-4 w-48" />
      </div>
      <Pulse className="h-[420px] rounded-[28px]" />
    </div>
  );
}
