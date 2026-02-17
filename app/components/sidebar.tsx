"use client";

import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";

export default function Sidebar() {
  return (
    <aside
      className="hidden w-56 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 md:flex"
      role="banner"
    >
      <div className="flex h-18 items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
        <Link
          href="/"
          className="flex items-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-900"
        >
          <Image
            src="/net-medical.svg"
            alt="NetMédical — Accueil"
            width={250}
            height={60}
            className="dark:invert"
            priority
          />
        </Link>
        <ThemeToggle />
      </div>
      <nav className="flex-1 p-4" aria-label="Navigation principale">
        {/* Placeholder pour liens futurs (Simulation, etc.) */}
      </nav>
    </aside>
  );
}
