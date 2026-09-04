import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import MobileBottomNavigation from "./MobileBottomNavigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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
