function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-black/[0.04] ${className}`} />;
}

export default function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5">
      <div className="flex flex-col gap-5 min-w-0">
        <div className="flex items-center gap-3">
          <Pulse className="h-11 w-11 rounded-full shrink-0" />
          <Pulse className="h-11 flex-1 rounded-full" />
          <Pulse className="h-11 w-11 rounded-full shrink-0" />
        </div>

        <div className="flex items-center justify-between">
          <Pulse className="h-7 w-32" />
          <Pulse className="h-9 w-52 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-5 items-start">
          <Pulse className="h-[420px] rounded-[28px]" />
          <div className="grid grid-cols-2 gap-4">
            <Pulse className="h-[150px] rounded-[24px]" />
            <Pulse className="h-[150px] rounded-[24px]" />
            <Pulse className="h-[150px] rounded-[24px]" />
            <Pulse className="h-[150px] rounded-[24px]" />
          </div>
        </div>

        <Pulse className="h-64 rounded-[28px]" />
      </div>

      <div className="flex flex-col gap-5 min-w-0">
        <Pulse className="h-48 rounded-[28px]" />
        <Pulse className="h-64 rounded-[28px]" />
        <Pulse className="h-48 rounded-[28px]" />
      </div>
    </div>
  );
}
