import { jsPDF } from "jspdf";
import type { FormValues } from "@/app/components/form";
import type { SimulateResponse } from "./types";

function formatEuro(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatEuroDecimals(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function buildSimulationPdf(
  formValues: FormValues,
  result: SimulateResponse,
  filename = "simulation-net-medical.pdf"
): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 20;
  let y = margin;
  const lineHeight = 7;
  const sectionGap = 10;

  doc.setFontSize(18);
  doc.text("NetMédical — Simulateur de Revenu Net", margin, y);
  y += lineHeight + 4;

  doc.setFontSize(10);
  doc.text(
    `Document généré le ${new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}`,
    margin,
    y
  );
  y += sectionGap;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Paramètres de la simulation", margin, y);
  y += lineHeight;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Honoraires annuels : ${formatEuro(formValues.honoraires)}`, margin, y);
  y += lineHeight;
  doc.text(`Régime : ${formValues.regime === "micro" ? "Micro-BNC" : "Réel"}`, margin, y);
  y += lineHeight;
  doc.text(`Charges professionnelles : ${formatEuro(formValues.charges)}`, margin, y);
  y += lineHeight;
  doc.text(`Parts fiscales : ${formValues.partsFiscales}`, margin, y);
  y += sectionGap;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Résultat de la simulation", margin, y);
  y += lineHeight;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Revenu net annuel : ${formatEuroDecimals(result.revenuNet)}`, margin, y);
  y += lineHeight;
  doc.text(`Revenu net mensuel : ${formatEuroDecimals(result.revenuNetMensuel)}`, margin, y);
  y += lineHeight;
  doc.text(`Taux de prélèvement : ${result.tauxPrelevement.toFixed(1)} %`, margin, y);
  y += lineHeight;
  doc.text(`Total cotisations : ${formatEuro(result.totalCotisations)}`, margin, y);
  y += lineHeight;
  doc.text(`Impôt sur le revenu : ${formatEuro(result.impot)}`, margin, y);
  y += sectionGap;

  doc.setFont("helvetica", "bold");
  doc.text("Détail des cotisations", margin, y);
  y += lineHeight;
  doc.setFont("helvetica", "normal");
  for (const c of result.cotisations) {
    doc.text(`${c.label} (${c.rate} %) : ${formatEuro(c.amount)}`, margin + 5, y);
    y += lineHeight - 1;
  }
  y += 2;

  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    "Ce document est une simulation indicative. NetMédical — simulateur médecin libéral.",
    margin,
    doc.internal.pageSize.getHeight() - 15
  );

  doc.save(filename);
}
