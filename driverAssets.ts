// ==========================================
// FICHIER DE CONFIGURATION DES ASSETS (IMAGES)
// ==========================================
// C'est ici que tu peux modifier les chemins des images.
// Tu peux utiliser des URLs (https://...) ou des chemins locaux (si tu configures un dossier public).

export const TEAM_LOGOS: Record<string, string> = {
  'Red Bull Racing': '/images/teams/2025redbullracinglogowhite.webp',
  'Ferrari': '/images/teams/2025ferrarilogowhite.webp',
  'McLaren': '/images/teams/2025mclarenlogowhite.webp',
  'Mercedes': '/images/teams/2025mercedeslogowhite.webp',
  'Aston Martin': '/images/teams/2025astonmartinlogowhite.webp',
  'Alpine': '/images/teams/ALPINE.webp',
  'Williams': '/images/teams/2025williamslogowhite.webp',
  'RB': '/images/teams/2025racingbullslogowhite.webp',
  'Sauber': '/images/teams/2025kicksauberlogowhite.webp', // Kept original path as no new logo was found
  'Haas': '/images/teams/2025haasf1teamlogowhite.webp',
};

export const CAR_IMAGES: Record<string, string> = {
  'Red Bull Racing': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/red-bull-racing.png.transform/4col/image.png',
  'Ferrari': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/ferrari.png.transform/4col/image.png',
  'McLaren': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/mclaren.png.transform/4col/image.png',
  'Mercedes': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/mercedes.png.transform/4col/image.png',
  'Aston Martin': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/aston-martin.png.transform/4col/image.png',
  'Alpine': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/alpine.png.transform/4col/image.png',
  'Williams': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/williams.png.transform/4col/image.png',
  'RB': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/rb.png.transform/4col/image.png',
  'Sauber': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/kick-sauber.png.transform/4col/image.png',
  'Haas': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/haas-f1-team.png.transform/4col/image.png',
};

// Map des drivers par Numéro de course
export const DRIVER_HEADSHOTS: Record<string, string> = {
  '1': '/images/drivers/verstappen.png',
  '11': '/images/drivers/perez.png',
  '16': '/images/drivers/leclerc.png',
  '55': '/images/drivers/sainz.png',
  '4': '/images/drivers/norris.png',
  '81': '/images/drivers/piastri.png',
  '63': '/images/drivers/russell.png',
  '44': '/images/drivers/hamilton.png',
  '14': '/images/drivers/alonso.png',
  '18': '/images/drivers/stroll.png',
  '22': '/images/drivers/yuktsu01.png',
  '3': '/images/drivers/ricciardo.png',
  '27': '/images/drivers/nichul01.png',
  '20': '/images/drivers/magnussen.png',
  '23': '/images/drivers/alealb01.png',
  '31': '/images/drivers/estoco01.png',
  '10': '/images/drivers/piegas01.png',
  '24': '/images/drivers/ZAHOU.PNG',
  '77': '/images/drivers/BOTTAS.PNG',
  '2': '/images/drivers/sargeant.png',
  '61': '/images/drivers/jacdoo01.png', // Jack Doohan
  '43': '/images/drivers/colapinto.png', // Franco Colapinto
  '30': '/images/drivers/lialaw01.png', // Liam Lawson
};
