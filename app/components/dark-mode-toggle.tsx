"use client";

import { AppIcon } from "./app-icon";
import { useTheme } from "./theme-provider";

export function DarkModeToggle({
  variant = "icon",
}: {
  variant?: "icon" | "settings";
}) {
  const { theme, toggleTheme } = useTheme();
  const darkModeEnabled = theme === "dark";

  if (variant === "settings") {
    return (
      <button
        aria-checked={darkModeEnabled}
        className="inline-flex min-h-10 items-center gap-3 rounded-full border border-[#d9d9d6] bg-white px-3 text-xs font-semibold text-[#555] transition hover:bg-[#f5f5f3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        onClick={toggleTheme}
        role="switch"
        type="button"
      >
        <span
          aria-hidden="true"
          className={`relative h-5 w-9 rounded-full transition ${
            darkModeEnabled ? "bg-[#303030]" : "bg-[#c8c8c5]"
          }`}
        >
          <span
            className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition ${
              darkModeEnabled ? "left-[18px]" : "left-0.5"
            }`}
          />
        </span>
        {darkModeEnabled ? "On" : "Off"}
      </button>
    );
  }

  return (
    <button
      aria-label={darkModeEnabled ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={darkModeEnabled}
      className="flex size-10 items-center justify-center rounded-full border border-[#e5e5e5] bg-white text-[#555] transition hover:bg-[#f5f5f3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      onClick={toggleTheme}
      title={darkModeEnabled ? "Light mode" : "Dark mode"}
      type="button"
    >
      {darkModeEnabled ? (
        <svg
          aria-hidden="true"
          className="size-[17px]"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
      ) : (
        <AppIcon className="size-[17px]" name="spark" />
      )}
    </button>
  );
}
