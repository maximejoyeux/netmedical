"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "./components/sidebar";
import ThemeToggle from "./components/theme-toggle";
import Form, { FormValues } from "./components/form";
import Results from "./components/results";
import { fetchRates, simulate } from "@/lib/api";
import { buildSimulationPdf } from "@/lib/pdfExport";
import type { RatesResponse, SimulateResponse } from "@/lib/types";

type RatesState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: RatesResponse };

export default function Home() {
  const [formValues, setFormValues] = useState<FormValues>({
    honoraires: 120000,
    charges: 25000,
    regime: "reel",
    partsFiscales: 2,
  });

  const [ratesState, setRatesState] = useState<RatesState>({ status: "loading" });
  const [simResult, setSimResult] = useState<SimulateResponse | null>(null);
  const [simError, setSimError] = useState<string | null>(null);
  const [simLoading, setSimLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    setRatesState({ status: "loading" });
    fetchRates()
      .then((data) => {
        if (!cancelled) setRatesState({ status: "success", data });
      })
      .catch((err) => {
        if (!cancelled) {
          setRatesState({
            status: "error",
            message: err instanceof Error ? err.message : "Erreur chargement des taux",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const runSim = useCallback(
    (values: FormValues) => {
      if (ratesState.status !== "success") return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        setSimLoading(true);
        setSimError(null);
        simulate({
          honoraires: values.honoraires,
          charges: values.charges,
          regime: values.regime,
          partsFiscales: values.partsFiscales,
        })
          .then(setSimResult)
          .catch((err) => {
            setSimError(err instanceof Error ? err.message : "Erreur simulation");
            setSimResult(null);
          })
          .finally(() => setSimLoading(false));
      }, 300);
    },
    [ratesState.status]
  );

  useEffect(() => {
    runSim(formValues);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [formValues, runSim]);

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <a href="#contenu-principal" className="skip-link">
        Aller au contenu principal
      </a>
      <Sidebar />
      <main
        id="contenu-principal"
        className="flex-1 overflow-auto"
        role="main"
        tabIndex={-1}
      >
        <div className="mx-auto flex items-center flex-col px-4 py-8 pt-2 sm:px-6">
          <header className="mb-4 flex items-center gap-3 md:hidden">
            <Link
              href="/"
              className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-900"
            >
              <Image
                src="/net-medical.svg"
                alt="NetMédical — Accueil"
                width={220}
                height={53}
                className="dark:invert"
                priority
              />
            </Link>
            <div className="absolute right-2">
              <ThemeToggle/>
            </div>
          </header>
          <h1 className="text-center mt-4 font-semibold text-zinc-900 dark:text-zinc-50 text-xl">
            Simulateur de Revenu Net — Médecin Libéral
          </h1>

          {ratesState.status === "loading" && (
            <div className="mt-8 text-zinc-500 dark:text-zinc-400">
              Chargement des taux…
            </div>
          )}

          {ratesState.status === "error" && (
            <div
              className="mt-8 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200"
              role="alert"
            >
              <p className="font-medium">Erreur</p>
              <p className="text-sm">{ratesState.message}</p>
            </div>
          )}

          {ratesState.status === "success" && (
            <div className="flex flex-col w-full items-center sm:items-start justify-center gap-6 lg:flex-row">
              <div className="mt-8 w-full">
                <Form values={formValues} onChange={setFormValues} />
              </div>

              {simLoading && !simResult && (
                <div className="mt-6 text-zinc-500 dark:text-zinc-400">
                  Calcul en cours…
                </div>
              )}

              {simError && (
                <div
                  className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200"
                  role="alert"
                >
                  {simError}
                </div>
              )}

              {simResult && !simError && (
                <div className="mt-8 w-full">
                  <Results
                    data={simResult}
                    honoraires={formValues.honoraires}
                    onExportPdf={() =>
                      buildSimulationPdf(formValues, simResult)
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
