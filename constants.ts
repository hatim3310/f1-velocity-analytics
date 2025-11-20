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

// Enhanced Driver Stats Mapping with Points and Headshots
export const DRIVER_DETAILS_MAP: Record<string, { points: number, podiums: number, image: string }> = {
  '1': { points: 194, podiums: 7, image: DRIVER_HEADSHOTS['1'] },
  '11': { points: 107, podiums: 4, image: DRIVER_HEADSHOTS['11'] },
  '16': { points: 138, podiums: 5, image: DRIVER_HEADSHOTS['16'] },
  '55': { points: 108, podiums: 3, image: DRIVER_HEADSHOTS['55'] },
  '4': { points: 131, podiums: 5, image: DRIVER_HEADSHOTS['4'] },
  '81': { points: 71, podiums: 1, image: DRIVER_HEADSHOTS['81'] },
  '63': { points: 69, podiums: 0, image: DRIVER_HEADSHOTS['63'] },
  '44': { points: 55, podiums: 0, image: DRIVER_HEADSHOTS['44'] },
  '14': { points: 41, podiums: 0, image: DRIVER_HEADSHOTS['14'] },
  '18': { points: 17, podiums: 0, image: DRIVER_HEADSHOTS['18'] },
  '22': { points: 20, podiums: 0, image: DRIVER_HEADSHOTS['22'] },
  '3': { points: 9, podiums: 0, image: DRIVER_HEADSHOTS['3'] },
  '27': { points: 5, podiums: 0, image: DRIVER_HEADSHOTS['27'] },
  '20': { points: 0, podiums: 0, image: DRIVER_HEADSHOTS['20'] },
  '23': { points: 2, podiums: 0, image: DRIVER_HEADSHOTS['23'] },
  '31': { points: 2, podiums: 0, image: DRIVER_HEADSHOTS['31'] },
  '10': { points: 1, podiums: 0, image: DRIVER_HEADSHOTS['10'] },
  '24': { points: 0, podiums: 0, image: DRIVER_HEADSHOTS['24'] },
  '77': { points: 0, podiums: 0, image: DRIVER_HEADSHOTS['77'] },
  '2': { points: 0, podiums: 0, image: DRIVER_HEADSHOTS['2'] },
  '61': { points: 0, podiums: 0, image: DRIVER_HEADSHOTS['61'] }, // Jack Doohan
  '43': { points: 0, podiums: 0, image: DRIVER_HEADSHOTS['43'] }, // Franco Colapinto
  '30': { points: 0, podiums: 0, image: DRIVER_HEADSHOTS['30'] }, // Liam Lawson
};

export const DRIVERS: Driver[] = [
  { id: 'ver', code: 'VER', name: 'Max Verstappen', team: 'Red Bull Racing', color: TEAMS['Red Bull Racing'] },
];

export const RACES_2024: Race[] = [
  { id: 'r1', name: 'Bahrain Grand Prix', date: '2024-03-02', circuit: 'Bahrain International Circuit', laps: 57, winnerId: 'ver', image: 'https://picsum.photos/id/137/800/400' },
];

export const DRIVER_STANDINGS: Standing[] = [
  { position: 1, entity: 'Max Verstappen', points: 194, teamColor: TEAMS['Red Bull Racing'] },
  { position: 2, entity: 'Charles Leclerc', points: 138, diff: 56, teamColor: TEAMS['Ferrari'] },
  { position: 3, entity: 'Lando Norris', points: 131, diff: 63, teamColor: TEAMS['McLaren'] },
  { position: 4, entity: 'Carlos Sainz', points: 108, diff: 86, teamColor: TEAMS['Ferrari'] },
  { position: 5, entity: 'Sergio Perez', points: 107, diff: 87, teamColor: TEAMS['Red Bull Racing'] },
];

export const CONSTRUCTOR_STANDINGS: Standing[] = [
  { position: 1, entity: 'Red Bull Racing', points: 301, teamColor: TEAMS['Red Bull Racing'] },
  { position: 2, entity: 'Ferrari', points: 252, diff: 49, teamColor: TEAMS['Ferrari'] },
  { position: 3, entity: 'McLaren', points: 212, diff: 89, teamColor: TEAMS['McLaren'] },
  { position: 4, entity: 'Mercedes', points: 124, diff: 177, teamColor: TEAMS['Mercedes'] },
  { position: 5, entity: 'Aston Martin', points: 58, diff: 243, teamColor: TEAMS['Aston Martin'] },
];
