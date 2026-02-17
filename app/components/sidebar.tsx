"use client";

import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex h-18 items-center border-b border-zinc-200 px-5 dark:border-zinc-700">
        <Link href="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-zinc-400 rounded">
          <Image
            src="/net-medical.svg"
            alt="NetMédical"
            width={250}
            height={60}
            className="dark:invert"
            priority
          />
        </Link>
      </div>
      <nav className="flex-1 p-4" aria-label="Navigation principale">
        {/* Placeholder pour liens futurs (Simulation, etc.) */}
      </nav>
    </aside>
  );
}
