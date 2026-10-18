import Link from "next/link";
import { AppIcon } from "./app-icon";

const windows = [
  [188, 290],
  [220, 290],
  [252, 290],
  [188, 322],
  [220, 322],
  [252, 322],
  [188, 354],
  [220, 354],
  [252, 354],
  [310, 258],
  [344, 258],
  [378, 258],
  [310, 294],
  [344, 294],
  [378, 294],
  [310, 330],
  [344, 330],
  [378, 330],
  [424, 218],
  [460, 218],
  [496, 218],
  [424, 258],
  [460, 258],
  [496, 258],
  [424, 298],
  [460, 298],
  [496, 298],
] as const;

function CampusIllustration() {
  return (
    <svg
      aria-hidden="true"
      className="auth-campus-art"
      fill="none"
      height="100%"
      preserveAspectRatio="xMaxYMax meet"
      viewBox="70 100 500 340"
      width="100%"
    >
      <g className="campus-academic-accent campus-cap-accent">
        <circle cx="320" cy="151" r="31" />
        <path d="m300 149 20-10 20 10-20 10-20-10Z" />
        <path d="M307 154v9c8 6 18 6 26 0v-9m7-2v12" />
        <circle className="campus-accent-dot" cx="340" cy="164" r="2.5" />
      </g>
      <g className="campus-academic-accent campus-book-accent">
        <rect height="48" rx="13" width="48" x="80" y="200" />
        <path d="M91 213c6-3 12-2 15 1v20c-4-3-10-4-15-1v-20Zm26 0c-6-3-12-2-15 1v20c4-3 10-4 15-1v-20Z" />
        <path d="M98 218h5m-5 5h5m9-5h-4m4 5h-4" />
      </g>
      <g className="campus-academic-accent campus-calendar-accent">
        <rect height="48" rx="13" width="48" x="523" y="110" />
        <rect height="23" rx="3" width="25" x="534.5" y="123" />
        <path d="M541 120v7m12-7v7m-18 3h25" />
        <path className="campus-accent-mark" d="M540 136h4m5 0h4m-13 6h4m5 0h4" />
      </g>

      <path className="campus-hill" d="M0 355c90-45 156-42 238-4 94-57 204-43 402-2v91H0z" />
      <path className="campus-ground" d="M0 385c117-34 187-19 275 5 123-37 211-20 365 5v45H0z" />
      <path className="campus-walk" d="M240 440c39-61 78-108 126-151h78c-24 62-39 112-47 151z" />
      <path className="campus-walk-edge" d="M240 440c39-61 78-108 126-151" />
      <path className="campus-walk-edge" d="M397 440c8-39 23-89 47-151" />

      <g className="campus-building-back">
        <path d="m389 181 116-40 93 28v178H389z" />
        <path className="campus-building-side" d="m505 141 93 28v178h-93z" />
        <path className="campus-building-roof" d="m389 181 116-40v24l-116 41z" />
        <path className="campus-building-front" d="m389 206 116-41v182H389z" />
      </g>

      <g className="campus-building-mid">
        <path d="m260 249 92-31 73 22v135H260z" />
        <path className="campus-building-side" d="m352 218 73 22v135h-73z" />
        <path className="campus-building-roof" d="m260 249 92-31v22l-92 32z" />
        <path className="campus-building-front" d="m260 272 92-32v142h-92z" />
      </g>

      <g className="campus-building-front">
        <path d="m115 287 107-35 89 26v111H115z" />
        <path className="campus-building-side" d="m222 252 89 26v111h-89z" />
        <path className="campus-building-roof" d="m115 287 107-35v22l-107 36z" />
        <path d="M115 310h107v79H115z" />
      </g>

      {windows.map(([x, y]) => (
        <rect className="campus-window" height="19" key={`${x}-${y}`} width="21" x={x} y={y} />
      ))}
      <path className="campus-door" d="M159 350h22v39h-22z" />
      <path className="campus-door" d="M365 335h21v48h-21z" />
      <path className="campus-door" d="M534 322h25v65h-25z" />

      <g className="campus-tree">
        <path className="campus-trunk" d="M79 356h8v48h-8z" />
        <circle cx="83" cy="330" r="26" />
        <circle cx="63" cy="346" r="18" />
        <circle cx="101" cy="348" r="19" />
      </g>
      <g className="campus-tree campus-tree-small">
        <path className="campus-trunk" d="M553 343h7v53h-7z" />
        <circle cx="557" cy="317" r="25" />
        <circle cx="539" cy="332" r="18" />
        <circle cx="575" cy="335" r="18" />
      </g>
      <g className="campus-tree campus-tree-small">
        <path className="campus-trunk" d="M226 372h6v30h-6z" />
        <circle cx="229" cy="354" r="19" />
        <circle cx="214" cy="365" r="13" />
      </g>

      <g className="campus-lamp">
        <path d="M452 328v77m-7-78h14l-2-6h-10z" />
        <circle cx="452" cy="322" r="3" />
      </g>
      <g className="campus-student campus-student-one">
        <circle cx="310" cy="338" r="7" />
        <path d="m302 348 8-4 8 4 4 31h-24zm4 30h6v29h-6zm8 0h6v29h-6z" />
        <path className="campus-bag" d="M297 351h5v18h-5z" />
      </g>
      <g className="campus-student campus-student-two">
        <circle cx="340" cy="349" r="6" />
        <path d="m333 358 7-4 7 4 3 26h-20zm3 25h5v24h-5zm7 0h5v24h-5z" />
      </g>
      <g className="campus-student campus-student-near">
        <circle cx="408" cy="315" r="8" />
        <path d="m398 327 10-5 10 5 5 39h-30zm4 37h7v36h-7zm10 0h7v36h-7z" />
        <path className="campus-bag" d="M394 331h5v20h-5z" />
      </g>
      <g className="campus-student campus-student-near campus-student-two">
        <circle cx="478" cy="321" r="8" />
        <path d="m468 333 10-5 10 5 5 39h-30zm4 37h7v34h-7zm10 0h7v34h-7z" />
      </g>
    </svg>
  );
}

