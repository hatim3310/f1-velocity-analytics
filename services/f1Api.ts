import {
  Race,
  Driver,
  LapData,
  OpenF1Session,
  OpenF1Driver,
  OpenF1Lap,
  OpenF1Interval,
  OpenF1Pit,
  OpenF1Stint,
  OpenF1Weather,
  OpenF1RaceControl,
  OpenF1Position,
  OpenF1Meeting,
  OpenF1CarData,
  DriverStanding,
  ConstructorStanding,
  RaceResultEntry,
  RaceAnalysisData,
  OpenF1SessionResult,
  OpenF1StartingGrid,
  SessionClassification
} from '../types';
import { TEAMS, TEAM_ASSETS } from '../constants';
import { getDriverPortrait } from './imageUtils';
import {
  SEASON_2026_DRIVER_STANDINGS,
  SEASON_2026_CONSTRUCTOR_STANDINGS
} from './season2026Data';
import {
  SEASON_2025_DRIVER_STANDINGS,
  SEASON_2025_CONSTRUCTOR_STANDINGS
} from './season2025Data';

const BASE_URL = 'https://api.openf1.org/v1';

// Formula 1 confirmed these April 2026 races would not take place. OpenF1
// still lists their planned sessions, so they must not become completed rounds.
// https://www.formula1.com/en/latest/article/bahrain-and-saudi-arabian-grands-prix-will-not-take-place-in-april.1hnqllVG85RSt8pbFc5Ivx.1hnqllVG85RSt8pbFc5Ivx
const CANCELLED_2026_RACE_DATES = new Set(['2026-04-12', '2026-04-19']);

// Cache with TTL (Time To Live) support for live data freshness
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const pending = new Map<string, Promise<unknown>>();
let requestQueue: Promise<void> = Promise.resolve();
let lastRequestAt = 0;
const requestTimes: number[] = [];

const reserveRequest = (): Promise<void> => {
  const turn = requestQueue.then(async () => {
    const now = Date.now();
    while (requestTimes.length && requestTimes[0] <= now - 60000) requestTimes.shift();
    const perSecond = Math.max(0, lastRequestAt + 400 - now);
    const perMinute = requestTimes.length >= 28 ? Math.max(0, requestTimes[0] + 60000 - now) : 0;
    const delay = Math.max(perSecond, perMinute);
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    const started = Date.now();
    while (requestTimes.length && requestTimes[0] <= started - 60000) requestTimes.shift();
    lastRequestAt = started;
    requestTimes.push(started);
  });
  requestQueue = turn.catch(() => {});
  return turn;
};

export async function fetchWithCache<T>(url: string, ttlMs: number = 60000): Promise<T> {
  const now = Date.now();
  const cached = cache.get(url);

  if (cached && now - cached.timestamp < ttlMs) {
    return cached.data as T;
  }
  if (pending.has(url)) return pending.get(url) as Promise<T>;
  const request = (async () => {
    try {
      for (let attempt = 0; attempt < 3; attempt++) {
        await reserveRequest();
        const response = await fetch(url);
        if (response.status === 429 && attempt < 2) {
          const retryAfter = Number(response.headers.get('Retry-After'));
          await new Promise((resolve) => setTimeout(resolve,
            Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : (attempt + 1) * 2000));
          continue;
        }
        if (!response.ok) throw new Error(`OpenF1 API returned status ${response.status}`);
        const data = (await response.json()) as T;
        cache.set(url, { data, timestamp: Date.now() });
        return data;
      }
      throw new Error('OpenF1 rate limit exceeded');
    } catch (error) {
      if (cached) return cached.data as T;
      if (!(error instanceof Error && error.message.includes('status 404'))) {
        console.warn(`Fetch error for ${url}:`, error);
      }
      throw error;
    } finally {
      pending.delete(url);
    }
  })();
  pending.set(url, request);
  return request;
}

