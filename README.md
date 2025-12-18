# F1 Velocity Analytics

## Pour les Passionnés de Formule 1

Vous êtes fan de F1 et vous voulez plonger dans les données de la saison ? F1 Velocity Analytics est l'application web ultime pour analyser en profondeur les courses de Formule 1. Que vous souhaitiez revivre les courses de 2024, analyser les stratégies des pilotes ou comprendre les performances lap par lap, cette plateforme est faite pour vous.

## Ce que vous pouvez faire

### 📊 Données de la Saison 2024 (Disponible)
Explorez toutes les courses de l'année dernière avec :
- **Analyses détaillées lap par lap** pour chaque Grand Prix
- **Évolution des positions** pendant toute la course
- **Comparaison des rythmes** entre pilotes
- **Ingénieur de course IA** (propulsé par Gemini 2.5) pour répondre à vos questions sur les stratégies, la dégradation des pneus, les dépassements et plus encore

### 🔴 Données Live (EN COURS DE DÉVELOPPEMENT)
Bientôt, vous pourrez suivre les courses en temps réel pendant qu'elles se déroulent ! Cette fonctionnalité est actuellement en développement et vous permettra de :
- Suivre les positions en direct
- Analyser les stratégies pendant la course
- Recevoir des insights IA en temps réel

Construite avec React, TypeScript et Tailwind CSS, l'application utilise l'API OpenF1 pour les données en temps réel et l'API Gemini pour des analyses avancées.

## Fonctionnalités Détaillées

*   **Grille de pilotes F1 2024 :** Consultez tous les pilotes de la saison avec leurs photos et logos d'équipe personnalisés
*   **Calendrier et analyses de courses :** Explorez les courses passées de 2024 avec données détaillées lap par lap pour les positions et le rythme
*   **Graphiques interactifs :** Visualisez les changements de position et le rythme de tous les pilotes pendant une course
*   **Ingénieur de course IA (Gemini 2.5) :** Posez des questions intelligentes sur la stratégie de course, la dégradation des pneus, les analyses de dépassement et bien plus encore
*   **Design responsive :** Interface optimisée pour tous les appareils (mobile, tablette, desktop)
*   **Assets personnalisables :** Mettez à jour facilement les photos des pilotes et logos d'équipe

## Technologies Utilisées

*   **Frontend :** React (avec Vite pour un développement rapide), TypeScript
*   **Styling :** Tailwind CSS
*   **API de données :** OpenF1 API (données historiques 2024 + live en développement)
*   **Intégration IA :** Gemini API
*   **Graphiques :** Composants React personnalisés avec bibliothèques de graphiques
*   **Build Tool :** Vite

## Installation

Pour lancer le projet sur votre machine locale :

### Prérequis

*   Node.js (version LTS recommandée)
*   npm ou Yarn

### Étapes d'installation

1.  **Cloner le repository :**
    ```bash
    git clone https://github.com/your-username/f1-velocity-analytics.git
    cd f1-velocity-analytics
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```

3.  **Variables d'environnement :**
    Créez un fichier `.env.local` à la racine du projet et ajoutez votre clé API Gemini :
    ```
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```
    *(Obtenez votre clé API sur [Google AI Studio](https://aistudio.google.com/))*

4.  **Lancer le serveur de développement :**
    ```bash
    npm run dev
    ```
    L'application s'ouvrira dans votre navigateur à `http://localhost:5173`

## Guide d'Utilisation

### Navigation dans l'Application

*   **Dashboard :** Page d'accueil avec un aperçu de la saison F1
*   **Vue Pilotes :** Parcourez les profils détaillés de tous les pilotes F1 2024
*   **Analyse de Course :** Sélectionnez une course terminée dans le calendrier pour plonger dans ses analyses

### Fonctionnalités d'Analyse de Course

Dans la page "Analyse de Course", vous pouvez naviguer entre les onglets :
*   **Positions :** Graphique montrant l'évolution des positions des pilotes tout au long de la course
*   **Pace :** Analysez les temps au tour et comparez le rythme des pilotes
*   **Stratégie IA :** Interagissez avec l'ingénieur de course IA propulsé par Gemini. Posez vos questions ou sélectionnez parmi les suggestions pour obtenir des insights sur la stratégie de course, la gestion des pneus et plus encore

## Gestion des Assets

L'application permet une personnalisation facile des photos de pilotes et logos d'équipe avec des fichiers locaux.

### Photos de Pilotes

1.  **Placer les images :** Mettez vos fichiers images (`.png`, `.jpg`, `.webp`) dans le répertoire `public/images/drivers/`
2.  **Convention de nommage :** Consultez le fichier `DRIVERS_2024.md` à la racine du projet pour les noms de fichiers attendus
    *(Exemple : `public/images/drivers/verstappen.png` pour Max Verstappen)*

### Logos d'Équipe

1.  **Placer les images :** Mettez vos logos d'équipe dans le répertoire `public/images/teams/`
2.  **Convention de nommage :** L'application attend des noms de fichiers basés sur le nom complet de l'équipe, en minuscules avec tirets (ex: `red-bull-racing.png` pour Red Bull Racing)

## Contribution

Les contributions sont les bienvenues ! Si vous souhaitez améliorer ce projet :
1.  Forkez le repository
2.  Créez une nouvelle branche pour votre fonctionnalité ou correction
3.  Committez vos changements avec des messages conventionnels
4.  Poussez votre branche et ouvrez une pull request

## Licence

Ce projet est open-source et disponible sous la [MIT License](LICENSE).
