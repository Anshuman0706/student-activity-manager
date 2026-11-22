import Link from "next/link";
import { AppIcon as Icon } from "@/app/components/app-icon";

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#737373]">
          Campus life
        </p>
        <h1 className="text-[28px] font-semibold tracking-[-0.055em] text-[#171717] sm:text-[34px]">
          College Events
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737373]">
          A place for campus activities, workshops, and student events.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[240px] overflow-hidden rounded-[22px] bg-[#080808] p-6 text-white sm:p-8">
          <div className="absolute -right-10 -top-16 size-64 rounded-full border border-white/10" />
          <div className="absolute -right-2 -top-8 size-48 rounded-full border border-white/10" />
          <div className="relative flex min-h-[190px] flex-col justify-between">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#d0d0d0]">
              <Icon className="size-3.5" name="events" />
              Campus calendar
            </span>
            <div>
              <h2 className="max-w-md text-2xl font-semibold tracking-[-0.045em] sm:text-3xl">
                Your next campus moment belongs here.
              </h2>
              <p className="mt-2 max-w-lg text-xs leading-5 text-[#b8b8b8]">
                Event listings and registration are not connected to a campus
                events source yet. No sample events or registrations are shown.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[22px] border border-[#e5e5e5] bg-white p-5 sm:p-6">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#888]">
              Integration status
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-[-0.035em] text-[#171717]">
              Event feed not connected
            </h2>
            <p className="mt-2 text-xs leading-5 text-[#737373]">
              This project currently has no events table or registration
              workflow. Connect an authorized campus event source to enable
              real listings and signup status.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[#eeeeec] pt-4">
            <span className="text-[10px] text-[#858585]">No events available</span>
            <Link
              className="rounded-full border border-[#dededc] px-3 py-1.5 text-[9px] font-semibold text-[#333] hover:bg-[#f5f5f3]"
              href="/dashboard"
            >
              Back to overview
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
