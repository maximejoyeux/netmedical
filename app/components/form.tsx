"use client";

import { ChangeEvent } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";

export type Regime = "micro" | "reel";

export interface FormValues {
  honoraires: number;
  charges: number;
  regime: Regime;
  partsFiscales: number;
}

interface FormProps {
  values: FormValues;
  onChange: (values: FormValues) => void;
}

function formatThousands(n: number): string {
  if (Number.isNaN(n) || n < 0) return "0";
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
}

function parseFormattedValue(s: string): number {
  const raw = s.replace(/\s/g, "");
  const value = Number(raw);
  return Number.isNaN(value) ? 0 : Math.max(0, Math.round(value));
}

export default function Form({ values, onChange }: FormProps) {
  const handleNumberChange =
    (field: keyof FormValues) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);

      onChange({
        ...values,
        [field]: isNaN(value) ? 0 : value,
      });
    };

  const handleFormattedNumberChange =
    (field: "honoraires" | "charges") =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = parseFormattedValue(e.target.value);
      onChange({ ...values, [field]: value });
    };

  const selectAllOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleRegimeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const regime = e.target.value as Regime;

    onChange({
      ...values,
      regime,
      charges: regime === "micro" ? 0 : values.charges,
    });
  };

  return (
    <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Simulation
      </h2>
      <div className="flex flex-col gap-1">
        <Label htmlFor="honoraires">Honoraires annuels (€)</Label>
        <Input
          id="honoraires"
          type="text"
          inputMode="numeric"
          min={0}
          value={formatThousands(values.honoraires)}
          onChange={handleFormattedNumberChange("honoraires")}
          onFocus={selectAllOnFocus}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="regime">Régime</Label>
        <Select
          id="regime"
          value={values.regime}
          onChange={handleRegimeChange}
        >
          <option value="micro">Micro-BNC</option>
          <option value="reel">Réel</option>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="charges">Charges professionnelles (€)</Label>
        <Input
          id="charges"
          type="text"
          inputMode="numeric"
          min={0}
          disabled={values.regime === "micro"}
          value={
            values.regime === "micro"
              ? "0"
              : formatThousands(values.charges)
          }
          onChange={handleFormattedNumberChange("charges")}
          onFocus={selectAllOnFocus}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="partsFiscales">Parts fiscales</Label>
        <Input
          id="partsFiscales"
          type="number"
          min={1}
          step={1}
          value={values.partsFiscales}
          onChange={handleNumberChange("partsFiscales")}
          onFocus={selectAllOnFocus}
        />
      </div>
    </div>
  );
}
