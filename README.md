# Velocity Analytics

Tableau de bord non officiel pour explorer les Grands Prix, les classements de séances et la télémétrie de course fournis par [OpenF1](https://openf1.org/docs/). Le projet utilise React, TypeScript, Vite et Tailwind CSS.

> **Statut de publication :** le code est placé sous licence MIT.

## Fonctionnalités

- Calendrier 2024–2026 alimenté par les séances OpenF1 lorsqu'elles sont disponibles.
- Classements de course, essais, qualifications, sprint et qualifications sprint selon les données disponibles pour le week-end.
- Positions reconstruites à la fin des tours horodatés, temps au tour, secteurs, relais, météo et messages de direction de course.
- Portrait du vainqueur et tracé du circuit sur les pages de course lorsque les médias sont disponibles ; une donnée manquante reste indiquée comme indisponible.
- Classements pilotes et constructeurs **2025 et 2026 issus de fichiers statiques**. Ce ne sont pas des classements en direct.

## Démarrage local

Prérequis : Node.js 20 ou plus récent et npm. Aucune clé API n'est nécessaire pour les données historiques publiques.

```bash
npm ci
npm run dev
```

Ouvrez l'adresse affichée par Vite (par défaut `http://127.0.0.1:3000/`).

```bash
npm run typecheck   # vérification TypeScript
npm run build       # génère dist/
npm run preview     # prévisualise le build de production
```

Le paquet est volontairement marqué `private` : publier le code dans un dépôt public ne nécessite pas de publier un paquet npm.

## Origine et limites des données

Les résultats et la télémétrie d'une course proviennent des endpoints OpenF1 (`/sessions`, `/session_result`, `/laps`, `/position`, `/stints`, `/weather`, etc.). L'application effectue les requêtes directement depuis le navigateur avec un cache mémoire et une limitation du débit. Les réponses incomplètes peuvent produire des cellules vides ; aucune position ou durée de tour n'est inventée pour les combler.

Le calendrier 2026 écarte les séances prévues en avril à Bahreïn et en Arabie saoudite : [Formula 1 a confirmé qu'elles n'auraient pas lieu](https://www.formula1.com/en/latest/article/bahrain-and-saudi-arabian-grands-prix-will-not-take-place-in-april.1hnqllVG85RSt8pbFc5Ivx.1hnqllVG85RSt8pbFc5Ivx). Le Grand Prix de Bahreïn disputé en Malaisie en octobre reste présent, conformément au [calendrier officiel](https://www.formula1.com/en/racing/2026).

OpenF1 rend les données historiques accessibles sans authentification. Selon [sa documentation](https://openf1.org/docs/), les données pendant une séance en direct demandent un abonnement. Cette application ne contient ni identifiant ni jeton OpenF1. Si un déploiement doit fournir du direct, l'authentification et le cache partagé doivent être réalisés côté serveur ; ne placez jamais de secret dans le code Vite ou dans une variable `VITE_*`.

Les tableaux de championnat 2025 et 2026 sont des instantanés intégrés dans `services/season2025Data.ts` et `services/season2026Data.ts`. L'interface les désigne comme tels. Le calendrier et l'analyse détaillée exigent des séances OpenF1 identifiables ; si le calendrier ne peut être chargé, l'application signale son indisponibilité sans inventer de courses ou de résultats.

## Organisation

| Chemin | Rôle |
| --- | --- |
| `App.tsx` | Navigation et sélection de course |
| `components/` | Pages, cartes, graphiques et chargement |
| `services/f1Api.ts` | Requêtes OpenF1 et reconstruction des données |
| `services/circuitData.ts` | Métadonnées et tracés de circuit |
| `services/season*Data.ts` | Instantanés de championnat |
| `public/images/` | Médias (tracés de circuits, pilotes, écuries) |

## Déploiement et contribution

`npm run build` produit un site statique dans `dist/`. Servez-le en HTTPS et configurez un cache ainsi qu'une surveillance des erreurs OpenF1 pour un trafic public. Une intégration continue vérifie TypeScript, le build et les dépendances de production.

Vite copie les fichiers présents dans `public/` pendant le build.

Les contributions sont bienvenues via issues et pull requests. Avant d'ouvrir une PR, lancez `npm run typecheck` et `npm run build`, décrivez la source des nouvelles données et n'ajoutez aucun média ou secret sans droit de redistribution vérifié.

## Licence et attribution

Le code original du projet est sous [licence MIT](LICENSE). La police [Oxanium](public/licenses/Oxanium-OFL.txt) est distribuée sous SIL Open Font License 1.1. Les marques, photos, logos, tracés et données de tiers ne sont pas couverts par la licence MIT du code. Ce projet n'est affilié ni à Formula 1 ni à OpenF1.
