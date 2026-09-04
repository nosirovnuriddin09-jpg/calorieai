"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-20 xl:w-24 shrink-0 items-center py-8 gap-2 fixed top-0 h-screen z-40">
      <Link
        href="/dashboard"
        className="mb-6 h-10 w-10 rounded-2xl bg-foreground flex items-center justify-center text-background font-semibold text-sm"
      >
        M
      </Link>
      <nav className="flex flex-col items-center gap-2 bg-surface rounded-[28px] py-4 px-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.03]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={item.label}
              className={`group relative flex flex-col items-center justify-center gap-1 h-14 w-14 rounded-2xl transition-colors ${
                isActive
                  ? "bg-cta text-background"
                  : "text-muted hover:bg-black/[0.03] hover:text-foreground"
              }`}
            >
              <Icon size={20} strokeWidth={2} />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
