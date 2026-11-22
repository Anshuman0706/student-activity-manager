import Link from "next/link";
import { Suspense } from "react";
import type { ReactNode } from "react";
import { AppIcon as Icon } from "./app-icon";
import { AuthControls } from "./auth-controls";
import { NotificationIndicator } from "./notification-indicator";
import { NavigationItems } from "./navigation-items";
import { MobileQuickNav, WorkspaceHeader } from "./workspace-header";

function Brand() {
  return (
    <Link
      aria-label="SmartCampus dashboard"
      className="flex items-center gap-3"
      href="/dashboard"
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-[#111111] text-white">
        <Icon className="size-[19px]" name="graduation" />
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-[-0.04em] text-[#171717]">
          SmartCampus
        </span>
        <span className="mt-1 hidden text-[9px] font-medium tracking-[0.12em] text-[#737373] min-[420px]:block">
          SMART STUDENT LIFE ASSISTANT
        </span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f5f3] text-[#171717]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-[#e5e5e5] bg-white px-4 py-5 lg:flex">
        <div className="px-2 pb-7">
          <Brand />
        </div>

        <nav
          aria-label="Main navigation"
          className="hide-scrollbar flex-1 overflow-y-auto"
        >
          <NavigationItems />
        </nav>

        <div className="mt-5 border-t border-[#e5e5e5] pt-4">
          <AuthControls />
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[248px]">
        <WorkspaceHeader
          brand={<Brand />}
          notificationIndicator={
            <Suspense fallback={null}>
              <NotificationIndicator />
            </Suspense>
          }
        />
        <main className="mx-auto min-h-[calc(100vh-72px)] max-w-[1480px] px-4 pb-24 pt-6 sm:px-6 md:py-8 lg:px-9 lg:pb-10">
          {children}
        </main>
      </div>

      <MobileQuickNav />
    </div>
  );
}