// Map Locations and Track Names to Official F1 Website Image Slugs
const CIRCUIT_SLUGS: Record<string, string> = {
  'Sakhir': 'Bahrain',
  'Bahrain': 'Bahrain',
  'Jeddah': 'Saudi_Arabia',
  'Saudi Arabia': 'Saudi_Arabia',
  'Melbourne': 'Australia',
  'Australia': 'Australia',
  'Suzuka': 'Japan',
  'Japan': 'Japan',
  'Shanghai': 'China',
  'China': 'China',
  'Miami': 'Miami',
  'Miami Gardens': 'Miami',
  'Imola': 'Emilia_Romagna',
  'Emilia-Romagna': 'Emilia_Romagna',
  'Monte Carlo': 'Monaco',
  'Monaco': 'Monaco',
  'Montréal': 'Canada',
  'Montreal': 'Canada',
  'Canada': 'Canada',
  'Barcelona': 'Spain',
  'Spain': 'Spain',
  'Madrid': 'Spain',
  'Spielberg': 'Austria',
  'Austria': 'Austria',
  'Silverstone': 'Great_Britain',
  'Great Britain': 'Great_Britain',
  'Budapest': 'Hungary',
  'Hungary': 'Hungary',
  'Spa-Francorchamps': 'Belgium',
  'Belgium': 'Belgium',
  'Zandvoort': 'Netherlands',
  'Netherlands': 'Netherlands',
  'Monza': 'Italy',
  'Italy': 'Italy',
  'Baku': 'Baku',
  'Azerbaijan': 'Baku',
  'Marina Bay': 'Singapore',
  'Singapore': 'Singapore',
  'Kuala Lumpur': 'Malaysia',
  'Malaysia': 'Malaysia',
  'Austin': 'USA',
  'United States': 'USA',
  'Mexico City': 'Mexico',
  'Mexico': 'Mexico',
  'São Paulo': 'Brazil',
  'Sao Paulo': 'Brazil',
  'Brazil': 'Brazil',
  'Interlagos': 'Brazil',
  'Las Vegas': 'Las_Vegas',
  'Lusail': 'Qatar',
  'Qatar': 'Qatar',
  'Yas Island': 'Abu_Dhabi',
  'Yas Marina': 'Abu_Dhabi',
  'Abu Dhabi': 'Abu_Dhabi'
};

export const getCircuitImage = (location: string, circuitShortName?: string): string => {
  const loc = location.trim();
  const short = circuitShortName?.trim() || '';
  const slug = CIRCUIT_SLUGS[loc] || CIRCUIT_SLUGS[short] || loc.replace(/\s+/g, '_');
  return `https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${slug}_Circuit.png.transform/8col/image.png`;
};

// 1. ENDPOINT: /sessions
export const getCalendar = async (year: number = 2026): Promise<Race[]> => {
  const url = `${BASE_URL}/sessions?year=${year}&session_type=Race`;

  try {
    const [sessions, meetings] = await Promise.all([
      fetchWithCache<OpenF1Session[]>(url, 300000),
      getMeetings(year)
    ]);
    const meetingMap = new Map(meetings.map((meeting) => [meeting.meeting_key, meeting]));
    if (!sessions.length) throw new Error(`No OpenF1 race sessions for ${year}`);

    return sessions
      .filter((s) => s.session_name === 'Race' &&
        !(year === 2026 && CANCELLED_2026_RACE_DATES.has(s.date_start.slice(0, 10))))
      .sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime())
      .map((session, idx) => {
        const meeting = meetingMap.get(session.meeting_key);
        const location = meeting?.location || session.location;
        const circuit = meeting?.circuit_short_name || session.circuit_short_name || location;
        const end = session.date_end ? Date.parse(session.date_end) : Date.parse(session.date_start) + 3 * 3600000;
        const start = Date.parse(session.date_start);
        return {
          id: session.session_key.toString(),
          round: idx + 1,
          name: meeting?.meeting_name || session.meeting_name || `${location} Grand Prix`,
          date: session.date_start.split('T')[0],
          circuit,
          country: meeting?.country_name || session.country_name || location,
          countryCode: meeting?.country_code,
          laps: 0,
          winnerId: 'TBD',
          image: getCircuitImage(location, circuit),
          status: Date.now() >= end ? 'COMPLETED' : Date.now() >= start ? 'LIVE' : 'UPCOMING',
          sessionKey: session.session_key,
          meetingKey: session.meeting_key
        } satisfies Race;
      });
  } catch (e) {
    console.warn(`Failed to fetch sessions for year ${year}`, e);
    return [];
  }
};

