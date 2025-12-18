import { Driver, Race, Standing } from './types';
import { TEAM_LOGOS, CAR_IMAGES, DRIVER_HEADSHOTS } from './driverAssets';

export const TEAMS: Record<string, string> = {
  'Red Bull Racing': '#3671C6',
  'Mercedes': '#27F4D2',
  'Ferrari': '#E80020',
  'McLaren': '#FF8000',
  'Aston Martin': '#229971',
  'Alpine': '#0093CC',
  'Williams': '#64C4FF',
  'RB': '#6692FF',
  'Sauber': '#52E252',
  'Haas': '#B6BABD',
};

// Mapping assets from the new configuration file
export const TEAM_ASSETS: Record<string, { logo: string, car: string }> = {
  'Red Bull Racing': { logo: TEAM_LOGOS['Red Bull Racing'], car: CAR_IMAGES['Red Bull Racing'] },
  'Ferrari': { logo: TEAM_LOGOS['Ferrari'], car: CAR_IMAGES['Ferrari'] },
  'McLaren': { logo: TEAM_LOGOS['McLaren'], car: CAR_IMAGES['McLaren'] },
  'Mercedes': { logo: TEAM_LOGOS['Mercedes'], car: CAR_IMAGES['Mercedes'] },
  'Aston Martin': { logo: TEAM_LOGOS['Aston Martin'], car: CAR_IMAGES['Aston Martin'] },
  'RB': { logo: TEAM_LOGOS['RB'], car: CAR_IMAGES['RB'] },
  'Haas': { logo: TEAM_LOGOS['Haas'], car: CAR_IMAGES['Haas'] },
  'Williams': { logo: TEAM_LOGOS['Williams'], car: CAR_IMAGES['Williams'] },
  'Alpine': { logo: TEAM_LOGOS['Alpine'], car: CAR_IMAGES['Alpine'] },
  'Sauber': { logo: TEAM_LOGOS['Sauber'], car: CAR_IMAGES['Sauber'] }
};

// 2025 FINAL SEASON STANDINGS (REAL DATA)
export const DRIVER_DETAILS_MAP: Record<string, { points: number, podiums: number, image: string }> = {
  '4': { points: 394, podiums: 18, image: DRIVER_HEADSHOTS['4'] }, // Norris (CHAMPION)
  '1': { points: 389, podiums: 15, image: DRIVER_HEADSHOTS['1'] }, // Verstappen
  '81': { points: 381, podiums: 16, image: DRIVER_HEADSHOTS['81'] }, // Piastri
  '63': { points: 289, podiums: 9, image: DRIVER_HEADSHOTS['63'] }, // Russell
  '16': { points: 225, podiums: 7, image: DRIVER_HEADSHOTS['16'] }, // Leclerc
  '44': { points: 135, podiums: 0, image: DRIVER_HEADSHOTS['44'] }, // Hamilton
  '12': { points: 135, podiums: 3, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/K/KIMANT01_Kimi_Antonelli/kimant01.png.transform/2col/image.png' }, // Antonelli
  '23': { points: 70, podiums: 0, image: DRIVER_HEADSHOTS['23'] }, // Albon
  '55': { points: 54, podiums: 2, image: DRIVER_HEADSHOTS['55'] }, // Sainz
  '27': { points: 51, podiums: 1, image: DRIVER_HEADSHOTS['27'] }, // Hulkenberg
  '14': { points: 51, podiums: 0, image: DRIVER_HEADSHOTS['14'] }, // Alonso
  '6': { points: 50, podiums: 1, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png.transform/2col/image.png' }, // Hadjar
  '87': { points: 39, podiums: 0, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png.transform/2col/image.png' }, // Bearman
  '30': { points: 38, podiums: 0, image: DRIVER_HEADSHOTS['30'] }, // Lawson
  '31': { points: 34, podiums: 0, image: DRIVER_HEADSHOTS['31'] }, // Ocon
  '18': { points: 29, podiums: 0, image: DRIVER_HEADSHOTS['18'] }, // Stroll
  '22': { points: 21, podiums: 0, image: DRIVER_HEADSHOTS['22'] }, // Tsunoda
  '10': { points: 20, podiums: 0, image: DRIVER_HEADSHOTS['10'] }, // Gasly
  '5': { points: 19, podiums: 0, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabbor01.png.transform/2col/image.png' }, // Bortoleto
  '43': { points: 0, podiums: 0, image: DRIVER_HEADSHOTS['43'] }, // Colapinto
  '7': { points: 0, podiums: 0, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/J/JACDOO01_Jack_Doohan/jacdoo01.png.transform/2col/image.png' }, // Doohan
  // Legacy IDs just in case
  '11': { points: 0, podiums: 0, image: DRIVER_HEADSHOTS['11'] },
  '2': { points: 0, podiums: 0, image: DRIVER_HEADSHOTS['2'] },
  '20': { points: 0, podiums: 0, image: DRIVER_HEADSHOTS['20'] },
  '24': { points: 0, podiums: 0, image: DRIVER_HEADSHOTS['24'] },
  '3': { points: 0, podiums: 0, image: DRIVER_HEADSHOTS['3'] },
  '77': { points: 0, podiums: 0, image: DRIVER_HEADSHOTS['77'] },
};

export const DRIVERS: Driver[] = [];

export const RACES_2024: Race[] = [];

// Empty initial standings for 2025
export const DRIVER_STANDINGS: Standing[] = [];
export const CONSTRUCTOR_STANDINGS: Standing[] = [];
