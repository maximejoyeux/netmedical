import type { RatesResponse, SimulateRequest, SimulateResponse } from "./types";

const BASE = "";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export async function fetchRates(): Promise<RatesResponse> {
  return fetchJson<RatesResponse>(`${BASE}/api/rates`);
}

export async function simulate(body: SimulateRequest): Promise<SimulateResponse> {
  return fetchJson<SimulateResponse>(`${BASE}/api/simulate`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
