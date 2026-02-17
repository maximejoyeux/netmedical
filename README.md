# 🩺 Simulateur de Revenu Net — Médecin Libéral

Application Next.js permettant de simuler le revenu net annuel et mensuel d’un médecin libéral en France.

Déployé sur Vercel.

---

## 🚀 Objectif

Permettre à un utilisateur de :

- Saisir ses honoraires annuels
- Choisir son régime fiscal (Micro-BNC ou Réel)
- Saisir ses charges (si régime Réel)
- Indiquer son nombre de parts fiscales

Et obtenir :

- Le BNC
- Le détail des cotisations sociales
- L’impôt sur le revenu
- Le revenu net annuel
- Le revenu net mensuel
- Un graphique de répartition

---

## 🧮 Règles de Calcul

### 1️⃣ BNC

| Régime | Formule |
|--------|----------|
| Micro-BNC | `honoraires × 0.66` |
| Réel | `honoraires - charges` |

---

### 2️⃣ Cotisations Sociales

---

## 🧪 Tests

### Tests unitaires (Jest)

- Logique métier : `lib/simulate.ts` (BNC, impôt, simulation)
- Validation : `lib/validateSimulate.ts`

```bash
npm test
npm run test:coverage
```

### Tests E2E (Playwright)

- Page d’accueil, formulaire, résultats, graphique

```bash
# Installer les navigateurs (une fois)
npx playwright install chromium

# Lancer les tests (démarre le serveur sur le port 3001 si besoin)
npm run test:e2e

# Mode UI
npm run test:e2e:ui
```

**Note :** Si un `next dev` tourne déjà sur le port 3001, les tests réutilisent ce serveur. Sinon Playwright lance `npm run dev -- -p 3001` automatiquement.

