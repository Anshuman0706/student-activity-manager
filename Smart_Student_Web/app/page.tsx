import Link from "next/link";
import { AppIcon as Icon, type IconName } from "@/app/components/app-icon";
import { DarkModeToggle } from "@/app/components/dark-mode-toggle";

const features: {
  name: string;
  description: string;
  href: string;
  icon: IconName;
}[] = [
  {
    name: "Tasks",
    description: "Keep assignments, deadlines, and priorities together.",
    href: "/tasks",
    icon: "tasks",
  },
  {
    name: "Exams",
    description: "Plan around upcoming exams and study milestones.",
    href: "/exams",
    icon: "exams",
  },
  {
    name: "Attendance",
    description: "Follow subject attendance from your own records.",
    href: "/attendance",
    icon: "attendance",
  },
  {
    name: "Library",
    description: "Keep borrowed books and return dates close.",
    href: "/library",
    icon: "library",
  },
  {
    name: "College events",
    description: "A home for campus activities and event updates.",
    href: "/events",
    icon: "events",
  },
  {
    name: "Placements",
    description: "Keep career opportunities in your workspace.",
    href: "/placements",
    icon: "placements",
  },
];

function Brand() {
  return (
    <Link aria-label="SmartCampus home" className="flex items-center gap-2.5" href="/">
      <span className="flex size-9 items-center justify-center rounded-xl bg-[#080808] text-white">
        <Icon className="size-5" name="graduation" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold tracking-[-0.04em] text-[#171717]">
          SmartCampus
        </span>
        <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.11em] text-[#737373]">
          Smart Student Life Assistant
        </span>
      </span>
    </Link>
  );
}

function AcademicIllustration() {
  return (
    <div
      aria-hidden="true"
      className="home-illustration relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-[24px] bg-[radial-gradient(ellipse_at_55%_40%,#ffffff_0%,#f2f2f0_48%,#dededb_100%)] sm:min-h-[340px]"
    >
      <div className="home-illustration-dot absolute left-[14%] top-[20%] size-3 rounded-full bg-[#c5c5c2]" />
      <div className="home-illustration-dot-muted absolute right-[17%] top-[17%] size-2 rounded-full bg-[#858585]" />
      <div className="home-illustration-dot-muted absolute bottom-[17%] left-[20%] size-2 rounded-full bg-[#a1a1a1]" />
      <div className="home-illustration-line absolute right-[17%] top-[30%] h-24 w-px rotate-[35deg] bg-gradient-to-b from-transparent via-[#b4b4b0] to-transparent" />
      <div className="home-illustration-outline absolute bottom-[16%] right-[19%] size-10 rounded-full border border-[#c7c7c3]" />
      <div className="home-illustration-outline-soft absolute bottom-[18%] left-[20%] h-20 w-20 rounded-full border border-white/90" />

      <div className="relative mt-16 w-[min(72%,330px)]">
        <div className="home-illustration-badge absolute -top-24 left-1/2 z-10 flex size-24 -translate-x-1/2 items-center justify-center rounded-full border border-white/70 bg-white/40 shadow-[0_18px_42px_rgba(0,0,0,0.08)] backdrop-blur-sm">
          <Icon className="size-12 text-[#171717]" name="graduation" />
        </div>
        <div className="home-illustration-dark-layer relative h-5 -skew-x-12 rounded-sm bg-[#202020] shadow-[0_10px_20px_rgba(0,0,0,0.15)]" />
        <div className="home-illustration-metal mx-auto h-4 w-[85%] -skew-x-12 bg-gradient-to-r from-[#d8d8d6] via-white to-[#bdbdb9]" />
        <div className="home-illustration-light-layer mx-auto h-5 w-[92%] -skew-x-12 bg-[#fdfdfc] shadow-[0_12px_22px_rgba(0,0,0,0.08)]" />
        <div className="home-illustration-metal mx-auto h-4 w-[78%] -skew-x-12 bg-gradient-to-r from-[#b9b9b5] via-[#f7f7f5] to-[#c8c8c4]" />
        <div className="home-illustration-dark-layer mx-auto h-5 w-full -skew-x-12 bg-[#242424]" />
        <div className="home-illustration-metal mx-auto h-4 w-[88%] -skew-x-12 bg-gradient-to-r from-white via-[#dededb] to-white" />
        <div className="home-illustration-light-layer mx-auto h-6 w-[96%] -skew-x-12 rounded-b-sm bg-[#fdfdfc] shadow-[0_16px_24px_rgba(0,0,0,0.12)]" />
      </div>
      <span className="home-illustration-caption absolute bottom-4 left-4 rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-[#666] backdrop-blur">
        Learn · Plan · Grow
      </span>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="home-page min-h-screen bg-[#f5f5f3] px-4 py-4 text-[#171717] sm:px-6 sm:py-6">
      <div className="mx-auto max-w-[1240px]">
        <header className="flex items-center justify-between gap-5 rounded-2xl border border-[#e5e5e5] bg-white px-4 py-3 sm:px-6">
          <Brand />
          <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
            <Link className="text-xs font-medium text-[#595959] hover:text-black" href="#home">
              Home
            </Link>
            <Link className="text-xs font-medium text-[#595959] hover:text-black" href="#features">
              Features
            </Link>
            <Link className="text-xs font-medium text-[#595959] hover:text-black" href="#about">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <Link
              className="hidden rounded-full px-4 py-2 text-xs font-semibold text-[#333] hover:bg-[#f5f5f3] sm:inline-flex"
              href="/login"
            >
              Sign in
            </Link>
            <Link
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#080808] px-4 text-xs font-semibold text-white transition hover:bg-[#303030] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
              href="/login"
            >
              Get started
            </Link>
          </div>
        </header>

        <section
          aria-labelledby="hero-heading"
          className="mt-5 grid gap-4 rounded-[28px] border border-[#e5e5e5] bg-white p-4 sm:p-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:p-8"
          id="home"
        >
          <div className="py-5 sm:px-3">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-[#f5f5f3] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#606060]">
              <Icon className="size-3.5" name="graduation" />
              Your campus, thoughtfully organized
            </p>
            <h1
              className="max-w-[580px] text-[42px] font-semibold leading-[1.02] tracking-[-0.065em] text-[#111] sm:text-6xl"
              id="hero-heading"
            >
              Your Smart Student Life Starts Here
            </h1>
            <p className="mt-5 max-w-[540px] text-sm leading-7 text-[#686868] sm:text-base">
              Manage academic tasks, plan for exams, track attendance and book
              returns, and keep campus events and placement opportunities in one
              student workspace.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#080808] px-5 text-xs font-semibold text-white transition hover:bg-[#303030] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                href="/login"
              >
                Get Started <span aria-hidden="true">→</span>
              </Link>
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#dededc] bg-white px-5 text-xs font-semibold text-[#252525] transition hover:bg-[#f5f5f3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                href="#features"
              >
                Explore Features
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-3 border-t border-[#ededeb] pt-5">
              <span className="flex size-8 items-center justify-center rounded-full bg-[#e8e8e6] text-[#333]">
                <Icon className="size-4" name="profile" />
              </span>
              <p className="text-[10px] leading-4 text-[#777]">
                Your records stay connected to your student account
              </p>
            </div>
          </div>

          <AcademicIllustration />
        </section>

        <section
          aria-label="SmartCampus dashboard preview"
          className="mt-4 rounded-[24px] border border-[#e5e5e5] bg-white p-4 sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#858585]">
                Workspace preview
              </p>
              <h2 className="mt-1 text-base font-semibold tracking-[-0.03em] text-[#171717]">
                One view of your academic routine
              </h2>
            </div>
            <span className="rounded-full border border-[#e5e5e5] bg-[#f5f5f3] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#555]">
              Preview · no sample records
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Tasks", "Your deadlines"],
              ["Exams", "Your schedule"],
              ["Attendance", "Subject totals"],
              ["Library", "Return reminders"],
            ].map(([label, detail]) => (
              <div className="rounded-[16px] border border-[#e8e8e6] bg-[#fafaf9] p-3.5" key={label}>
                <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-[#777]">
                  {label}
                </p>
                <p className="mt-3 text-xl font-semibold tracking-[-0.05em] text-[#252525]">
                  —
                </p>
                <p className="mt-1 text-[9px] text-[#858585]">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="features-heading"
          className="py-10 sm:py-14"
          id="features"
        >
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#777]">
                A calmer way to stay on track
              </p>
              <h2
                className="text-2xl font-semibold tracking-[-0.05em] text-[#171717] sm:text-3xl"
                id="features-heading"
              >
                Everything student life asks of you.
              </h2>
            </div>
            <Link
              className="text-xs font-semibold text-[#333] underline decoration-[#c5c5c2] underline-offset-4 hover:decoration-[#171717]"
              href="/login"
            >
              Enter your workspace
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Link
                className="group rounded-[20px] border border-[#e5e5e5] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#c8c8c5] hover:shadow-[0_12px_28px_rgba(0,0,0,0.05)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                href={feature.href}
                key={feature.name}
              >
                <div className="flex items-start justify-between">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[#f1f1ef] text-[#222]">
                    <Icon className="size-[18px]" name={feature.icon} />
                  </span>
                  <span className="text-[9px] font-medium tracking-[0.12em] text-[#aaa]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-sm font-semibold text-[#222]">{feature.name}</h3>
                <p className="mt-1.5 text-xs leading-5 text-[#777]">{feature.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="about-heading"
          className="grid gap-4 rounded-[24px] border border-[#e5e5e5] bg-[#ededeb] p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-7"
          id="about"
        >
          <div>
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#777]">
              Built around your routine
            </p>
            <h2
              className="text-xl font-semibold tracking-[-0.04em] text-[#171717] sm:text-2xl"
              id="about-heading"
            >
              Less juggling. More room to focus.
            </h2>
            <p className="mt-2 max-w-2xl text-xs leading-6 text-[#686868]">
              Your private student workspace keeps personal tasks, profile
              details, attendance, and library reminders connected to your
              account.
            </p>
          </div>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#080808] px-5 text-xs font-semibold text-white transition hover:bg-[#303030]"
            href="/login"
          >
            Open SmartCampus
          </Link>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e4e4e2] py-6 text-[10px] text-[#777]">
          <Brand />
          <p>Smart Student Life Assistant</p>
          <div className="flex gap-4">
            <Link className="hover:text-black" href="/login">Sign in</Link>
            <Link className="hover:text-black" href="#features">Features</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
