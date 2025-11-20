# F1 Velocity Analytics


## Project Overview

F1 Velocity Analytics is a dynamic web application designed to provide in-depth analysis of Formula 1 race data. Built with React, TypeScript, and Tailwind CSS, this platform offers a sleek, responsive interface for F1 enthusiasts to explore driver performance, race strategies, and even gain AI-powered insights into Grand Prix events.

Leveraging the OpenF1 API for real-time data and integrated with the Gemini API for advanced analytics, the application visualizes lap-by-lap telemetry, position changes, and allows users to query an AI race engineer for strategic summaries and race outcome analysis.

## Features

*   **2024 F1 Driver Grid:** View the current season's driver lineup with custom headshots and team logos.
*   **Race Calendar & Analysis:** Explore past races, including detailed lap-by-lap data for positions and pace.
*   **Interactive Charts:** Visualize position changes and lap pace for all drivers during a race.
*   **AI Race Engineer (Powered by Gemini 2.5):** Ask intelligent questions about race strategy, tyre degradation, overtake analysis, and more, receiving detailed insights.
*   **Responsive Design:** Optimized for seamless viewing and interaction across various devices (mobile, tablet, desktop).
*   **Customizable Assets:** Easily update driver headshots and team logos with local images.

## Technologies Used

*   **Frontend:** React (with Vite for fast development), TypeScript
*   **Styling:** Tailwind CSS
*   **Data API:** OpenF1 API
*   **AI Integration:** Gemini API
*   **Charting:** Custom React components built with charting libraries (e.g., Recharts, Chart.js - *actual library depends on implementation, update if known*)
*   **Build Tool:** Vite

## Setup and Installation

To get this project up and running on your local machine, follow these steps:

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn (npm is used in these instructions)

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/f1-velocity-analytics.git
    cd f1-velocity-analytics
    ```
    *(Replace `https://github.com/your-username/f1-velocity-analytics.git` with your actual repository URL)*

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the project root and add your Gemini API key:
    ```
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```
    *(Obtain your API key from [Google AI Studio](https://aistudio.google.com/))*

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    The application will typically open in your browser at `http://localhost:5173` (or another port if 5173 is in use).

## Usage Guide

### Navigating the App

*   **Dashboard:** The main landing page provides an overview of the F1 season.
*   **Drivers View:** Browse detailed profiles of all 2024 F1 drivers.
*   **Race Analysis:** Select a completed race from the calendar to dive into its analytics.

### Race Analysis Features

Within the "Race Analysis" page, you can switch between tabs:
*   **Positions:** View a chart showing driver position changes throughout the race.
*   **Pace:** Analyze lap times and compare driver pace.
*   **AI Strategy:** Engage with the Gemini-powered AI Race Engineer. Type your questions or select from suggested queries to get insights into race strategy, tyre management, and more.

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
