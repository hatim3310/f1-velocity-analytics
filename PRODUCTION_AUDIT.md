# Audit de préparation à la production

**Date :** 23 octobre 2026

**Verdict :** le code peut être publié sous MIT sans les médias locaux, désormais ignorés par Git. Le **site n'est pas prêt pour un déploiement public en production** tant que les droits des médias affichés à l'exécution et la fiabilité du service de données ne sont pas réglés.

## Vérifications effectuées

| Contrôle | Résultat |
| --- | --- |
| `npm ci` | Réussi depuis le lockfile après arrêt des serveurs Vite qui verrouillaient une bibliothèque native sous Windows |
| `npm run typecheck` | Réussi, aucune erreur TypeScript |
| `npm run build` | Réussi avec Vite 6 ; sortie statique dans `dist/` |
| `npm audit --json` | 0 vulnérabilité signalée au moment de l'audit |
| `npm audit --omit=dev --json` | 0 vulnérabilité signalée dans les dépendances de production |
| Navigation locale | Calendrier → course → retour au calendrier vérifié dans le navigateur |
| Préchargeur | Tracé SVG local, étapes liées aux phases de chargement, animation indéterminée pour le calendrier, réduction des animations respectée |
| Clone sans médias | Build réussi avec les trois dossiers de médias locaux temporairement retirés ; préchargeur, calendrier et logos de secours vérifiés dans le navigateur |
| État du dépôt | Branche locale préparée depuis le projet ; les 58 médias locaux sont ignorés. Le dépôt GitHub public existant contient encore l'ancienne version jusqu'à l'intégration de cette mise à jour. |

Ces contrôles montrent que le projet compile et s'affiche localement. Ils ne valident pas les droits de publication, la capacité sous charge ni l'exactitude de chaque course.

## Modifications déjà apportées

- Retrait des scripts de calcul, exports de résultats inutilisés, fichiers média dupliqués ou non référencés et composants morts.
- Suppression de l'injection inutilisée de `GEMINI_API_KEY` dans la configuration Vite et de l'import map externe inutilisée.
- Remplacement des polices `Formula1-*` par Oxanium, fournie avec sa licence OFL.
- Correction de la navigation de retour depuis l'analyse d'une course et du défilement lors de l'ouverture d'une course.
- Distinction visible entre classements statiques 2025/2026 et données de séances OpenF1 ; retrait de la sélection 2024 là où aucun classement 2024 n'est fourni.
- Suppression des calendriers de secours figés ; un circuit inconnu n'affiche plus les statistiques ou le tracé d'un autre circuit.
- Exclusion des deux séances d'avril 2026 annulées, qui figuraient encore dans la réponse OpenF1. La course de Bahreïn en Malaisie, confirmée par la FIA, reste affichée.
- Correction de la sélection des portraits : le numéro de voiture ne sert plus à choisir l'image d'un pilote d'une autre saison.
- Ajout d'un README propre au projet, d'un inventaire des médias et d'un workflow CI qui vérifie l'installation, TypeScript, le build et les dépendances de production.

## Points bloquants avant mise en ligne du site

### 1. Droits des médias

Les 24 portraits locaux, 10 logos d'écuries et 24 tracés SVG encore utilisés n'ont pas de provenance ni de droit de redistribution documentés. Git les exclut du dépôt, mais ils restent présents pour la démonstration locale. Les images chargées depuis `media.formula1.com` doivent aussi être examinées avant de déployer le site. La licence MIT du code ne couvre pas ces contenus. Voir [THIRD_PARTY_ASSETS.md](THIRD_PARTY_ASSETS.md). Les [règles publiques de Formula 1](https://www.formula1.com/en/information/guidelines.4EOKE9RRqevL4niTK9kWyt) encadrent notamment les polices et les images.

Le dépôt GitHub public contenait déjà des médias dans des commits antérieurs. Les supprimer du dernier commit ne les retire pas de l'historique accessible ; une éventuelle purge de cet historique demanderait une opération distincte et coordonnée avec les contributeurs.

Un `npm run build` lancé **dans ce dossier local** copie aussi les médias présents dans `public/images/` vers `dist/`, même s'ils sont ignorés par Git. Utilisez un clone propre sans ces médias pour préparer une distribution publique tant que leurs droits ne sont pas confirmés.

**Action :** obtenir des autorisations vérifiables et ajouter les attributions requises, ou remplacer ces médias par des créations et ressources à licence compatible avant de les inclure dans une distribution ou de déployer un site qui les affiche.

### 2. Accès OpenF1 en production

Le navigateur interroge directement OpenF1. Le cache et la file de requêtes sont propres à chaque onglet : ils ne limitent pas le trafic total de plusieurs visiteurs. Une analyse charge de nombreux endpoints et peut subir des réponses `429`, une latence importante ou des données partielles. La [documentation OpenF1](https://openf1.org/docs/) distingue l'accès historique public et les données en direct qui demandent un abonnement.

**Action :** mettre en place un service serveur avec cache partagé, limitation globale, surveillance des erreurs et une stratégie de reprise pour les réponses `429`. Ajouter l'authentification côté serveur si le direct est souhaité. Ne jamais exposer un jeton dans le bundle Vite.

### 3. Fraîcheur et validation des données

Les classements de championnat 2025 et 2026 sont des instantanés dans `services/season2025Data.ts` et `services/season2026Data.ts`. Ils peuvent devenir périmés. La reconstruction des positions et tours dépend des données horodatées de l'API ; aucune suite automatisée ne compare encore les résultats obtenus à des séances de référence.

**Action :** soit automatiser la mise à jour des classements, soit dater et contrôler les instantanés. Ajouter des tests de référence pour au moins une course complète, une course avec abandon, un sprint et un week-end sans résultats complets.

## Vérifications de mise en ligne restantes

1. Intégrer cette mise à jour dans le [dépôt public existant](https://github.com/hatim3310/f1-velocity-analytics) après revue et vérifier le workflow CI sur chaque PR.
2. Tester le build déployé sur son vrai domaine en HTTPS, sur mobile et avec connexion lente ; confirmer les accès réseau à OpenF1 et aux médias.
3. Documenter le fournisseur d'hébergement, sa politique de cache et de journalisation, les alertes en cas d'échec de l'API et le chemin de retour arrière.
4. Réaliser une revue d'accessibilité sur les graphiques et tableaux avec clavier et lecteur d'écran.

**Décision recommandée :** publier le code source sans les médias locaux si souhaité, mais garder l'application en démonstration locale pour l'instant. La mise en ligne publique du site pourra être réévaluée après résolution des points 1 à 3 ci-dessus.