export const getRaceWinner = async (race: Race): Promise<Pick<Race, 'winnerId' | 'winnerName' | 'winnerImage' | 'winnerTeam' | 'winnerTeamColor'> | null> => {
  if (race.status !== 'COMPLETED' || !race.sessionKey) return null;
  const key = race.sessionKey;
  const results = await fetchWithCache<OpenF1SessionResult[]>(
    `${BASE_URL}/session_result?session_key=${key}&position=1`, 300000
  ).catch(() => []);
  const winner = results.find((entry) => entry.position === 1 && !entry.dsq);
  if (!winner) return null;
  const drivers = await fetchWithCache<OpenF1Driver[]>(
    `${BASE_URL}/drivers?session_key=${key}&driver_number=${winner.driver_number}`, 300000
  ).catch(() => []);
  const driver = drivers.find((entry) => entry.driver_number === winner.driver_number);
  return {
    winnerId: String(winner.driver_number),
    winnerName: driver?.full_name || `Driver #${winner.driver_number}`,
    winnerImage: getDriverPortrait(driver?.full_name, driver?.headshot_url, Number(race.date.slice(0, 4)), driver?.team_name),
    winnerTeam: driver?.team_name || undefined,
    winnerTeamColor: driver?.team_colour ? `#${driver.team_colour}` : undefined
  };
};

// 2. ENDPOINT: /drivers
export const getSeasonDrivers = async (year: number = 2026): Promise<Driver[]> => {
  if (year === 2026) {
    return SEASON_2026_DRIVER_STANDINGS.map((d) => ({
      id: d.driverNumber,
      code: d.code,
      name: d.driverName,
      team: d.team,
      color: d.teamColor,
      headshot: d.headshot,
      teamLogo: d.teamLogo || TEAM_ASSETS[d.team]?.logo,
      carImage: TEAM_ASSETS[d.team]?.car,
      countryCode: d.countryCode,
      points: d.points,
      podiums: d.podiums,
      wins: d.wins,
      fastestLaps: d.fastestLaps
    }));
  }

  if (year === 2025) {
    return SEASON_2025_DRIVER_STANDINGS.map((d) => ({
      id: d.driverNumber,
      code: d.code,
      name: d.driverName,
      team: d.team,
      color: d.teamColor,
      headshot: d.headshot,
      teamLogo: d.teamLogo,
      carImage: TEAM_ASSETS[d.team]?.car,
      countryCode: d.countryCode,
      points: d.points,
      podiums: d.podiums,
      wins: d.wins,
      fastestLaps: d.fastestLaps
    }));
  }

  throw new Error(`Driver standings unavailable for ${year}`);
};

// 3. ENDPOINT: /laps & detailed race reconstruction
const mapDriver = (d: OpenF1Driver): Driver => {
  const team = d.team_name || 'Unknown team';
  return {
    id: String(d.driver_number),
    code: d.name_acronym || String(d.driver_number),
    name: d.full_name || `Driver #${d.driver_number}`,
    team,
    color: d.team_colour ? `#${d.team_colour}` : TEAMS[team] || '#ffffff',
    headshot: d.headshot_url || undefined
  };
};

const tyreCode = (compound: string): LapData['tyre'] => ({
  SOFT: 'S', MEDIUM: 'M', HARD: 'H', INTERMEDIATE: 'I', WET: 'W'
} as Record<string, LapData['tyre']>)[compound?.toUpperCase()] || null;

export const buildLapHistory = (
  laps: OpenF1Lap[], positions: OpenF1Position[], stints: OpenF1Stint[]
): LapData[] => {
  const byDriver = new Map<number, OpenF1Position[]>();
  positions.filter((p) => p.position > 0 && Number.isFinite(Date.parse(p.date)))
    .forEach((p) => {
      const events = byDriver.get(p.driver_number) || [];
      events.push(p);
      byDriver.set(p.driver_number, events);
    });
  byDriver.forEach((events) => events.sort((a, b) => Date.parse(a.date) - Date.parse(b.date)));
  const stintsByDriver = new Map<number, OpenF1Stint[]>();
  stints.forEach((stint) => {
    const entries = stintsByDriver.get(stint.driver_number) || [];
    entries.push(stint);
    stintsByDriver.set(stint.driver_number, entries);
  });

  return laps.filter((lap) => lap.lap_number > 0 && typeof lap.lap_duration === 'number' && lap.lap_duration > 0).map((lap) => {
    const start = lap.date_start ? Date.parse(lap.date_start) : NaN;
    const finish = Number.isFinite(start) && typeof lap.lap_duration === 'number'
      ? start + lap.lap_duration * 1000 : NaN;
    const events = byDriver.get(lap.driver_number) || [];
    let left = 0;
    let right = events.length;
    while (left < right) {
      const middle = (left + right) >> 1;
      if (Date.parse(events[middle].date) <= finish) left = middle + 1;
      else right = middle;
    }
    const stint = stintsByDriver.get(lap.driver_number)?.find(
      (s) => s.lap_start <= lap.lap_number && s.lap_end >= lap.lap_number
    );
    return {
      lap: lap.lap_number,
      driverId: String(lap.driver_number),
      position: left ? events[left - 1].position : 0,
      time: typeof lap.lap_duration === 'number' && lap.lap_duration > 0 ? lap.lap_duration : 0,
      tyre: stint ? tyreCode(stint.compound) : null,
      sectors: [lap.duration_sector_1 ?? null, lap.duration_sector_2 ?? null, lap.duration_sector_3 ?? null] as LapData['sectors'],
      pitOut: lap.is_pit_out_lap,
      dateStart: lap.date_start
    };
  }).sort((a, b) => a.lap - b.lap || a.position - b.position);
};

