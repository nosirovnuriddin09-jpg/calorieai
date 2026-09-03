"use client";

import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import MobileBottomNavigation from "./MobileBottomNavigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [active, setActive] = useState("home");

  return (
    <div className="flex min-h-screen w-full max-w-[1400px] mx-auto">
      <Sidebar active={active} onSelect={setActive} />
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-4 py-6 pb-28 lg:pb-6">{children}</main>
      <MobileBottomNavigation active={active} onSelect={setActive} />
    </div>
  );
}
