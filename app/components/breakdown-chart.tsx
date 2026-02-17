"use client";

import type { SimulateResponse } from "@/lib/types";

interface BreakdownChartProps {
  data: SimulateResponse;
  honoraires: number;
}

export default function BreakdownChart({ data, honoraires }: BreakdownChartProps) {
  if (honoraires <= 0) return null;

  const pctCotisations = (data.totalCotisations / honoraires) * 100;
  const pctImpot = (data.impot / honoraires) * 100;
  const pctNet = (data.revenuNet / honoraires) * 100;

  return (
    <div className="w-full space-y-2">
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        Répartition des honoraires
      </p>
      <div className="flex h-10 w-full overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-700">
        <div
          className="bg-amber-500 transition-all duration-300"
          style={{ width: `${pctCotisations}%` }}
          title={`Cotisations: ${data.totalCotisations.toLocaleString("fr-FR")} €`}
        />
        <div
          className="bg-rose-500 transition-all duration-300"
          style={{ width: `${pctImpot}%` }}
          title={`Impôt: ${data.impot.toLocaleString("fr-FR")} €`}
        />
        <div
          className="bg-emerald-600 transition-all duration-300"
          style={{ width: `${pctNet}%` }}
          title={`Revenu net: ${data.revenuNet.toLocaleString("fr-FR")} €`}
        />
      </div>
      <div className="flex flex-wrap gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-amber-500" />
          Cotisations ({pctCotisations.toFixed(1)} %)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-rose-500" />
          Impôt ({pctImpot.toFixed(1)} %)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-emerald-600" />
          Revenu net ({pctNet.toFixed(1)} %)
        </span>
      </div>
    </div>
  );
}
