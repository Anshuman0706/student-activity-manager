"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AppIcon, type IconName } from "./app-icon";

type RouteCommand = {
  id: string;
  label: string;
  icon: IconName;
  href: string;
  description: string;
};

const commands: RouteCommand[] = [
  {
    id: "profile",
    label: "Student Profile",
    icon: "profile",
    href: "/profile",
    description: "Your student details",
  },
  {
    id: "tasks",
    label: "Manage Tasks",
    icon: "tasks",
    href: "/tasks",
    description: "Task Manager",
  },
  {
    id: "exams",
    label: "View Exams",
    icon: "exams",
    href: "/exams",
    description: "Exam Planner",
  },
  {
    id: "attendance",
    label: "Check Attendance",
    icon: "attendance",
    href: "/attendance",
    description: "Attendance",
  },
  {
    id: "library",
    label: "Open Library",
    icon: "library",
    href: "/library",
    description: "Library",
  },
  {
    id: "events",
    label: "College Events",
    icon: "events",
    href: "/events",
    description: "Campus events",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "settings",
    href: "/settings",
    description: "Account preferences",
  },
];

const quickActions = [
  { label: "Add Task", href: "/tasks#add-task", icon: "plus" },
  { label: "View Tasks", href: "/tasks", icon: "tasks" },
  { label: "View Exams", href: "/exams", icon: "exams" },
  { label: "View Attendance", href: "/attendance", icon: "attendance" },
] as const satisfies ReadonlyArray<{
  label: string;
  href: string;
  icon: IconName;
}>;

function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function RadialCommandBall() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstCommandRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!expanded) {
      return;
    }

    const focusFrame = window.requestAnimationFrame(() => {
      firstCommandRef.current?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setExpanded(false);
        setQuickActionsOpen(false);
        triggerRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [expanded]);

  function closeMenu(restoreFocus = false) {
    setExpanded(false);
    setQuickActionsOpen(false);
    if (restoreFocus) {
      triggerRef.current?.focus();
    }
  }

  return (
    <>
      {expanded ? (
        <button
          aria-label="Close radial command menu"
          className="fixed inset-0 z-[45] cursor-default bg-transparent"
          onClick={() => closeMenu(true)}
          tabIndex={-1}
          type="button"
        />
      ) : null}

      <div
        aria-label="Radial command menu"
        className="pointer-events-none fixed bottom-4 right-4 z-50 aspect-square w-[min(22.5rem,calc(100vw-1rem))] sm:bottom-6 sm:right-6"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            closeMenu();
            triggerRef.current?.focus();
          }
        }}
      >
        <div
          aria-hidden={!expanded}
          inert={!expanded}
          className={`absolute inset-0 transition-all duration-300 ease-out ${
            expanded
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-75 opacity-0"
          }`}
        >
          <div
            className="radial-command-dial absolute left-1/2 top-1/2 aspect-square w-[57%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          />

          {commands.map((command, index) => {
            const angle = ((-90 + index * 45) * Math.PI) / 180;
            const x = 50 + Math.cos(angle) * 20.5;
            const y = 50 + Math.sin(angle) * 20.5;
            const labelX = 50 + Math.cos(angle) * 41;
            const labelY = 50 + Math.sin(angle) * 41;
            const labelTransform =
              Math.cos(angle) > 0.35
                ? "translate(-100%, -50%)"
                : Math.cos(angle) < -0.35
                  ? "translate(0, -50%)"
                  : "translate(-50%, -50%)";
            const active = isRouteActive(pathname, command.href);

            return (
              <div className="group" key={command.id}>
                <Link
                  aria-current={active ? "page" : undefined}
                  aria-label={command.label}
                  className={`radial-command-item pointer-events-auto absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition duration-200 hover:scale-110 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    active ? "is-active" : ""
                  }`}
                  href={command.href}
                  onClick={() => closeMenu()}
                  ref={index === 0 ? firstCommandRef : undefined}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  title={command.description}
                >
                  <AppIcon className="size-[18px]" name={command.icon} />
                </Link>
                <span
                  aria-hidden="true"
                  className={`radial-command-label pointer-events-none invisible absolute max-w-[112px] rounded-md border px-2 py-1 text-center text-[9px] font-semibold leading-tight opacity-0 shadow-md transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 ${
                    active ? "is-active" : ""
                  }`}
                  style={{
                    left: `${labelX}%`,
                    top: `${labelY}%`,
                    transform: labelTransform,
                  }}
                >
                  {command.label}
                </span>
              </div>
            );
          })}

          <div className="group">
            <button
              aria-expanded={quickActionsOpen}
              aria-label="Quick Actions"
              className={`radial-command-item pointer-events-auto absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition duration-200 hover:scale-110 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                quickActionsOpen ? "is-active" : ""
              }`}
              onClick={() => setQuickActionsOpen((open) => !open)}
              style={{
                left: `${50 + Math.cos((225 * Math.PI) / 180) * 20.5}%`,
                top: `${50 + Math.sin((225 * Math.PI) / 180) * 20.5}%`,
              }}
              title="Quick Actions"
              type="button"
            >
              <AppIcon className="size-[18px]" name="plus" />
            </button>
            <span
              aria-hidden="true"
              className="radial-command-label pointer-events-none invisible absolute max-w-[112px] -translate-y-1/2 rounded-md border px-2 py-1 text-center text-[9px] font-semibold leading-tight opacity-0 shadow-md transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
              style={{
                left: `${50 + Math.cos((225 * Math.PI) / 180) * 41}%`,
                top: `${50 + Math.sin((225 * Math.PI) / 180) * 41}%`,
              }}
            >
              Quick Actions
            </span>
          </div>
        </div>

        {quickActionsOpen && expanded ? (
          <div
            aria-label="Quick actions"
            className="radial-command-popover pointer-events-auto absolute left-1/2 top-[9%] z-10 w-[min(13rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-full rounded-2xl border p-2"
            role="group"
          >
            <p className="radial-command-popover-heading px-2 pb-1 pt-1 text-[9px] font-bold uppercase tracking-[0.13em]">
              Quick actions
            </p>
            {quickActions.map((action) => (
              <Link
                className="radial-command-popover-link flex min-h-9 items-center gap-2 rounded-lg px-2 text-xs font-medium transition focus-visible:outline focus-visible:outline-2"
                href={action.href}
                key={action.label}
                onClick={() => closeMenu()}
              >
                <AppIcon className="radial-command-popover-icon size-4" name={action.icon} />
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}

        <button
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse radial command menu" : "Open radial command menu"}
          className={`radial-command-trigger pointer-events-auto absolute flex size-[58px] items-center justify-center rounded-full border transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
            expanded
              ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-180"
              : "bottom-0 right-0 rotate-0"
          }`}
          onClick={() => {
            if (expanded) {
              closeMenu();
            } else {
              setExpanded(true);
            }
          }}
          ref={triggerRef}
          type="button"
        >
          <AppIcon className="size-5" name="menu" />
        </button>
      </div>
    </>
  );
}