export function AuthBrandingPanel() {
  return (
    <aside className="auth-branding-panel relative flex min-h-[400px] flex-col justify-between overflow-hidden px-6 py-6 sm:min-h-[460px] sm:px-8 sm:py-8 lg:min-h-[660px] lg:px-8 lg:py-9 xl:px-10">
      <div aria-hidden="true" className="auth-branding-orb auth-branding-orb-one" />
      <div aria-hidden="true" className="auth-branding-orb auth-branding-orb-two" />

      <div className="relative z-10">
        <Link aria-label="SmartCampus home" className="inline-flex items-center gap-3" href="/">
          <span className="auth-branding-logo flex size-10 items-center justify-center rounded-xl">
            <AppIcon className="size-5" name="graduation" />
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-[-0.03em]">SmartCampus</span>
            <span className="auth-branding-tagline mt-1 block text-[9px] uppercase tracking-[0.14em]">
              Smart Student Life Assistant
            </span>
          </span>
        </Link>
      </div>

      <div aria-hidden="true" className="auth-campus-scene relative z-[2] my-2 min-h-[220px] max-h-[340px] flex-1 sm:my-3 lg:min-h-[260px]">
        <CampusIllustration />
      </div>

      <div className="relative z-10 mt-2 max-w-md sm:mt-3">
        <p className="auth-branding-eyebrow text-[9px] font-semibold uppercase tracking-[0.18em]">
          Your academic space
        </p>
        <h2 className="mt-3 max-w-md text-4xl font-semibold leading-[1.04] tracking-[-0.06em] xl:text-5xl">
          Make room for what matters.
        </h2>
        <p className="auth-branding-description mt-4 max-w-sm text-sm leading-6">
          Keep deadlines, attendance, borrowed books, and your campus plans
          connected to your student account.
        </p>
      </div>

      <Link
        className="auth-branding-home relative z-10 hidden w-fit text-[10px] font-medium transition-colors lg:inline-flex"
        href="/"
      >
        ← Back to homepage
      </Link>
    </aside>
  );
}
