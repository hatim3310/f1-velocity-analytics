# Médias et contenus tiers

Ce document sépare la licence du code de celle des médias. La licence MIT à la racine du projet ne donne **aucun droit** sur les photos, logos, marques, cartes ou données de tiers.

Les fichiers sous `public/images/` sont conservés pour le travail local mais exclus du dépôt par `.gitignore`. Le dépôt peut être cloné et compilé sans eux ; consultez le [guide de ce dossier](public/images/README.md).

Le dépôt public existant a déjà contenu des portraits, logos et polices dans ses anciens commits. Leur suppression dans la branche actuelle empêche leur inclusion dans les nouveaux clones compilés, mais ne les efface pas de l'historique Git. Si les détenteurs des droits exigent leur retrait complet, il faudra traiter séparément cet historique et les éventuelles copies déjà distribuées.

## Inventaire local au 23 octobre 2026

| Emplacement | Fichiers actifs | Situation |
| --- | ---: | --- |
| `public/images/drivers/` | 24 portraits de secours | Provenance et autorisation de redistribution non documentées |
| `public/images/teams/` | 10 logos | Provenance et autorisation de redistribution non documentées |
| `public/images/circuits/` | 24 tracés SVG | Provenance et autorisation de redistribution non documentées |
| `public/licenses/Oxanium-OFL.txt` | 1 licence | Police Oxanium distribuée par `@fontsource/oxanium` sous OFL-1.1 |

Les anciennes polices intitulées `Formula1-*` ont été retirées et remplacées par Oxanium. [Les règles publiques de Formula 1](https://www.formula1.com/en/information/guidelines.4EOKE9RRqevL4niTK9kWyt) indiquent que leurs polices officielles exigent une licence écrite, et que les droits sur les images fixes appartiennent à leurs détenteurs respectifs.

## Ressources chargées à l'exécution

- Les classements, séances et échantillons de télémétrie proviennent de [l'API OpenF1](https://openf1.org/docs/). Vérifiez les conditions applicables à votre usage, notamment pour le direct et un usage commercial.
- Les portraits haute résolution et certaines cartes sont demandés au domaine `media.formula1.com`. Le projet ne détient pas de licence documentée pour les exploiter dans un site public.
- Les drapeaux sont demandés à `flagcdn.com`. La disponibilité et les conditions d'utilisation de ce service doivent être vérifiées pour le déploiement cible.

## Avant de distribuer les médias ou de déployer le site

1. Obtenir et conserver une preuve des droits de redistribution et d'affichage pour chaque média actif, **ou** le remplacer par un média sous licence compatible.
2. Documenter pour chaque fichier conservé son auteur, sa source, sa licence et l'attribution demandée.
3. Réexaminer les URLs d'images distantes et les droits d'affichage associés avant un déploiement.

Les fichiers présents permettent de travailler localement ; cet inventaire ne constitue pas une autorisation de les republier.
