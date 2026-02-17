import { NextResponse } from "next/server";
import { DEFAULT_RATES } from "@/lib/rates";

export async function GET() {
  return NextResponse.json(DEFAULT_RATES, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
