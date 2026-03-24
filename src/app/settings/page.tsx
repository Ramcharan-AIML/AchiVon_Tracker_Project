"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import {
  User,
  Palette,
  Bell,
  Shield,
  HelpCircle,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user, updateUser } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    streakAlert: true,
    weeklyReport: false,
    goalDeadline: true,
  });

  useEffect(() => {
    setMounted(true);
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  const handleSaveProfile = () => {
    updateUser({ name, email });
  };

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="h-96 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-achivon-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="fade-in">
        <h1 className="text-2xl font-bold text-achivon-text">Settings</h1>
        <p className="text-achivon-text-light mt-1">
          Manage your account preferences and configuration.
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-achivon-card-white rounded-2xl p-6 shadow-sm border border-achivon-border fade-in fade-in-delay-1">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-achivon-primary" />
          <h3 className="text-lg font-semibold text-achivon-text">Profile</h3>
        </div>

        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-achivon-primary/10 flex items-center justify-center text-achivon-primary font-bold text-2xl shrink-0">
            {user.name.charAt(0)}
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-achivon-text block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-achivon-border bg-achivon-bg text-sm focus:outline-none focus:ring-2 focus:ring-achivon-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-achivon-text block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-achivon-border bg-achivon-bg text-sm focus:outline-none focus:ring-2 focus:ring-achivon-primary/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-achivon-text-muted uppercase">
                Membership
              </span>
              <span className="text-xs font-semibold bg-achivon-primary/10 text-achivon-primary px-2.5 py-1 rounded-lg">
                {user.tier}
              </span>
            </div>

            <button
              onClick={handleSaveProfile}
              className="bg-achivon-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-achivon-primary-light transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Theme Section */}
      <div className="bg-achivon-card-white rounded-2xl p-6 shadow-sm border border-achivon-border fade-in fade-in-delay-2">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-5 h-5 text-achivon-primary" />
          <h3 className="text-lg font-semibold text-achivon-text">Appearance</h3>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { key: "light" as const, label: "Light", icon: Sun },
            { key: "dark" as const, label: "Dark", icon: Moon },
            { key: "system" as const, label: "System", icon: Monitor },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                theme === key
                  ? "border-achivon-primary bg-achivon-primary/5"
                  : "border-achivon-border hover:border-achivon-primary/30"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6",
                  theme === key
                    ? "text-achivon-primary"
                    : "text-achivon-text-muted"
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  theme === key
                    ? "text-achivon-primary"
                    : "text-achivon-text-light"
                )}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-achivon-card-white rounded-2xl p-6 shadow-sm border border-achivon-border fade-in fade-in-delay-3">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-achivon-primary" />
          <h3 className="text-lg font-semibold text-achivon-text">
            Notifications
          </h3>
        </div>

        <div className="space-y-4">
          {[
            {
              key: "dailyReminder" as const,
              label: "Daily Habit Reminder",
              desc: "Get reminded at 8 AM to complete your habits",
            },
            {
              key: "streakAlert" as const,
              label: "Streak Alert",
              desc: "Alert when your streak is about to break",
            },
            {
              key: "weeklyReport" as const,
              label: "Weekly Report",
              desc: "Receive a weekly summary of your progress",
            },
            {
              key: "goalDeadline" as const,
              label: "Goal Deadline Reminder",
              desc: "Remind 7 days before goal deadlines",
            },
          ].map(({ key, label, desc }) => (
            <div
              key={key}
              className="flex items-center justify-between py-2"
            >
              <div>
                <p className="text-sm font-medium text-achivon-text">
                  {label}
                </p>
                <p className="text-xs text-achivon-text-light">{desc}</p>
              </div>
              <button
                onClick={() =>
                  setNotifications((n) => ({ ...n, [key]: !n[key] }))
                }
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  notifications[key] ? "bg-achivon-primary" : "bg-achivon-border"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
                    notifications[key] ? "left-[22px]" : "left-0.5"
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-achivon-card-white rounded-2xl p-6 shadow-sm border border-red-200 fade-in fade-in-delay-4">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-achivon-text">
            Data Management
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-achivon-text">
              Reset All Data
            </p>
            <p className="text-xs text-achivon-text-light">
              Clear all habits, goals, and progress data. This cannot be
              undone.
            </p>
          </div>
          <button
            onClick={() => {
              if (
                confirm("Are you sure you want to reset all data?")
              ) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="px-4 py-2 rounded-xl border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
