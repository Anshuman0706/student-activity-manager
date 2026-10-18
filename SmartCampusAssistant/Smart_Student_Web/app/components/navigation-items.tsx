"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppIcon as Icon } from "./app-icon";

const navigationGroups = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", icon: "dashboard", href: "/dashboard" },
    ],
  },
  {
    label: "Academics",
    items: [
      { label: "Task Manager", icon: "tasks", href: "/tasks" },
      { label: "Exam Planner", icon: "exams", href: "/exams" },
      { label: "Attendance", icon: "attendance", href: "/attendance" },
      { label: "Library", icon: "library", href: "/library" },
    ],
  },
  {
    label: "Campus",
    items: [
      { label: "College Events", icon: "events", href: "/events" },
      { label: "Placements", icon: "placements", href: "/placements" },
      { label: "Notifications", icon: "notifications", href: "/notifications" },
      { label: "Student Profile", icon: "profile", href: "/profile" },
      { label: "Settings", icon: "settings", href: "/settings" },
    ],
  },
] as const;

export function NavigationItems() {
  const pathname = usePathname();

  return (
    <>
      {navigationGroups.map((group) => (
        <div className="mb-6" key={group.label}>
          <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a3a3a3]">
            {group.label}
          </p>
          <ul className="space-y-1">
            {group.items.map((item) => {
              const active =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={`navigation-item flex min-h-10 items-center gap-3 rounded-xl px-3 text-[12px] transition-colors ${
                      active
                        ? "bg-[#080808] font-medium text-white shadow-sm"
                        : "font-medium text-[#666666]"
                    }`}
                    href={item.href}
                  >
                    <Icon
                      className={`size-[17px] ${active ? "text-white" : "text-[#858585]"}`}
                      name={item.icon}
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}
