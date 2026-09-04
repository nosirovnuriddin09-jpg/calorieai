import { Home, BookOpen, PlusCircle, BarChart3, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavConfigItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

export const navItems: NavConfigItem[] = [
  { id: "home", label: "Home", icon: Home, href: "/dashboard" },
  { id: "diary", label: "Diary", icon: BookOpen, href: "/diary" },
  { id: "add", label: "Add", icon: PlusCircle, href: "/add" },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/analytics" },
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
];