export const getRaceDetails = async (sessionKey: string, stints: OpenF1Stint[] = []) => {
  const [driversData, lapsData, positionsData] = await Promise.all([
    fetchWithCache<OpenF1Driver[]>(`${BASE_URL}/drivers?session_key=${sessionKey}`, 300000).catch(() => []),
    fetchWithCache<OpenF1Lap[]>(`${BASE_URL}/laps?session_key=${sessionKey}`, 30000),
    getRacePositions(sessionKey)
  ]);
  return {
    drivers: driversData.map(mapDriver),
    history: buildLapHistory(lapsData, positionsData, stints),
    totalLaps: Math.max(0, ...lapsData.filter((lap) => typeof lap.lap_duration === 'number' && lap.lap_duration > 0)
      .map((lap) => lap.lap_number))
  };
};

// 4. ENDPOINT: /intervals
export const getRaceIntervals = async (sessionKey: string): Promise<OpenF1Interval[]> => {
  const url = `${BASE_URL}/intervals?session_key=${sessionKey}`;
  try {
    return await fetchWithCache<OpenF1Interval[]>(url, 10000);
  } catch (e) {
    console.warn(`Failed to fetch intervals for session ${sessionKey}`, e);
    return [];
  }
};

// 5. ENDPOINT: /pit
export const getRacePits = async (sessionKey: string): Promise<OpenF1Pit[]> => {
  const url = `${BASE_URL}/pit?session_key=${sessionKey}`;
  try {
    return await fetchWithCache<OpenF1Pit[]>(url, 15000);
  } catch (e) {
    console.warn(`Failed to fetch pit stops for session ${sessionKey}`, e);
    return [];
  }
};

// 6. ENDPOINT: /stints
export const getRaceStints = async (sessionKey: string): Promise<OpenF1Stint[]> => {
  const url = `${BASE_URL}/stints?session_key=${sessionKey}`;
  try {
    return await fetchWithCache<OpenF1Stint[]>(url, 15000);
  } catch (e) {
    console.warn(`Failed to fetch tyre stints for session ${sessionKey}`, e);
    return [];
  }
};

// 7. ENDPOINT: /weather
export const getRaceWeather = async (sessionKey: string): Promise<OpenF1Weather[]> => {
  const url = `${BASE_URL}/weather?session_key=${sessionKey}`;
  try {
    return await fetchWithCache<OpenF1Weather[]>(url, 15000);
  } catch (e) {
    console.warn(`Failed to fetch weather for session ${sessionKey}`, e);
    return [];
  }
};

// 8. ENDPOINT: /race_control
export const getRaceControlMessages = async (sessionKey: string): Promise<OpenF1RaceControl[]> => {
  const url = `${BASE_URL}/race_control?session_key=${sessionKey}`;
  try {
    return await fetchWithCache<OpenF1RaceControl[]>(url, 10000);
  } catch (e) {
    console.warn(`Failed to fetch race control messages for session ${sessionKey}`, e);
    return [];
  }
};

// 9. ENDPOINT: /position
export const getRacePositions = async (sessionKey: string): Promise<OpenF1Position[]> => {
  const url = `${BASE_URL}/position?session_key=${sessionKey}`;
  try {
    return await fetchWithCache<OpenF1Position[]>(url, 10000);
  } catch (e) {
    console.warn(`Failed to fetch positions for session ${sessionKey}`, e);
    return [];
  }
};

// 10. ENDPOINT: /meetings
export const getMeetings = async (year: number = 2026): Promise<OpenF1Meeting[]> => {
  const url = `${BASE_URL}/meetings?year=${year}`;
  try {
    return await fetchWithCache<OpenF1Meeting[]>(url, 300000);
  } catch (e) {
    console.warn(`Failed to fetch meetings for year ${year}`, e);
    return [];
  }
};

