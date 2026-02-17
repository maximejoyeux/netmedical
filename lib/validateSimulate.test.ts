import { validateSimulateBody } from "./validateSimulate";

describe("validateSimulateBody", () => {
  it("returns error when body is null", () => {
    const result = validateSimulateBody(null);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("objet JSON");
    }
  });

  it("returns error when body is not an object", () => {
    expect(validateSimulateBody(undefined).ok).toBe(false);
    expect(validateSimulateBody(42).ok).toBe(false);
    expect(validateSimulateBody("string").ok).toBe(false);
    expect(validateSimulateBody([]).ok).toBe(false);
  });

  it("returns error when honoraires is NaN", () => {
    const result = validateSimulateBody({
      honoraires: NaN,
      charges: 0,
      regime: "micro",
      partsFiscales: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("honoraires");
  });

  it("returns error when honoraires is negative", () => {
    const result = validateSimulateBody({
      honoraires: -1000,
      charges: 0,
      regime: "micro",
      partsFiscales: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("honoraires");
  });

  it("accepts honoraires 0", () => {
    const result = validateSimulateBody({
      honoraires: 0,
      charges: 0,
      regime: "micro",
      partsFiscales: 1,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.honoraires).toBe(0);
  });

  it("returns error when charges is NaN", () => {
    const result = validateSimulateBody({
      honoraires: 100000,
      charges: NaN,
      regime: "reel",
      partsFiscales: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("charges");
  });

  it("returns error when charges is negative", () => {
    const result = validateSimulateBody({
      honoraires: 100000,
      charges: -5000,
      regime: "reel",
      partsFiscales: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("charges");
  });

  it("returns error when regime is invalid", () => {
    expect(
      validateSimulateBody({
        honoraires: 100000,
        charges: 0,
        regime: "invalid",
        partsFiscales: 1,
      }).ok
    ).toBe(false);
    expect(
      validateSimulateBody({
        honoraires: 100000,
        charges: 0,
        regime: "",
        partsFiscales: 1,
      }).ok
    ).toBe(false);
    expect(
      validateSimulateBody({
        honoraires: 100000,
        charges: 0,
        regime: null,
        partsFiscales: 1,
      }).ok
    ).toBe(false);
  });

  it("accepts regime 'micro' and 'reel'", () => {
    const micro = validateSimulateBody({
      honoraires: 100000,
      charges: 0,
      regime: "micro",
      partsFiscales: 1,
    });
    const reel = validateSimulateBody({
      honoraires: 100000,
      charges: 10000,
      regime: "reel",
      partsFiscales: 1,
    });
    expect(micro.ok).toBe(true);
    expect(reel.ok).toBe(true);
    if (micro.ok) expect(micro.data.regime).toBe("micro");
    if (reel.ok) expect(reel.data.regime).toBe("reel");
  });

  it("returns error when partsFiscales < 1", () => {
    const result = validateSimulateBody({
      honoraires: 100000,
      charges: 0,
      regime: "micro",
      partsFiscales: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("partsFiscales");
  });

  it("returns error when partsFiscales is not an integer", () => {
    expect(
      validateSimulateBody({
        honoraires: 100000,
        charges: 0,
        regime: "micro",
        partsFiscales: 2.5,
      }).ok
    ).toBe(false);
  });

  it("returns error when partsFiscales is NaN", () => {
    const result = validateSimulateBody({
      honoraires: 100000,
      charges: 0,
      regime: "micro",
      partsFiscales: NaN,
    });
    expect(result.ok).toBe(false);
  });

  it("accepts partsFiscales integer >= 1", () => {
    const result = validateSimulateBody({
      honoraires: 100000,
      charges: 0,
      regime: "micro",
      partsFiscales: 3,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.partsFiscales).toBe(3);
  });

  it("returns error when regime is reel and charges > honoraires", () => {
    const result = validateSimulateBody({
      honoraires: 50_000,
      charges: 60_000,
      regime: "reel",
      partsFiscales: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("charges");
  });

  it("accepts regime reel when charges <= honoraires", () => {
    const result = validateSimulateBody({
      honoraires: 100_000,
      charges: 100_000,
      regime: "reel",
      partsFiscales: 1,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.charges).toBe(100_000);
  });

  it("forces charges to 0 when regime is micro", () => {
    const result = validateSimulateBody({
      honoraires: 100000,
      charges: 25000,
      regime: "micro",
      partsFiscales: 1,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.charges).toBe(0);
  });

  it("rejects non-integer partsFiscales", () => {
    const result = validateSimulateBody({
      honoraires: 100000,
      charges: 0,
      regime: "micro",
      partsFiscales: 2.9,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("partsFiscales");
  });

  it("coerces string numbers to number", () => {
    const result = validateSimulateBody({
      honoraires: "120000" as unknown as number,
      charges: "25000" as unknown as number,
      regime: "reel",
      partsFiscales: "2" as unknown as number,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.honoraires).toBe(120_000);
      expect(result.data.charges).toBe(25_000);
      expect(result.data.partsFiscales).toBe(2);
    }
  });

  it("valid full body returns data", () => {
    const result = validateSimulateBody({
      honoraires: 120_000,
      charges: 25_000,
      regime: "reel",
      partsFiscales: 2,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({
        honoraires: 120_000,
        charges: 25_000,
        regime: "reel",
        partsFiscales: 2,
      });
    }
  });
});
