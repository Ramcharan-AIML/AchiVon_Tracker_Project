"use client";

import { Search, Home, Bell, Flame, Trophy } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";

export default function TopBar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { level, xp } = useUserStore();

  return (
    <header className="fixed top-0 left-[220px] right-0 h-[60px] bg-achivon-card-white/80 backdrop-blur-md border-b border-achivon-border z-40 flex items-center justify-between px-6">
      {/* Streak & Level Badges */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-achivon-bg rounded-full px-3 py-1.5 streak-pulse">
          <Flame className="w-3.5 h-3.5 text-achivon-primary" />
          <span className="text-xs font-semibold text-achivon-primary">
            15 Days Streak
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 bg-achivon-primary/10 rounded-full px-3 py-1.5">
          <Trophy className="w-3.5 h-3.5 text-achivon-primary" />
          <span className="text-xs font-bold text-achivon-primary">
            Level {mounted ? level : 3}
          </span>
          <span className="text-xs font-medium text-achivon-primary/70 ml-1">
            {mounted ? xp : 240} XP
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-achivon-text-muted" />
          <input
            type="text"
            placeholder="Search heritage logs..."
            className="w-full pl-10 pr-4 py-2 bg-achivon-bg rounded-xl text-sm text-achivon-text placeholder:text-achivon-text-muted focus:outline-none focus:ring-2 focus:ring-achivon-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl hover:bg-achivon-bg transition-colors">
          <Home className="w-[18px] h-[18px] text-achivon-text-light" />
        </button>
        <button className="p-2 rounded-xl hover:bg-achivon-bg transition-colors relative">
          <Bell className="w-[18px] h-[18px] text-achivon-text-light" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-achivon-primary rounded-full" />
        </button>
        <button className="bg-achivon-primary text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-achivon-primary-light transition-colors">
          New Entry
        </button>
      </div>
    </header>
  );
}
