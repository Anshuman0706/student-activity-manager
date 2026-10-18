"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppIcon as Icon } from "./app-icon";
import { DarkModeToggle } from "./dark-mode-toggle";
import { NavigationItems } from "./navigation-items";

const quickLinks = [
  { href: "/dashboard", label: "Overview", icon: "dashboard" },
  { href: "/tasks", label: "Tasks", icon: "tasks" },
  { href: "/exams", label: "Exams", icon: "exams" },
  { href: "/attendance", label: "Attendance", icon: "attendance" },
  { href: "/library", label: "Library", icon: "library" },
] as const;

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/profile": "Student Profile",
  "/tasks": "Task Manager",
  "/exams": "Exam Planner",
  "/attendance": "Attendance",
  "/library": "Library",
  "/events": "College Events",
  "/placements": "Placements",
  "/notifications": "Notifications",
  "/settings": "Settings",
};

export function WorkspaceHeader({
  brand,
  notificationIndicator,
}: {
  brand: ReactNode;
  notificationIndicator: ReactNode;
}) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "SmartCampus";

  return (
    <header className="sticky top-0 z-20 border-b border-[#e5e5e5] bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-9">
      <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <details
            className="relative lg:hidden"
            onClick={(event) => {
              if (event.target instanceof Element && event.target.closest("a")) {
                event.currentTarget.open = false;
              }
            }}
          >
            <summary
              aria-label="Open navigation menu"
              className="flex size-10 cursor-pointer list-none items-center justify-center rounded-xl border border-[#e5e5e5] text-[#444] hover:bg-[#f5f5f3] [&::-webkit-details-marker]:hidden"
            >
              <Icon className="size-[18px]" name="menu" />
            </summary>
            <nav
              aria-label="Mobile navigation menu"
              className="absolute left-0 top-12 z-50 max-h-[75vh] w-[min(18rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-[#e5e5e5] bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
            >
              <NavigationItems />
            </nav>
          </details>
          <div className="lg:hidden">{brand}</div>
          <div className="hidden min-w-0 lg:block">
            <p className="truncate text-[15px] font-semibold tracking-[-0.02em] text-[#171717]">
              {title}
            </p>
            <p className="mt-0.5 text-[10px] text-[#8a8a8a]">SmartCampus workspace</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <DarkModeToggle />
          <Link
            aria-label="Notifications"
            className={`relative flex size-10 items-center justify-center rounded-full border transition ${
              pathname === "/notifications"
                ? "border-[#171717] bg-[#f1f1ef] text-[#171717]"
                : "border-[#e5e5e5] bg-white text-[#555] hover:bg-[#f5f5f3]"
            }`}
            href="/notifications"
          >
            <Icon className="size-[17px]" name="notifications" />
            {notificationIndicator}
          </Link>
          <Link
            aria-label="Student profile"
            className="flex size-10 items-center justify-center rounded-full bg-[#111111] text-white transition hover:bg-[#333]"
            href="/profile"
          >
            <Icon className="size-[17px]" name="profile" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MobileQuickNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[#e5e5e5] bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden"
    >
      {quickLinks.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[9px] transition ${
              active ? "font-semibold text-[#171717]" : "font-medium text-[#737373]"
            }`}
            href={item.href}
            key={item.href}
          >
            <Icon
              className={`size-[17px] ${active ? "text-[#171717]" : "text-[#858585]"}`}
              name={item.icon}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
