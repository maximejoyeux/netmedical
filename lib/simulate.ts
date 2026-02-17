import type {
  Regime,
  CotisationRate,
  TaxBracket,
  CotisationAmount,
  SimulateResponse,
} from "./types";

export function computeBnc(
  honoraires: number,
  charges: number,
  regime: Regime
): number {
  if (regime === "micro") {
    return Math.round(honoraires * 0.66 * 100) / 100;
  }
  return Math.round((honoraires - charges) * 100) / 100;
}

function getContributionAmount(bnc: number, c: CotisationRate): number {
  return Math.round((bnc * c.rate) / 100 * 100) / 100;
}

export function computeIncomeTax(
  revenuImposable: number,
  partsFiscales: number,
  taxBrackets: TaxBracket[]
): number {
  if (partsFiscales <= 0 || revenuImposable <= 0) return 0;
  const quotient = revenuImposable / partsFiscales;
  let taxOnQuotient = 0;
  for (const b of taxBrackets) {
    const from = b.from;
    const to = b.to === null ? Infinity : b.to;
    if (quotient <= from) break;
    const taxableInBracket = Math.min(quotient, to) - from;
    taxOnQuotient += (taxableInBracket * b.rate) / 100;
  }
  return Math.round(taxOnQuotient * partsFiscales * 100) / 100;
}

export function runSimulation(
  honoraires: number,
  charges: number,
  regime: Regime,
  partsFiscales: number,
  cotisations: CotisationRate[],
  taxBrackets: TaxBracket[]
): SimulateResponse {
  const bnc = computeBnc(honoraires, charges, regime);
  const cotisationAmounts: CotisationAmount[] = cotisations.map((c) => ({
    id: c.id,
    label: c.label,
    rate: c.rate,
    amount: getContributionAmount(bnc, c),
  }));
  const totalCotisations =
    Math.round(
      cotisationAmounts.reduce((sum, c) => sum + c.amount, 0) * 100
    ) / 100;
  const revenuImposable =
    Math.round((bnc - totalCotisations) * 100) / 100;
  const quotient =
    Math.round((revenuImposable / partsFiscales) * 100) / 100;
  const impot = computeIncomeTax(revenuImposable, partsFiscales, taxBrackets);
  const revenuNet = Math.round((bnc - totalCotisations - impot) * 100) / 100;
  const revenuNetMensuel = Math.round((revenuNet / 12) * 100) / 100;
  const tauxPrelevement =
    honoraires <= 0
      ? 0
      : Math.round(((honoraires - revenuNet) / honoraires) * 10000) / 100;

  return {
    bnc,
    cotisations: cotisationAmounts,
    totalCotisations,
    revenuImposable,
    quotient,
    impot,
    revenuNet,
    revenuNetMensuel,
    tauxPrelevement,
  };
}
