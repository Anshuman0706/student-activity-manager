import Link from "next/link";
import { AppIcon as Icon } from "@/app/components/app-icon";

export default function PlacementsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#737373]">
          Career workspace
        </p>
        <h1 className="text-[28px] font-semibold tracking-[-0.055em] text-[#171717] sm:text-[34px]">
          Placements
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737373]">
          Explore career opportunities and keep application details organized
          when your institution shares them.
        </p>
      </header>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <div className="rounded-[22px] border border-[#e5e5e5] bg-white p-5 sm:p-7">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[#f1f1ef] text-[#333]">
            <Icon className="size-5" name="placements" />
          </div>
          <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#858585]">
            Opportunity listings
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#171717]">
            No verified opportunities yet
          </h2>
          <p className="mt-2 max-w-xl text-xs leading-6 text-[#737373]">
            Placement listings, eligibility rules, and application status are
            not connected to a verified institution or employer feed. To avoid
            misleading details, this workspace does not show sample companies
            or fake application actions.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f1f1ef] px-3 py-2 text-[9px] font-medium text-[#555]">
            <span className="size-1.5 rounded-full bg-[#777]" />
            Placement source not connected
          </div>
        </div>

        <aside className="rounded-[22px] bg-[#080808] p-5 text-white sm:p-6">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a5a5a5]">
            What will appear here
          </p>
          <ul className="mt-5 space-y-3">
            {[
              "Verified company and role details",
              "Eligibility based on your saved profile",
              "Application deadlines and status",
            ].map((item) => (
              <li className="flex items-start gap-3 text-xs leading-5 text-[#e4e4e4]" key={item}>
                <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border border-white/25 text-[9px]">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            className="mt-7 inline-flex min-h-10 items-center justify-center rounded-full border border-white/25 px-4 text-[10px] font-semibold text-white transition hover:bg-white/10"
            href="/profile"
          >
            Review your student profile
          </Link>
        </aside>
      </section>
    </div>
  );
}