// 11. ENDPOINT: /car_data
export const getCarTelemetry = async (
  sessionKey: string,
  driverNumber: number,
  dateStart?: string,
  dateEnd?: string
): Promise<OpenF1CarData[]> => {
  let url = `${BASE_URL}/car_data?session_key=${encodeURIComponent(sessionKey)}&driver_number=${driverNumber}`;
  // OpenF1 expects the comparison operators literally in the query key.
  if (dateStart) url += `&date>=${encodeURIComponent(new Date(dateStart).toISOString())}`;
  if (dateEnd) url += `&date<${encodeURIComponent(new Date(dateEnd).toISOString())}`;
  try {
    return await fetchWithCache<OpenF1CarData[]>(url, 10000);
  } catch (e) {
    console.warn(`Failed to fetch car telemetry for driver ${driverNumber}`, e);
    return [];
  }
};

// 12. CLASSEMENT / STANDINGS SERVICE
export const getSeasonStandings = async (
  year: number = 2026
): Promise<{ drivers: DriverStanding[]; constructors: ConstructorStanding[] }> => {
  if (year === 2026) {
    return {
      drivers: SEASON_2026_DRIVER_STANDINGS,
      constructors: SEASON_2026_CONSTRUCTOR_STANDINGS
    };
  }

  if (year === 2025) {
    return {
      drivers: SEASON_2025_DRIVER_STANDINGS,
      constructors: SEASON_2025_CONSTRUCTOR_STANDINGS
    };
  }

  throw new Error(`Championship standings unavailable for ${year}`);
};

const formatSeconds = (value: number, includeHours = false): string => {
  if (!Number.isFinite(value) || value <= 0) return '—';
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = (value % 60).toFixed(3).padStart(6, '0');
  return includeHours && hours ? `${hours}:${String(minutes).padStart(2, '0')}:${seconds}` : `${minutes}:${seconds}`;
};

const resultStatus = (result: OpenF1SessionResult, isRace: boolean): string => {
  if (result.dsq) return 'DSQ';
  if (result.dns) return 'DNS';
  if (result.dnf) return 'DNF';
  if (!isRace) {
    const best = Array.isArray(result.duration)
      ? [...result.duration].reverse().find((time): time is number => typeof time === 'number' && time > 0)
      : result.duration;
    return typeof best === 'number' ? formatSeconds(best) : '—';
  }
  if (result.position === 1 && typeof result.duration === 'number') return formatSeconds(result.duration, true);
  if (typeof result.gap_to_leader === 'number') return `+${result.gap_to_leader.toFixed(3)}s`;
  if (typeof result.gap_to_leader === 'string') return result.gap_to_leader;
  return '—';
};

const classifySession = (
  session: OpenF1Session,
  raw: OpenF1SessionResult[],
  drivers: OpenF1Driver[],
  grid: OpenF1StartingGrid[],
  laps: LapData[],
  raceName: string
): SessionClassification => {
  const driverMap = new Map(drivers.map((driver) => [driver.driver_number, driver]));
  const gridMap = new Map(grid.map((entry) => [entry.driver_number, entry.position]));
  const isRace = session.session_name === 'Race';
  const isRaceFormat = isRace || session.session_name === 'Sprint';
  const validRaceLaps = isRace ? laps.filter((lap) => lap.time > 0 && !lap.pitOut) : [];
  const fastest = validRaceLaps.length ? Math.min(...validRaceLaps.map((lap) => lap.time)) : null;
  return {
    key: session.session_key,
    name: session.session_name || session.session_type,
    date: session.date_start,
    results: raw.map((result) => {
      const driver = driverMap.get(result.driver_number);
      const bestLap = validRaceLaps.filter((lap) => lap.driverId === String(result.driver_number))
        .reduce<number | null>((best, lap) => best === null || lap.time < best ? lap.time : best, null);
      const qualifyingTimes: [number | null, number | null, number | null] | undefined = Array.isArray(result.duration)
        ? ([result.duration[0] ?? null, result.duration[1] ?? null, result.duration[2] ?? null] as [number | null, number | null, number | null])
        : undefined;
      return {
        track: raceName,
        position: result.position || 99,
        positionText: result.dsq ? 'DSQ' : result.dns ? 'DNS' : result.position ? String(result.position) : result.dnf ? 'DNF' : 'NC',
        driverNumber: String(result.driver_number),
        driverName: driver?.full_name || `Driver #${result.driver_number}`,
        team: driver?.team_name || '—',
        grid: isRace ? gridMap.get(result.driver_number) ?? null : null,
        laps: result.number_of_laps ?? 0,
        timeRetired: resultStatus(result, isRaceFormat),
        points: result.points ?? 0,
        fastestLap: fastest !== null && bestLap === fastest,
        fastestLapTime: bestLap === null ? '' : formatSeconds(bestLap),
        qualifyingTimes
      };
    }).sort((a, b) => a.position - b.position || Number(a.driverNumber) - Number(b.driverNumber))
  };
};

