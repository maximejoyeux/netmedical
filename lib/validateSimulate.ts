import type { SimulateRequest, Regime } from "./types";

const REGIMES: Regime[] = ["micro", "reel"];

export function validateSimulateBody(
  body: unknown
): { ok: true; data: SimulateRequest } | { ok: false; message: string } {
  if (body === null || typeof body !== "object") {
    return { ok: false, message: "Le corps doit être un objet JSON" };
  }
  const o = body as Record<string, unknown>;
  const honoraires =
    typeof o.honoraires === "number" ? o.honoraires : Number(o.honoraires);
  const charges =
    typeof o.charges === "number" ? o.charges : Number(o.charges);
  const regime = o.regime as string | undefined;
  const partsFiscales =
    typeof o.partsFiscales === "number"
      ? o.partsFiscales
      : Number(o.partsFiscales);

  if (Number.isNaN(honoraires) || honoraires < 0) {
    return {
      ok: false,
      message: "honoraires doit être un nombre positif ou nul",
    };
  }
  if (Number.isNaN(charges) || charges < 0) {
    return {
      ok: false,
      message: "charges doit être un nombre positif ou nul",
    };
  }
  if (!REGIMES.includes(regime as Regime)) {
    return { ok: false, message: "regime doit être 'micro' ou 'reel'" };
  }
  if (
    Number.isNaN(partsFiscales) ||
    partsFiscales < 1 ||
    !Number.isInteger(partsFiscales)
  ) {
    return {
      ok: false,
      message: "partsFiscales doit être un entier ≥ 1",
    };
  }
  if (regime === "reel" && charges > honoraires) {
    return {
      ok: false,
      message:
        "les charges ne peuvent pas dépasser les honoraires en régime réel",
    };
  }

  return {
    ok: true,
    data: {
      honoraires,
      charges: regime === "micro" ? 0 : charges,
      regime: regime as Regime,
      partsFiscales: Math.floor(partsFiscales),
    },
  };
}
