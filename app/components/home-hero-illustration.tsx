"use client";

import Image from "next/image";
import { useTheme } from "./theme-provider";

export function HomeHeroIllustration() {
  const { theme } = useTheme();
  const image =
    theme === "dark"
      ? "/images/student-learning-illustration-dark.jpeg"
      : "/images/student-learning-illustration.jpeg";

  return (
    <div className="home-hero-art-surface relative mx-auto aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-[22px] p-1.5 sm:p-2 lg:max-w-none">
      <Image
        alt="Student learning with digital tools and books"
        className="h-full w-full object-contain"
        height={405}
        priority
        sizes="(max-width: 1023px) calc(100vw - 2rem), 42vw"
        src={image}
        width={496}
      />
    </div>
  );
}
