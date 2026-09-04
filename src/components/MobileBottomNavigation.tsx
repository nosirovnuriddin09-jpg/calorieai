"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/navigation";

export default function MobileBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pt-2">
      <div className="mx-auto max-w-md flex items-center justify-between bg-surface rounded-[26px] px-3 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-black/[0.04]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center gap-1 h-12 w-12 rounded-2xl transition-colors ${
                isActive ? "bg-cta text-background" : "text-muted"
              }`}
            >
              <Icon size={20} strokeWidth={2} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
