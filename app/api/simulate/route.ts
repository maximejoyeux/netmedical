import { NextRequest, NextResponse } from "next/server";
import { runSimulation } from "@/lib/simulate";
import { validateSimulateBody } from "@/lib/validateSimulate";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corps JSON invalide" },
      { status: 400 }
    );
  }

  const validated = validateSimulateBody(body);
  if (!validated.ok) {
    return NextResponse.json(
      { error: validated.message },
      { status: 400 }
    );
  }

  const { honoraires, charges, regime, partsFiscales } = validated.data;

  const { DEFAULT_RATES: rates } = await import("@/lib/rates");

  const result = runSimulation(
    honoraires,
    charges,
    regime,
    partsFiscales,
    rates.cotisations,
    rates.taxBrackets
  );

  return NextResponse.json(result);
}
