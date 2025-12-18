// ==========================================
// FICHIER DE CONFIGURATION DES ASSETS (IMAGES)
// ==========================================
// C'est ici que tu peux modifier les chemins des images.
// Tu peux utiliser des URLs (https://...) ou des chemins locaux (si tu configures un dossier public).

export const TEAM_LOGOS: Record<string, string> = {
  'Red Bull Racing': 'https://media.formula1.com/content/dam/fom-website/teams/2024/red-bull-racing-logo.png',
  'Ferrari': 'https://media.formula1.com/content/dam/fom-website/teams/2024/ferrari-logo.png',
  'McLaren': 'https://media.formula1.com/content/dam/fom-website/teams/2024/mclaren-logo.png',
  'Mercedes': 'https://media.formula1.com/content/dam/fom-website/teams/2024/mercedes-logo.png',
  'Aston Martin': 'https://media.formula1.com/content/dam/fom-website/teams/2024/aston-martin-logo.png',
  'Alpine': 'https://media.formula1.com/content/dam/fom-website/teams/2024/alpine-logo.png',
  'Williams': 'https://media.formula1.com/content/dam/fom-website/teams/2024/williams-logo.png',
  'RB': 'https://media.formula1.com/content/dam/fom-website/teams/2024/rb-logo.png',
  'Sauber': 'https://media.formula1.com/content/dam/fom-website/teams/2024/kick-sauber-logo.png',
  'Haas': 'https://media.formula1.com/content/dam/fom-website/teams/2024/haas-f1-team-logo.png',
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

// Map des drivers par Numéro de course (Raw Original Assets for Max Quality)
export const DRIVER_HEADSHOTS: Record<string, string> = {
  // Red Bull
  '1': 'https://media.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png',
  '11': 'https://media.formula1.com/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png',

  // Mercedes
  '63': 'https://media.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png',
  '12': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/K/KIMANT01_Kimi_Antonelli/kimant01.png', // Antonelli (Fallback until 2025 official photo live) 
  // Note: Kimi Antonelli's official 2025 portrait might not be fully indexed yet. 
  // Checking secondary source or keeping this if it starts working, otherwise fallback in UI handles it.
  // Let's try the F2 style path or just ensure the ID is correct. 
  // Actually, for now, let's use a placeholder that definitely works if the main one fails, 
  // but since we can't 'check' live, let's leave the standard path structure which is most likely to go live soon.
  // User says it's missing. Let's start with a generic driver outline if specific one 404s? 
  // Better: Use a specific known image for him if available, ottherwise the standard fallback.
  // Re-confirming the path structure.
  // Update: 'KIMANT01' is the likely code.
  // If it's not loading, let's try a different known asset or rely on the UI fallback.
  // Actually, I will point it to the generic fallback for now to avoid a broken image icon.
  // '12': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/K/KIMANT01_Kimi_Antonelli/kimant01.png',

  // Ferrari
  '16': 'https://media.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png',
  '44': 'https://media.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png', // Hamilton

  // McLaren
  '4': 'https://media.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png',
  '81': 'https://media.formula1.com/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png',

  // Aston Martin
  '14': 'https://media.formula1.com/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png',
  '18': 'https://media.formula1.com/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png',

  // Alpine
  '10': 'https://media.formula1.com/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png',
  '7': 'https://media.formula1.com/content/dam/fom-website/drivers/J/JACDOO01_Jack_Doohan/jacdoo01.png', // Doohan
  '43': 'https://media.formula1.com/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png', // Colapinto

  // Williams
  '23': 'https://media.formula1.com/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png',
  '55': 'https://media.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png', // Sainz

  // RB
  '22': 'https://media.formula1.com/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png',
  '30': 'https://media.formula1.com/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png', // Lawson
  '6': 'https://media.formula1.com/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png', // Hadjar

  // Sauber
  '27': 'https://media.formula1.com/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png',
  '5': 'https://media.formula1.com/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabbor01.png', // Bortoleto

  // Haas
  '31': 'https://media.formula1.com/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png',
  '87': 'https://media.formula1.com/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png', // Bearman
};
