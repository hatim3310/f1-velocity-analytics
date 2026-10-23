export interface Driver {
  id: string;
  code: string;
  name: string;
  team: string;
  color: string;
  headshot?: string;
  teamLogo?: string;
  carImage?: string;
  countryCode?: string;
  points?: number;
  podiums?: number;
  wins?: number;
  fastestLaps?: number;
  worldChampionships?: number;
}

export interface Race {
  id: string;
  round?: number;
  name: string;
  date: string;
  circuit: string;
  country?: string;
  countryCode?: string;
  laps: number;
  winnerId: string;
  winnerName?: string;
  winnerImage?: string;
  winnerTeam?: string;
  winnerTeamColor?: string;
  image: string;
  status?: 'COMPLETED' | 'UPCOMING' | 'LIVE';
  sessionKey?: number;
  meetingKey?: number;
}

export interface LapData {
  lap: number;
  driverId: string;
  position: number;
  time: number; // in seconds
  tyre: 'S' | 'M' | 'H' | 'I' | 'W' | null;
  sectors?: [number | null, number | null, number | null];
  pitOut?: boolean;
  dateStart?: string;
}

export interface RaceAnalysisData {
  race: Race;
  drivers: Driver[];
  history: LapData[];
  pits?: OpenF1Pit[];
  stints?: OpenF1Stint[];
  weather?: OpenF1Weather[];
  raceControl?: OpenF1RaceControl[];
  intervals?: OpenF1Interval[];
  results?: RaceResultEntry[];
  sessions?: SessionClassification[];
  totalLaps?: number;
  sourceError?: string;
}

export enum AnalysisTab {
  RESULTS = 'RESULTS',
  POSITIONS = 'POSITIONS',
  PACE = 'PACE',
  WEATHER = 'WEATHER',
}

export interface SessionClassification {
  key: number;
  name: string;
  date: string;
  results: RaceResultEntry[];
}

export type ViewState = 'DASHBOARD' | 'RACES' | 'STANDINGS' | 'DRIVERS' | 'TEAMS';

export interface Standing {
  position: number;
  entity: string; // Driver name or Team name
  points: number;
  diff?: number;
  teamColor?: string;
  driverId?: string;
}

export interface DriverStanding {
  position: number;
  driverNumber: string;
  driverName: string;
  code: string;
  team: string;
  teamColor: string;
  points: number;
  wins: number;
  podiums: number;
  fastestLaps: number;
  headshot?: string;
  teamLogo?: string;
  countryCode?: string;
  diff: number;
}

export interface ConstructorStanding {
  position: number;
  team: string;
  points: number;
  wins: number;
  podiums: number;
  color: string;
  logo?: string;
  car?: string;
  drivers: string[];
  diff: number;
}

export interface RaceResultEntry {
  track: string;
  position: number;
  positionText: string;
  driverNumber: string;
  driverName: string;
  team: string;
  grid: number | null;
  laps: number;
  timeRetired: string;
  points: number;
  fastestLap: boolean;
  fastestLapTime: string;
  qualifyingTimes?: [number | null, number | null, number | null];
}

// OpenF1 API Response Interfaces
export interface OpenF1Session {
  session_key: number;
  meeting_key: number;
  meeting_name: string;
  location: string;
  country_name?: string;
  date_start: string;
  date_end?: string;
  circuit_short_name: string;
  circuit_key?: number;
  session_name?: string;
  session_type: string;
  year: number;
}

export interface OpenF1Meeting {
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  location: string;
  country_key: number;
  country_code: string;
  country_name: string;
  circuit_key: number;
  circuit_short_name: string;
  date_start: string;
  gmt_offset: string;
  year: number;
}

export interface OpenF1Driver {
  driver_number: number;
  session_key: number;
  meeting_key?: number;
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
  date_start?: string;
  is_pit_out_lap: boolean;
  duration_sector_1?: number | null;
  duration_sector_2?: number | null;
  duration_sector_3?: number | null;
  segments_sector_1: number[];
  segments_sector_2: number[];
  segments_sector_3: number[];
}

export interface OpenF1Interval {
  session_key: number;
  meeting_key?: number;
  date: string;
  driver_number: number;
  gap_to_leader: number | null;
  interval: number | null;
}

export interface OpenF1Pit {
  session_key: number;
  meeting_key?: number;
  date: string;
  driver_number: number;
  lap_number: number;
  pit_duration: number | null;
  lane_duration?: number | null;
  stop_duration?: number | null;
}

export interface OpenF1Stint {
  session_key: number;
  meeting_key?: number;
  driver_number: number;
  stint_number: number;
  lap_start: number;
  lap_end: number;
  compound: 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET' | string;
  tyre_age_at_start: number;
}

export interface OpenF1Weather {
  session_key: number;
  meeting_key?: number;
  date: string;
  air_temperature: number;
  track_temperature: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_direction: number;
  rainfall: number;
}

export interface OpenF1RaceControl {
  session_key: number;
  meeting_key?: number;
  date: string;
  category: string;
  flag?: 'GREEN' | 'YELLOW' | 'DOUBLE YELLOW' | 'RED' | 'CHEQUERED' | 'CLEAR' | string;
  message: string;
  scope?: string;
  sector?: number;
}

export interface OpenF1Position {
  session_key: number;
  meeting_key?: number;
  date: string;
  driver_number: number;
  position: number;
}

export interface OpenF1CarData {
  session_key: number;
  meeting_key?: number;
  driver_number: number;
  date: string;
  speed: number;
  rpm: number;
  n_gear: number;
  throttle: number;
  brake: number;
  drs: number;
}

export interface OpenF1SessionResult {
  session_key: number;
  driver_number: number;
  position: number | null;
  number_of_laps?: number | null;
  duration?: number | (number | null)[] | null;
  gap_to_leader?: number | string | (number | string | null)[] | null;
  points?: number | null;
  dnf?: boolean;
  dns?: boolean;
  dsq?: boolean;
}

export interface OpenF1StartingGrid {
  driver_number: number;
  position: number;
}
