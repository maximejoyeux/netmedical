export type Regime = "micro" | "reel";

export interface SimulateRequest {
  honoraires: number;
  charges: number;
  regime: Regime;
  partsFiscales: number;
}

export interface CotisationRate {
  id: string;
  label: string;
  rate: number;
}

export interface TaxBracket {
  from: number;
  to: number | null;
  rate: number;
}

export interface RatesResponse {
  year: number;
  cotisations: CotisationRate[];
  taxBrackets: TaxBracket[];
}

export interface CotisationAmount {
  id: string;
  label: string;
  rate: number;
  amount: number;
}

export interface SimulateResponse {
  bnc: number;
  cotisations: CotisationAmount[];
  totalCotisations: number;
  revenuImposable: number;
  quotient: number;
  impot: number;
  revenuNet: number;
  revenuNetMensuel: number;
  tauxPrelevement: number;
}
