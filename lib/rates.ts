import type { RatesResponse } from "./types";

export const DEFAULT_RATES: RatesResponse = {
  year: 2025,
  cotisations: [
    { id: "urssaf", label: "URSSAF (maladie, alloc.)", rate: 10.0 },
    { id: "retraite", label: "Retraite (CARMF)", rate: 12.0 },
    { id: "csg-crds", label: "CSG-CRDS", rate: 9.7 },
  ],
  taxBrackets: [
    { from: 0, to: 11294, rate: 0 },
    { from: 11294, to: 28797, rate: 11 },
    { from: 28797, to: 82341, rate: 30 },
    { from: 82341, to: 177106, rate: 41 },
    { from: 177106, to: null, rate: 45 },
  ],
};
