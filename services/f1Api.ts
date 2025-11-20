import { Race, Driver, LapData } from '../types';
import { TEAMS, TEAM_ASSETS, DRIVER_DETAILS_MAP } from '../constants';

const BASE_URL = 'https://api.openf1.org/v1';

const cache = new Map<string, any>();

async function fetchWithCache<T>(url: string): Promise<T> {
  if (cache.has(url)) {
    return cache.get(url) as T;
  }
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    cache.set(url, data);
    return data;
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
}

export const get2024Calendar = async (): Promise<Race[]> => {
  const url = `${BASE_URL}/sessions?year=2024&session_type=Race`;
  try {
    const sessions = await fetchWithCache<any[]>(url);
    return sessions
      .sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime())
      .map((session, index) => ({
        id: session.session_key.toString(),
        name: session.meeting_name || session.location + ' Grand Prix',
        date: session.date_start.split('T')[0],
        circuit: session.circuit_short_name || session.location,
        laps: 0, 
        winnerId: 'TBD',
        image: `https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/${session.circuit_short_name?.replace(/\s+/g, '_') || 'Bahrain'}_Circuit.png.transform/8col/image.png`, 
        status: new Date(session.date_start) < new Date() ? 'COMPLETED' : 'UPCOMING'
      }));
  } catch (e) {
    console.warn("API Fetch failed, falling back to mock", e);
    return [];
  }
};

export const getSeasonDrivers = async (): Promise<Driver[]> => {
  try {
     // Use a recent session key to get the grid (Bahrain 2024 key approx or just use the latest logic)
     // 9472 is roughly Bahrain 2024. 
     // However, to be robust, we will just fetch the latest available race from the calendar
     const races = await get2024Calendar();
     const lastRace = races.filter(r => r.status === 'COMPLETED').pop();
     
     if (!lastRace) return [];

     const driversUrl = `${BASE_URL}/drivers?session_key=${lastRace.id}`;
     const driversData = await fetchWithCache<any[]>(driversUrl);
     
     const uniqueDrivers = new Map();
     
     driversData.forEach((d: any) => {
         if(!uniqueDrivers.has(d.driver_number)) {
             const driverNumber = d.driver_number.toString();
             // Merge API data with our High Quality Local Assets
             const stats = DRIVER_DETAILS_MAP[driverNumber] || { points: 0, podiums: 0, image: d.headshot_url };
             const teamName = d.team_name;
             // Find best match for team name in our assets
             const teamKey = Object.keys(TEAM_ASSETS).find(k => teamName.includes(k)) || 'Red Bull Racing';
             const assets = TEAM_ASSETS[teamKey] || TEAM_ASSETS['Red Bull Racing'];
             const teamColor = '#' + (d.team_colour || TEAMS[teamKey]?.replace('#','') || 'ffffff');

             uniqueDrivers.set(d.driver_number, {
                id: driverNumber,
                code: d.name_acronym,
                name: d.full_name,
                team: teamName,
                color: teamColor,
                headshot: stats.image, // Use HD image from constants if available
                teamLogo: assets.logo,
                carImage: assets.car,
                points: stats.points,
                podiums: stats.podiums
             });
         }
     });
     
     return Array.from(uniqueDrivers.values());

  } catch (e) {
    console.error("Error fetching season drivers", e);
    return [];
  }
};

export const getRaceDetails = async (sessionKey: string) => {
  const driversUrl = `${BASE_URL}/drivers?session_key=${sessionKey}`;
  const driversData = await fetchWithCache<any[]>(driversUrl);
  
  const drivers: Driver[] = driversData.map((d: any) => ({
    id: d.driver_number.toString(),
    code: d.name_acronym,
    name: d.full_name,
    team: d.team_name,
    color: '#' + (d.team_colour || TEAMS[d.team_name]?.replace('#','') || 'ffffff'),
    headshot: d.headshot_url
  }));

  const lapsUrl = `${BASE_URL}/laps?session_key=${sessionKey}`;
  const lapsData = await fetchWithCache<any[]>(lapsUrl);

  const history: LapData[] = lapsData
    .filter((l: any) => l.lap_duration !== null)
    .map((l: any) => ({
      lap: l.lap_number,
      driverId: l.driver_number.toString(),
      position: 0, 
      time: l.lap_duration,
      tyre: 'S' 
    }));

  const lapsMap = new Map<number, any[]>();
  history.forEach(h => {
    if (!lapsMap.has(h.lap)) lapsMap.set(h.lap, []);
    lapsMap.get(h.lap)?.push(h);
  });

  const driverCumulative: Record<string, number> = {};
  drivers.forEach(d => driverCumulative[d.id] = 0);

  history.sort((a, b) => a.lap - b.lap);

  const calculatedHistory: LapData[] = [];
  const maxLaps = Math.max(...history.map(h => h.lap));

  for (let i = 1; i <= maxLaps; i++) {
    const lapLaps = lapsMap.get(i) || [];
    lapLaps.forEach(l => {
      driverCumulative[l.driverId] = (driverCumulative[l.driverId] || 0) + l.time;
    });

    const sortedDrivers = Object.entries(driverCumulative)
      .filter(([_, time]) => time > 0)
      .sort(([_, timeA], [__, timeB]) => timeA - timeB)
      .map(([id]) => id);

    lapLaps.forEach(l => {
      l.position = sortedDrivers.indexOf(l.driverId) + 1;
      calculatedHistory.push(l);
    });
  }

  return {
    drivers,
    history: calculatedHistory.length > 0 ? calculatedHistory : history,
    totalLaps: maxLaps
  };
};