const isClassificationSession = (session: OpenF1Session): boolean =>
  /^(Race|Sprint|Practice [123]|Qualifying|Sprint Qualifying|Sprint Shootout)$/i.test(session.session_name || '');

export type RaceLoadPhase = 'session' | 'context' | 'laps' | 'results';

export const getFullRaceAnalytics = async (
  race: Race,
  onProgress?: (phase: RaceLoadPhase) => void
): Promise<RaceAnalysisData> => {
  onProgress?.('session');
  const year = Number(race.date.slice(0, 4));
  let sessionKey = race.sessionKey;
  let meetingKey = race.meetingKey;
  if (!sessionKey || !meetingKey) {
    const sessions = await fetchWithCache<OpenF1Session[]>(`${BASE_URL}/sessions?year=${year}`, 300000).catch(() => []);
    const matching = sessions.filter((session) => session.session_name === 'Race')
      .sort((a, b) => Math.abs(Date.parse(a.date_start) - Date.parse(race.date)) - Math.abs(Date.parse(b.date_start) - Date.parse(race.date)))[0];
    if (matching && Math.abs(Date.parse(matching.date_start) - Date.parse(race.date)) < 3 * 86400000) {
      sessionKey = matching.session_key;
      meetingKey = matching.meeting_key;
    }
  }
  if (!sessionKey || !meetingKey) {
    return { race, drivers: [], history: [], results: [], sessions: [], sourceError: 'Session OpenF1 introuvable.' };
  }

  const key = String(sessionKey);
  onProgress?.('context');
  const [stints, weather, raceControl, meetingSessions, grid] = await Promise.all([
    getRaceStints(key), getRaceWeather(key),
    getRaceControlMessages(key),
    fetchWithCache<OpenF1Session[]>(`${BASE_URL}/sessions?meeting_key=${meetingKey}`, 300000).catch(() => []),
    fetchWithCache<OpenF1StartingGrid[]>(`${BASE_URL}/starting_grid?session_key=${key}`, 60000).catch(() => [])
  ]);
  onProgress?.('laps');
  const details = await getRaceDetails(key, stints).catch(() => ({ drivers: [] as Driver[], history: [] as LapData[], totalLaps: 0 }));
  onProgress?.('results');
  const sessions = await Promise.all(meetingSessions.filter(isClassificationSession)
    .sort((a, b) => Date.parse(a.date_start) - Date.parse(b.date_start))
    .map(async (session) => {
      const [results, sessionDrivers] = await Promise.all([
        fetchWithCache<OpenF1SessionResult[]>(`${BASE_URL}/session_result?session_key=${session.session_key}`, 60000).catch(() => []),
        fetchWithCache<OpenF1Driver[]>(`${BASE_URL}/drivers?session_key=${session.session_key}`, 300000).catch(() => [])
      ]);
      return classifySession(session, results, sessionDrivers, session.session_key === sessionKey ? grid : [],
        session.session_key === sessionKey ? details.history : [], race.name);
    }));
  const results = sessions.find((session) => session.key === sessionKey)?.results || [];
  const resultDrivers = results.map((result): Driver => ({
    id: result.driverNumber, code: result.driverName.split(' ').at(-1)?.slice(0, 3).toUpperCase() || result.driverNumber,
    name: result.driverName, team: result.team, color: TEAMS[result.team] || '#ffffff',
    teamLogo: TEAM_ASSETS[result.team]?.logo
  }));
  const driverMap = new Map(resultDrivers.map((driver) => [driver.id, driver]));
  details.drivers.forEach((driver) => driverMap.set(driver.id, driver));
  return {
    race, drivers: [...driverMap.values()], history: details.history, totalLaps: details.totalLaps,
    stints, weather, raceControl, sessions, results,
    sourceError: !details.history.length && !results.length ? 'Données OpenF1 indisponibles pour cette course.' : undefined
  };
};
