"use client";

import { Bell, LogOut, Search, Sparkles } from "lucide-react";
import { signOut } from "@/app/(auth)/actions";

interface DashboardHeaderProps {
  userName: string;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <header className="flex items-center gap-3">
      <div className="h-11 w-11 rounded-full bg-gradient-to-br from-purple-accent to-blue-accent flex items-center justify-center text-white font-semibold shrink-0">
        {userName.charAt(0)}
      </div>

      <div className="hidden sm:block mr-auto">
        <p className="text-xs text-muted">Good morning,</p>
        <p className="text-sm font-semibold text-foreground">{userName}</p>
      </div>

      <div className="flex-1 sm:flex-none sm:w-72 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
        <input
          type="text"
          placeholder="Search"
          className="w-full h-11 rounded-full bg-surface border border-black/[0.04] pl-10 pr-4 text-sm placeholder:text-muted shadow-[0_2px_10px_rgba(0,0,0,0.03)] focus:outline-none focus:ring-2 focus:ring-purple-accent/30"
        />
      </div>

      <button
        aria-label="Notifications"
        className="relative h-11 w-11 shrink-0 rounded-full bg-surface border border-black/[0.04] flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:bg-black/[0.02] transition-colors"
      >
        <Bell size={18} className="text-foreground" />
        <span className="absolute top-2.5 right-3 h-1.5 w-1.5 rounded-full bg-pink-accent" />
      </button>

      <button
        aria-label="Assistant"
        className="hidden sm:flex h-11 w-11 shrink-0 rounded-full bg-surface border border-black/[0.04] items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:bg-black/[0.02] transition-colors"
      >
        <Sparkles size={18} className="text-purple-accent" />
      </button>

      <form action={signOut}>
        <button
          type="submit"
          aria-label="Sign out"
          className="hidden sm:flex h-11 w-11 shrink-0 rounded-full bg-surface border border-black/[0.04] items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:bg-black/[0.02] transition-colors"
        >
          <LogOut size={18} className="text-muted-2" />
        </button>
      </form>
    </header>
  );
}
