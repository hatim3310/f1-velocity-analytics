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

export type ViewState = 'DASHBOARD' | 'RACES' | 'DRIVERS' | 'TEAMS' | 'SETTINGS';

export interface Standing {
  position: number;
  entity: string; // Driver name or Team name
  points: number;
  diff?: number;
  teamColor?: string;
  driverId?: string;
}

// OpenF1 API Response Interfaces
export interface OpenF1Session {
  session_key: number;
  meeting_name: string;
  location: string;
  date_start: string;
  circuit_short_name: string;
  session_type: string;
  year: number;
}

export interface OpenF1Driver {
  driver_number: number;
  session_key: number;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour?: string;
  headshot_url?: string;
  country_code?: string;
}

export interface OpenF1Lap {
  meeting_key: number;
  session_key: number;
  driver_number: number;
  lap_number: number;
  lap_duration: number | null;
  is_pit_out_lap: boolean;
  segments_sector_1: number[];
  segments_sector_2: number[];
  segments_sector_3: number[];
}