"use client";

import { navItems } from "@/lib/navigation";

interface SidebarProps {
  active: string;
  onSelect: (id: string) => void;
}

export default function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-20 xl:w-24 shrink-0 items-center py-8 gap-2">
      <div className="mb-6 h-10 w-10 rounded-2xl bg-foreground flex items-center justify-center text-background font-semibold text-sm">
        M
      </div>
      <nav className="flex flex-col items-center gap-2 bg-surface rounded-[28px] py-4 px-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03]">
        {navItems.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              aria-label={item.label}
              className={`group relative flex flex-col items-center justify-center gap-1 h-14 w-14 rounded-2xl transition-colors ${
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted hover:bg-black/[0.03] hover:text-foreground"
              }`}
            >
              <Icon size={20} strokeWidth={2} />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
