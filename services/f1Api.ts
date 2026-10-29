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

export type RequestPriority = 'high' | 'normal' | 'low';

// Multi-tier cache (In-Memory RAM + LocalStorage Persistent) with TTL support
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const pending = new Map<string, Promise<unknown>>();

const STORAGE_PREFIX = 'f1_v2_';

function getStorageCache<T>(key: string, ttlMs: number): T | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as { data: T; timestamp: number };
    if (Date.now() - entry.timestamp < ttlMs) {
      return entry.data;
    }
    localStorage.removeItem(STORAGE_PREFIX + key);
    return null;
  } catch {
    return null;
  }
}

function setStorageCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const json = JSON.stringify({ data, timestamp: Date.now() });
    // Guard against excessively large payloads (> 350KB) in localStorage
    if (json.length < 350000) {
      localStorage.setItem(STORAGE_PREFIX + key, json);
    }
  } catch {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX)) keysToRemove.push(k);
      }
      keysToRemove.slice(0, Math.ceil(keysToRemove.length / 2)).forEach((k) => localStorage.removeItem(k));
    } catch {}
  }
}

// Priority Queue Rate Limiter (Max ~3 requests/second, matching OpenF1's limit)
interface QueuedRequest {
  resolve: () => void;
  priority: RequestPriority;
  addedAt: number;
}

const queue: QueuedRequest[] = [];
let isProcessingQueue = false;
let lastDispatchAt = 0;
const MIN_INTERVAL_MS = 340; // 3 requests/sec max pacing

