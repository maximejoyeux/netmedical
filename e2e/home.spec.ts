import { test, expect } from "@playwright/test";

test.describe("Page d'accueil", () => {
  test("affiche le titre", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /simulateur de revenu net — médecin libéral/i })
    ).toBeVisible();
  });

  test("affiche le logo NetMédical", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByAltText(/NetMédical/)).toBeVisible();
  });
});

test.describe("Chargement des taux", () => {
  test("affiche le formulaire une fois les taux chargés", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Simulation" })
    ).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByLabel(/honoraires annuels/i)
    ).toBeVisible();
    await expect(
      page.getByLabel(/régime/i)
    ).toBeVisible();
  });
});

test.describe("Formulaire et simulation", () => {
  test("affiche les champs du formulaire avec valeurs par défaut", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Simulation" })).toBeVisible(
      { timeout: 15_000 }
    );

    const honoraires = page.getByLabel(/honoraires annuels/i);
    await expect(honoraires).toHaveValue("120\u00A0000");

    const charges = page.getByLabel(/charges professionnelles/i);
    await expect(charges).toHaveValue("25\u00A0000");

    await expect(page.getByLabel(/régime/i)).toHaveValue("reel");
    await expect(page.getByLabel(/parts fiscales/i)).toHaveValue("2");
  });

  test("affiche le résultat de la simulation après chargement", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Simulation" })).toBeVisible(
      { timeout: 15_000 }
    );
    await expect(
      page.getByRole("heading", { name: /résultat de la simulation/i })
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/revenu net annuel/i)).toBeVisible();
    await expect(page.getByText(/revenu net mensuel/i)).toBeVisible();
  });

  test("changer les honoraires met à jour les résultats", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Simulation" })).toBeVisible(
      { timeout: 15_000 }
    );
    await expect(
      page.getByRole("heading", { name: /résultat de la simulation/i })
    ).toBeVisible({ timeout: 10_000 });

    const honoraires = page.getByLabel(/honoraires annuels/i);
    await honoraires.clear();
    await honoraires.fill("80 000");

    await expect(
      page.getByRole("heading", { name: /résultat de la simulation/i })
    ).toBeVisible();
    await expect(page.getByText(/revenu net annuel/i)).toBeVisible();
  });

  test("passer en Micro-BNC désactive le champ charges", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Simulation" })).toBeVisible(
      { timeout: 15_000 }
    );

    await page.getByLabel(/régime/i).selectOption("micro");

    const charges = page.getByLabel(/charges professionnelles/i);
    await expect(charges).toBeDisabled();
    await expect(charges).toHaveValue("0");
  });

  test("le graphique de répartition est affiché", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /résultat de la simulation/i })
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      page.getByText(/répartition des honoraires/i)
    ).toBeVisible();
    await expect(page.getByText(/cotisations/i).first()).toBeVisible();
    await expect(page.getByText(/impôt/i).first()).toBeVisible();
    await expect(page.getByText(/revenu net/i).first()).toBeVisible();
  });
});
