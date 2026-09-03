import { Home, BookOpen, PlusCircle, BarChart3, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavConfigItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavConfigItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "diary", label: "Diary", icon: BookOpen },
  { id: "add", label: "Add", icon: PlusCircle },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "profile", label: "Profile", icon: User },
];
