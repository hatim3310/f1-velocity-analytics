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

## Asset Management

The application allows for easy customization of driver headshots and team logos using local image files.

### Driver Headshots

1.  **Place images:** Put your driver image files (ee.g., `.png`, `.jpg`, `.webp`) into the `public/images/drivers/` directory.
2.  **Naming Convention:** Refer to the `DRIVERS_2024.md` file in the project root for the expected filenames for each driver.
    *(Example: `public/images/drivers/verstappen.png` for Max Verstappen)*

### Team Logos

1.  **Place images:** Put your team logo files (ee.g., `.png`, `.jpg`, `.webp`) into the `public/images/teams/` directory.
2.  **Naming Convention:** The application expects filenames based on the team's full name, converted to lowercase with hyphens (e.g., `red-bull-racing.png` for Red Bull Racing). For the exact list of expected names, you can inspect the `TEAM_LOGOS` object in `driverAssets.ts`.

## Contributing

We welcome contributions! If you'd like to improve this project, please follow these steps:
1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Commit your changes following conventional commit messages.
4.  Push your branch and open a pull request.

## License

This project is open-source and available under the [MIT License](LICENSE).
*(Create a `LICENSE` file in your project root with the full MIT License text)*