const processQueue = async () => {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  while (queue.length > 0) {
    // Sort so high priority is executed first, then normal, then low (FIFO within priority)
    queue.sort((a, b) => {
      const pOrder = { high: 0, normal: 1, low: 2 };
      if (pOrder[a.priority] !== pOrder[b.priority]) {
        return pOrder[a.priority] - pOrder[b.priority];
      }
      return a.addedAt - b.addedAt;
    });

    const current = queue.shift();
    if (!current) break;

    const now = Date.now();
    const waitTime = Math.max(0, lastDispatchAt + MIN_INTERVAL_MS - now);
    if (waitTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
    lastDispatchAt = Date.now();
    current.resolve();
  }

  isProcessingQueue = false;
};

const reserveRequest = (priority: RequestPriority = 'normal'): Promise<void> => {
  return new Promise((resolve) => {
    queue.push({ resolve, priority, addedAt: Date.now() });
    void processQueue();
  });
};

export async function fetchWithCache<T>(
  url: string,
  ttlMs: number = 60000,
  priority: RequestPriority = 'normal',
  forceRefresh: boolean = false
): Promise<T> {
  const now = Date.now();

  // 1. Check in-memory RAM cache
  if (!forceRefresh) {
    const memCached = cache.get(url);
    if (memCached && now - memCached.timestamp < ttlMs) {
      return memCached.data as T;
    }

    // 2. Check localStorage persistent cache
    const stored = getStorageCache<T>(url, ttlMs);
    if (stored !== null) {
      cache.set(url, { data: stored, timestamp: now });
      return stored;
    }
  }

  // 3. Deduplicate in-flight requests for the exact same URL
  if (pending.has(url)) return pending.get(url) as Promise<T>;

  const request = (async () => {
    try {
      for (let attempt = 0; attempt < 3; attempt++) {
        await reserveRequest(priority);
        const response = await fetch(url);
        if (response.status === 429 && attempt < 2) {
          const retryAfter = Number(response.headers.get('Retry-After'));
          const delay = Number.isFinite(retryAfter) && retryAfter > 0
            ? (retryAfter * 1000 + 200)
            : (attempt + 1) * 1200;
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        if (!response.ok) throw new Error(`OpenF1 API returned status ${response.status}`);
        const data = (await response.json()) as T;
        cache.set(url, { data, timestamp: Date.now() });
        setStorageCache(url, data);
        return data;
      }
      throw new Error('OpenF1 rate limit exceeded');
    } catch (error) {
      // Fallback to stale cache if available when network fails
      const stale = cache.get(url)?.data || getStorageCache<T>(url, 30 * 86400000);
      if (stale) return stale as T;

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
  const isPastYear = year < 2026;
  const ttl = isPastYear ? 7 * 86400000 : 2 * 3600000;

  try {
    const [sessions, meetings] = await Promise.all([
      fetchWithCache<OpenF1Session[]>(url, ttl, 'high'),
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

export const getRaceWinner = async (
  race: Race,
  priority: RequestPriority = 'low'
): Promise<Pick<Race, 'winnerId' | 'winnerName' | 'winnerImage' | 'winnerTeam' | 'winnerTeamColor'> | null> => {
  if (race.status !== 'COMPLETED' || !race.sessionKey) return null;
  const key = race.sessionKey;
  const storageKey = `winner_result_${key}`;

  // Check persistent storage first (7-day TTL for completed race winner)
  const cachedWinner = getStorageCache<Pick<Race, 'winnerId' | 'winnerName' | 'winnerImage' | 'winnerTeam' | 'winnerTeamColor'>>(storageKey, 7 * 86400000);
  if (cachedWinner) return cachedWinner;

  const results = await fetchWithCache<OpenF1SessionResult[]>(
    `${BASE_URL}/session_result?session_key=${key}&position=1`,
    7 * 86400000,
    priority
  ).catch(() => []);
  const winner = results.find((entry) => entry.position === 1 && !entry.dsq);
  if (!winner) return null;

  const drivers = await fetchWithCache<OpenF1Driver[]>(
    `${BASE_URL}/drivers?session_key=${key}&driver_number=${winner.driver_number}`,
    7 * 86400000,
    priority
  ).catch(() => []);
  const driver = drivers.find((entry) => entry.driver_number === winner.driver_number);

  const winnerData = {
    winnerId: String(winner.driver_number),
    winnerName: driver?.full_name || `Driver #${winner.driver_number}`,
    winnerImage: getDriverPortrait(driver?.full_name, driver?.headshot_url, Number(race.date.slice(0, 4)), driver?.team_name),
    winnerTeam: driver?.team_name || undefined,
    winnerTeamColor: driver?.team_colour ? `#${driver.team_colour}` : undefined
  };

  setStorageCache(storageKey, winnerData);
  return winnerData;
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
  const byDriver = new Map<number, { pos: number; time: number }[]>();
  positions.filter((p) => p.position > 0 && typeof p.date === 'string')
    .forEach((p) => {
      const time = Date.parse(p.date);
      if (Number.isFinite(time)) {
        const events = byDriver.get(p.driver_number) || [];
        events.push({ pos: p.position, time });
        byDriver.set(p.driver_number, events);
      }
    });
  byDriver.forEach((events) => events.sort((a, b) => a.time - b.time));

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
      if (events[middle].time <= finish) left = middle + 1;
      else right = middle;
    }
    const stint = stintsByDriver.get(lap.driver_number)?.find(
      (s) => s.lap_start <= lap.lap_number && s.lap_end >= lap.lap_number
    );
    return {
      lap: lap.lap_number,
      driverId: String(lap.driver_number),
      position: left ? events[left - 1].pos : 0,
      time: typeof lap.lap_duration === 'number' && lap.lap_duration > 0 ? lap.lap_duration : 0,
      tyre: stint ? tyreCode(stint.compound) : null,
      sectors: [lap.duration_sector_1 ?? null, lap.duration_sector_2 ?? null, lap.duration_sector_3 ?? null] as LapData['sectors'],
      pitOut: lap.is_pit_out_lap,
      dateStart: lap.date_start
    };
  }).sort((a, b) => a.lap - b.lap || a.position - b.position);
};

export const getRaceDetails = async (sessionKey: string, stints: OpenF1Stint[] = [], isCompleted = true) => {
  const ttl = isCompleted ? 86400000 : 30000;
  const [driversData, lapsData, positionsData] = await Promise.all([
    fetchWithCache<OpenF1Driver[]>(`${BASE_URL}/drivers?session_key=${sessionKey}`, ttl, 'high').catch(() => []),
    fetchWithCache<OpenF1Lap[]>(`${BASE_URL}/laps?session_key=${sessionKey}`, ttl, 'high'),
    getRacePositions(sessionKey, isCompleted)
  ]);
  return {
    drivers: driversData.map(mapDriver),
    history: buildLapHistory(lapsData, positionsData, stints),
    totalLaps: Math.max(0, ...lapsData.filter((lap) => typeof lap.lap_duration === 'number' && lap.lap_duration > 0)
      .map((lap) => lap.lap_number))
  };
};

// 4. ENDPOINT: /intervals
export const getRaceIntervals = async (sessionKey: string, isCompleted = true): Promise<OpenF1Interval[]> => {
  const url = `${BASE_URL}/intervals?session_key=${sessionKey}`;
  const ttl = isCompleted ? 86400000 : 10000;
  try {
    return await fetchWithCache<OpenF1Interval[]>(url, ttl, 'high');
  } catch (e) {
    console.warn(`Failed to fetch intervals for session ${sessionKey}`, e);
    return [];
  }
};

// 5. ENDPOINT: /pit
export const getRacePits = async (sessionKey: string, isCompleted = true): Promise<OpenF1Pit[]> => {
  const url = `${BASE_URL}/pit?session_key=${sessionKey}`;
  const ttl = isCompleted ? 86400000 : 15000;
  try {
    return await fetchWithCache<OpenF1Pit[]>(url, ttl, 'high');
  } catch (e) {
    console.warn(`Failed to fetch pit stops for session ${sessionKey}`, e);
    return [];
  }
};

// 6. ENDPOINT: /stints
export const getRaceStints = async (sessionKey: string, isCompleted = true): Promise<OpenF1Stint[]> => {
  const url = `${BASE_URL}/stints?session_key=${sessionKey}`;
  const ttl = isCompleted ? 86400000 : 15000;
  try {
    return await fetchWithCache<OpenF1Stint[]>(url, ttl, 'high');
  } catch (e) {
    console.warn(`Failed to fetch tyre stints for session ${sessionKey}`, e);
    return [];
  }
};

// 7. ENDPOINT: /weather
export const getRaceWeather = async (sessionKey: string, isCompleted = true): Promise<OpenF1Weather[]> => {
  const url = `${BASE_URL}/weather?session_key=${sessionKey}`;
  const ttl = isCompleted ? 86400000 : 15000;
  try {
    return await fetchWithCache<OpenF1Weather[]>(url, ttl, 'high');
  } catch (e) {
    console.warn(`Failed to fetch weather for session ${sessionKey}`, e);
    return [];
  }
};

// 8. ENDPOINT: /race_control
export const getRaceControlMessages = async (sessionKey: string, isCompleted = true): Promise<OpenF1RaceControl[]> => {
  const url = `${BASE_URL}/race_control?session_key=${sessionKey}`;
  const ttl = isCompleted ? 86400000 : 10000;
  try {
    return await fetchWithCache<OpenF1RaceControl[]>(url, ttl, 'high');
  } catch (e) {
    console.warn(`Failed to fetch race control messages for session ${sessionKey}`, e);
    return [];
  }
};

// 9. ENDPOINT: /position
export const getRacePositions = async (sessionKey: string, isCompleted = true): Promise<OpenF1Position[]> => {
  const url = `${BASE_URL}/position?session_key=${sessionKey}`;
  const ttl = isCompleted ? 86400000 : 10000;
  try {
    return await fetchWithCache<OpenF1Position[]>(url, ttl, 'high');
  } catch (e) {
    console.warn(`Failed to fetch positions for session ${sessionKey}`, e);
    return [];
  }
};

// 10. ENDPOINT: /meetings
export const getMeetings = async (year: number = 2026): Promise<OpenF1Meeting[]> => {
  const url = `${BASE_URL}/meetings?year=${year}`;
  const isPastYear = year < 2026;
  const ttl = isPastYear ? 7 * 86400000 : 2 * 3600000;
  try {
    return await fetchWithCache<OpenF1Meeting[]>(url, ttl, 'high');
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
    return await fetchWithCache<OpenF1CarData[]>(url, 15000, 'high');
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
  drivers: (OpenF1Driver | Driver)[],
  grid: OpenF1StartingGrid[],
  laps: LapData[],
  raceName: string
): SessionClassification => {
  const driverMap = new Map<number, { name: string; team: string }>();
  drivers.forEach((d) => {
    if ('driver_number' in d && typeof d.driver_number === 'number') {
      driverMap.set(d.driver_number, {
        name: d.full_name || `Driver #${d.driver_number}`,
        team: d.team_name || '—'
      });
    } else if ('id' in d) {
      const num = Number(d.id);
      if (Number.isFinite(num)) {
        driverMap.set(num, { name: d.name, team: d.team });
      }
    }
  });

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
        driverName: driver?.name || `Driver #${result.driver_number}`,
        team: driver?.team || '—',
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
  const isCompleted = race.status === 'COMPLETED';
  const ttl = isCompleted ? 86400000 : 30000;
  const year = Number(race.date.slice(0, 4));
  let sessionKey = race.sessionKey;
  let meetingKey = race.meetingKey;

  if (!sessionKey || !meetingKey) {
    const sessions = await fetchWithCache<OpenF1Session[]>(`${BASE_URL}/sessions?year=${year}`, ttl, 'high').catch(() => []);
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
    getRaceStints(key, isCompleted),
    getRaceWeather(key, isCompleted),
    getRaceControlMessages(key, isCompleted),
    fetchWithCache<OpenF1Session[]>(`${BASE_URL}/sessions?meeting_key=${meetingKey}`, ttl, 'high').catch(() => []),
    fetchWithCache<OpenF1StartingGrid[]>(`${BASE_URL}/starting_grid?session_key=${key}`, ttl, 'high').catch(() => [])
  ]);

  onProgress?.('laps');
  const details = await getRaceDetails(key, stints, isCompleted).catch(() => ({ drivers: [] as Driver[], history: [] as LapData[], totalLaps: 0 }));

  onProgress?.('results');
  const classificationSessions = meetingSessions.filter(isClassificationSession)
    .sort((a, b) => Date.parse(a.date_start) - Date.parse(b.date_start));

  const sessions = await Promise.all(classificationSessions.map(async (session) => {
    const isCurrentRace = session.session_key === sessionKey;
    const [results, sessionDrivers] = await Promise.all([
      fetchWithCache<OpenF1SessionResult[]>(
        `${BASE_URL}/session_result?session_key=${session.session_key}`,
        ttl,
        'high'
      ).catch(() => []),
      isCurrentRace && details.drivers.length > 0
        ? Promise.resolve([])
        : fetchWithCache<OpenF1Driver[]>(
            `${BASE_URL}/drivers?session_key=${session.session_key}`,
            ttl,
            'high'
          ).catch(() => [])
    ]);

    const effectiveDrivers = (sessionDrivers.length > 0 ? sessionDrivers : details.drivers) as (OpenF1Driver | Driver)[];
    return classifySession(
      session,
      results,
      effectiveDrivers,
      isCurrentRace ? grid : [],
      isCurrentRace ? details.history : [],
      race.name
    );
  }));

  const results = sessions.find((session) => session.key === sessionKey)?.results || [];
  const resultDrivers = results.map((result): Driver => ({
    id: result.driverNumber,
    code: result.driverName.split(' ').at(-1)?.slice(0, 3).toUpperCase() || result.driverNumber,
    name: result.driverName,
    team: result.team,
    color: TEAMS[result.team] || '#ffffff',
    teamLogo: TEAM_ASSETS[result.team]?.logo
  }));
  const driverMap = new Map(resultDrivers.map((driver) => [driver.id, driver]));
  details.drivers.forEach((driver) => driverMap.set(driver.id, driver));

  return {
    race,
    drivers: [...driverMap.values()],
    history: details.history,
    totalLaps: details.totalLaps,
    stints,
    weather,
    raceControl,
    sessions,
    results,
    sourceError: !details.history.length && !results.length ? 'Données OpenF1 indisponibles pour cette course.' : undefined
  };
};
