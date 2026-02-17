import {
  computeBnc,
  computeIncomeTax,
  runSimulation,
} from "./simulate";
import { DEFAULT_RATES } from "./rates";

describe("computeBnc", () => {
  describe("regime micro", () => {
    it("returns 66% of honoraires (34% flat deduction)", () => {
      expect(computeBnc(100_000, 0, "micro")).toBe(66_000);
      expect(computeBnc(120_000, 25_000, "micro")).toBe(79_200);
    });

    it("returns 0 when honoraires is 0", () => {
      expect(computeBnc(0, 0, "micro")).toBe(0);
    });

    it("ignores charges in micro regime", () => {
      expect(computeBnc(100_000, 50_000, "micro")).toBe(66_000);
    });

    it("rounds to 2 decimals", () => {
      expect(computeBnc(1000, 0, "micro")).toBe(660);
      expect(computeBnc(1001, 0, "micro")).toBe(660.66);
    });
  });

  describe("regime reel", () => {
    it("returns honoraires minus charges", () => {
      expect(computeBnc(100_000, 25_000, "reel")).toBe(75_000);
      expect(computeBnc(120_000, 25_000, "reel")).toBe(95_000);
    });

    it("returns honoraires when charges is 0", () => {
      expect(computeBnc(100_000, 0, "reel")).toBe(100_000);
    });

    it("returns 0 when charges equal honoraires", () => {
      expect(computeBnc(100_000, 100_000, "reel")).toBe(0);
    });

    it("rounds to 2 decimals", () => {
      expect(computeBnc(100_000.123, 25_000.456, "reel")).toBe(74_999.67);
    });
  });
});

describe("computeIncomeTax", () => {
  const brackets = DEFAULT_RATES.taxBrackets;

  it("returns 0 when partsFiscales <= 0", () => {
    expect(computeIncomeTax(30_000, 0, brackets)).toBe(0);
    expect(computeIncomeTax(30_000, -1, brackets)).toBe(0);
  });

  it("returns 0 when revenuImposable <= 0", () => {
    expect(computeIncomeTax(0, 1, brackets)).toBe(0);
    expect(computeIncomeTax(-100, 1, brackets)).toBe(0);
  });

  it("returns 0 when quotient is in first bracket (0 to 11294)", () => {
    expect(computeIncomeTax(10_000, 1, brackets)).toBe(0);
    expect(computeIncomeTax(22_588, 2, brackets)).toBe(0);
  });

  it("applies 11% on second bracket (11294 to 28797)", () => {
    expect(computeIncomeTax(20_000, 1, brackets)).toBe(957.66);
    expect(computeIncomeTax(40_000, 2, brackets)).toBe(1915.32);
  });

  it("applies progressive brackets correctly", () => {
    expect(computeIncomeTax(35_000, 1, brackets)).toBe(3786.23);
  });

  it("handles quotient in top bracket (to: null)", () => {
    const tax =
      (28_797 - 11_294) * 0.11 +
      (82_341 - 28_797) * 0.3 +
      (177_106 - 82_341) * 0.41 +
      (200_000 - 177_106) * 0.45;
    expect(computeIncomeTax(200_000, 1, brackets)).toBe(
      Math.round(tax * 100) / 100
    );
  });

  it("rounds result to 2 decimals", () => {
    const result = computeIncomeTax(32_442.5, 1, brackets);
    expect(Number.isInteger(result * 100)).toBe(true);
  });
});

describe("runSimulation", () => {
  const { cotisations, taxBrackets } = DEFAULT_RATES;

  it("returns correct structure with all required fields", () => {
    const result = runSimulation(
      100_000,
      0,
      "micro",
      1,
      cotisations,
      taxBrackets
    );
    expect(result).toMatchObject({
      bnc: expect.any(Number),
      cotisations: expect.any(Array),
      totalCotisations: expect.any(Number),
      revenuImposable: expect.any(Number),
      quotient: expect.any(Number),
      impot: expect.any(Number),
      revenuNet: expect.any(Number),
      revenuNetMensuel: expect.any(Number),
      tauxPrelevement: expect.any(Number),
    });
    expect(result.cotisations.length).toBe(cotisations.length);
  });

  it("verification example: 120000 honoraires, 25000 charges, reel, 2 parts", () => {
    const result = runSimulation(
      120_000,
      25_000,
      "reel",
      2,
      cotisations,
      taxBrackets
    );
    expect(result.bnc).toBe(95_000);
    expect(result.totalCotisations).toBe(30_115);
    expect(result.revenuImposable).toBe(64_885);
    expect(result.quotient).toBe(32_442.5);
    expect(result.revenuNet).toBe(
      result.bnc - result.totalCotisations - result.impot
    );
    expect(result.revenuNetMensuel).toBe(
      Math.round((result.revenuNet / 12) * 100) / 100
    );
  });

  it("micro regime: BNC is 66% of honoraires, charges ignored", () => {
    const result = runSimulation(
      100_000,
      30_000,
      "micro",
      1,
      cotisations,
      taxBrackets
    );
    expect(result.bnc).toBe(66_000);
    const totalRates = cotisations.reduce((s, c) => s + c.rate, 0);
    expect(result.totalCotisations).toBeCloseTo(
      (66_000 * totalRates) / 100,
      0
    );
  });

  it("honoraires 0: revenuNet 0, tauxPrelevement 0", () => {
    const result = runSimulation(
      0,
      0,
      "micro",
      1,
      cotisations,
      taxBrackets
    );
    expect(result.bnc).toBe(0);
    expect(result.totalCotisations).toBe(0);
    expect(result.revenuImposable).toBe(0);
    expect(result.impot).toBe(0);
    expect(result.revenuNet).toBe(0);
    expect(result.revenuNetMensuel).toBe(0);
    expect(result.tauxPrelevement).toBe(0);
  });

  it("cotisations match BNC * rate / 100 per line", () => {
    const result = runSimulation(
      95_000,
      0,
      "reel",
      1,
      cotisations,
      taxBrackets
    );
    expect(result.bnc).toBe(95_000);
    result.cotisations.forEach((c, i) => {
      const expected = Math.round((95_000 * cotisations[i].rate) / 100 * 100) / 100;
      expect(c.amount).toBe(expected);
      expect(c.id).toBe(cotisations[i].id);
      expect(c.label).toBe(cotisations[i].label);
      expect(c.rate).toBe(cotisations[i].rate);
    });
  });

  it("revenuNet = bnc - totalCotisations - impot", () => {
    const result = runSimulation(
      120_000,
      25_000,
      "reel",
      2,
      cotisations,
      taxBrackets
    );
    const expectedNet =
      result.bnc - result.totalCotisations - result.impot;
    expect(result.revenuNet).toBe(Math.round(expectedNet * 100) / 100);
  });

  it("revenuNetMensuel = revenuNet / 12 rounded 2 decimals", () => {
    const result = runSimulation(
      100_000,
      0,
      "micro",
      1,
      cotisations,
      taxBrackets
    );
    expect(result.revenuNetMensuel).toBe(
      Math.round((result.revenuNet / 12) * 100) / 100
    );
  });

  it("tauxPrelevement is (honoraires - revenuNet) / honoraires * 100 when honoraires > 0", () => {
    const result = runSimulation(
      100_000,
      0,
      "micro",
      1,
      cotisations,
      taxBrackets
    );
    const expected =
      Math.round(((100_000 - result.revenuNet) / 100_000) * 10000) / 100;
    expect(result.tauxPrelevement).toBe(expected);
  });
});
