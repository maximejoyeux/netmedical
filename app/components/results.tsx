"use client";

import type { SimulateResponse } from "@/lib/types";
import BreakdownChart from "./breakdown-chart";
import { Button } from "./ui/button";

interface ResultsProps {
  data: SimulateResponse;
  honoraires: number;
  onExportPdf?: () => void;
}

function formatEuro(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatEuroDecimals(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export default function Results({ data, honoraires, onExportPdf }: ResultsProps) {
  return (
    <div className="w-full space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Résultat de la simulation
        </h2>
        {onExportPdf && (
          <Button
            type="button"
            variant="secondary"
            onClick={onExportPdf}
            aria-label="Télécharger le résultat en PDF"
          >
            Télécharger en PDF
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Revenu net annuel
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatEuroDecimals(data.revenuNet)}
          </p>
        </div>
        <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Revenu net mensuel
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatEuroDecimals(data.revenuNetMensuel)}
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Taux de prélèvement
        </p>
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {data.tauxPrelevement.toFixed(1)} %
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Détail des cotisations
        </p>
        <ul className="space-y-1">
          {data.cotisations.map((c) => (
            <li
              key={c.id}
              className="flex justify-between text-sm text-zinc-700 dark:text-zinc-300"
            >
              <span>
                {c.label} ({c.rate} %)
              </span>
              <span>{formatEuro(c.amount)}</span>
            </li>
          ))}
          <li className="flex justify-between border-t border-zinc-200 pt-2 font-medium dark:border-zinc-700">
            <span>Total cotisations</span>
            <span>{formatEuro(data.totalCotisations)}</span>
          </li>
        </ul>
      </div>

      <div className="flex justify-between border-t border-zinc-200 pt-2 dark:border-zinc-700">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          Impôt sur le revenu
        </span>
        <span className="font-medium">{formatEuro(data.impot)}</span>
      </div>

      <div className="pt-2">
        <BreakdownChart data={data} honoraires={honoraires} />
      </div>
    </div>
  );
}
