"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  BarChart3,
  Settings,
  Plus,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { useHabitStore } from "@/store/habitStore";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/habits", label: "Habits", icon: CheckSquare },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const maxStreak = 15;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-achivon-sidebar border-r border-achivon-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-achivon-primary rounded-lg flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-achivon-text text-sm tracking-tight">
              AchiVon
            </h1>
            <p className="text-[10px] text-achivon-text-muted uppercase tracking-widest">
              Heritage Curator
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative",
                    isActive
                      ? "bg-achivon-primary/5 text-achivon-primary nav-active"
                      : "text-achivon-text-light hover:bg-achivon-bg hover:text-achivon-text"
                  )}
                >
                  <item.icon className="w-[18px] h-[18px]" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Add New Button */}
      <div className="px-4 pb-3">
        <button className="w-full flex items-center justify-center gap-2 bg-achivon-primary text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-achivon-primary-light transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-achivon-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-achivon-primary/10 flex items-center justify-center text-achivon-primary font-bold text-sm">
            {mounted ? user.name.charAt(0) : "J"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-achivon-text truncate">
              {mounted ? user.name : "Julian Vane"}
            </p>
            <p className="text-[11px] text-achivon-text-muted">
              {mounted ? user.tier : "Heritage Curator"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
