import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import MobileBottomNavigation from "@/components/MobileBottomNavigation";

// Shared shell for every authenticated app route (dashboard, diary, add,
// analytics, profile). As a real Next.js layout — not a component each
// page instantiated on its own — this stays mounted across navigations
// between these routes instead of remounting on every click, and it
// renders independently of whatever the destination page is still
// loading (see the per-route loading.tsx files for that part).
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full max-w-[1400px] mx-auto relative">
      <Sidebar />
      <div className="flex">
        <div className="hidden lg:block lg:w-20 xl:w-24 shrink-0" aria-hidden="true" />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-4 py-6 pb-28 lg:pb-6">{children}</main>
      </div>
      <MobileBottomNavigation />
    </div>
  );
}
