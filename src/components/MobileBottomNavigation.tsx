"use client";

import { navItems } from "@/lib/navigation";

interface MobileBottomNavigationProps {
  active: string;
  onSelect: (id: string) => void;
}

export default function MobileBottomNavigation({ active, onSelect }: MobileBottomNavigationProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pt-2">
      <div className="mx-auto max-w-md flex items-center justify-between bg-surface rounded-[26px] px-3 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-black/[0.04]">
        {navItems.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center gap-1 h-12 w-12 rounded-2xl transition-colors ${
                isActive ? "bg-foreground text-background" : "text-muted"
              }`}
            >
              <Icon size={20} strokeWidth={2} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
