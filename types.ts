export interface Driver {
  id: string;
  code: string;
  name: string;
  team: string;
  color: string;
  headshot?: string;
  // New visual assets
  teamLogo?: string;
  carImage?: string;
  countryCode?: string;
  // Stats
  points?: number;
  podiums?: number;
  worldChampionships?: number;
}

export interface Race {
  id: string;
  name: string;
  date: string;
  circuit: string;
  laps: number;
  winnerId: string;
  image: string;
  status?: 'COMPLETED' | 'UPCOMING' | 'LIVE';
}

export interface LapData {
  lap: number;
  driverId: string;
  position: number;
  time: number; // in seconds
  tyre: 'S' | 'M' | 'H' | 'I' | 'W';
}

export interface RaceAnalysisData {
  race: Race;
  drivers: Driver[];
  history: LapData[];
}

export enum AnalysisTab {
  POSITIONS = 'POSITIONS',
  PACE = 'PACE',
  AI_INSIGHTS = 'AI_INSIGHTS'
}

export type ViewState = 'DASHBOARD' | 'RACES' | 'DRIVERS' | 'TEAMS';

export interface Standing {
  position: number;
  entity: string; // Driver name or Team name
  points: number;
  diff?: number;
  teamColor?: string;
  driverId?: string;
}