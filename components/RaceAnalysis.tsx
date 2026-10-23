import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, ArrowLeft, Award, Calendar, CloudRain, Flag, MapPin, RefreshCw, TrendingUp } from 'lucide-react';
import { AnalysisTab, Driver, LapData, OpenF1CarData, Race, RaceAnalysisData, RaceResultEntry } from '../types';
import { getCarTelemetry, getFullRaceAnalytics, RaceLoadPhase } from '../services/f1Api';
import PositionHistoryChart from './charts/PositionHistoryChart';
import LapPaceChart from './charts/LapPaceChart';
import CircuitMap from './CircuitMap';
import CountryFlag from './CountryFlag';
import RacePreloader from './RacePreloader';
import { getDriverPortrait, getLocalDriverPortrait } from '../services/imageUtils';

interface Props {
  race: Race;
  onBack: () => void;
}

const seconds = (value: number | null | undefined) =>
  typeof value === 'number' && value > 0
    ? `${Math.floor(value / 60)}:${(value % 60).toFixed(3).padStart(6, '0')}`
    : '—';

const median = (values: number[]) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

const tyreName: Record<string, string> = {
  S: 'Soft', M: 'Medium', H: 'Hard', I: 'Intermediate', W: 'Wet'
};

const RaceAnalysis: React.FC<Props> = ({ race, onBack }) => {
  const [data, setData] = useState<RaceAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadPhase, setLoadPhase] = useState<RaceLoadPhase>('session');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<AnalysisTab>(AnalysisTab.RESULTS);
  const [sessionKey, setSessionKey] = useState<number | null>(null);
  const [selectedLap, setSelectedLap] = useState(1);
  const [selectedDriver, setSelectedDriver] = useState('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [carSamples, setCarSamples] = useState<OpenF1CarData[]>([]);
  const [carLoading, setCarLoading] = useState(false);
  const [winnerPortraitFailed, setWinnerPortraitFailed] = useState(false);
  const [winnerPortraitFallback, setWinnerPortraitFallback] = useState<string>();

  const loadData = useCallback(async (background = false) => {
    if (background) setRefreshing(true);
    else {
      setLoadPhase('session');
      setLoading(true);
    }
    try {
      const result = await getFullRaceAnalytics(race, background ? undefined : setLoadPhase);
      setData(result);
      setSessionKey(result.sessions?.find((session) => session.name === 'Race')?.key ?? null);
      setLastUpdated(new Date());
    } catch (error) {
      setData({ race, drivers: [], history: [], results: [], sessions: [],
        sourceError: error instanceof Error ? error.message : 'OpenF1 indisponible.' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [race]);

  useEffect(() => {
    setData(null);
    setActiveTab(AnalysisTab.RESULTS);
    setSelectedLap(1);
    setSelectedDriver('all');
    setWinnerPortraitFailed(false);
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (race.status !== 'LIVE') return;
    const timer = window.setInterval(() => void loadData(true), 30000);
    return () => window.clearInterval(timer);
  }, [race.status, loadData]);

  useEffect(() => {
    const lap = data?.history.find((entry) => entry.lap === selectedLap && entry.driverId === selectedDriver);
    const key = data?.sessions?.find((session) => session.name === 'Race')?.key || race.sessionKey;
    if (activeTab !== AnalysisTab.PACE || !lap?.dateStart || !lap.time || !key || selectedDriver === 'all') {
      setCarSamples([]);
      setCarLoading(false);
      return;
    }
    let cancelled = false;
    setCarLoading(true);
    setCarSamples([]);
    const end = new Date(Date.parse(lap.dateStart) + lap.time * 1000).toISOString();
    void getCarTelemetry(String(key), Number(selectedDriver), lap.dateStart, end).then((samples) => {
      if (!cancelled) setCarSamples(samples.filter((sample) =>
        Date.parse(sample.date) >= Date.parse(lap.dateStart!) && Date.parse(sample.date) < Date.parse(end)));
    }).finally(() => { if (!cancelled) setCarLoading(false); });
    return () => { cancelled = true; };
  }, [activeTab, data, race.sessionKey, selectedDriver, selectedLap]);

  const sessions = data?.sessions || [];
  const selectedSession = sessions.find((session) => session.key === sessionKey);
  const results = selectedSession?.results || [];
  const isRaceResults = selectedSession?.name === 'Race';
  const hasPoints = isRaceResults || selectedSession?.name === 'Sprint';
  const raceResults = data?.results || [];
  const winner = raceResults.find((result) => result.position === 1);
  const winnerPortrait = winnerPortraitFallback || race.winnerImage || getDriverPortrait(winner?.driverName,
    data?.drivers.find((driver) => driver.id === winner?.driverNumber)?.headshot,
    Number(race.date.slice(0, 4)), winner?.team);
  const fastestLap = raceResults.find((result) => result.fastestLap);
  const totalLaps = winner?.laps || data?.totalLaps || 0;
  const history: LapData[] = data?.history || [];
  const lapRows = history.filter((lap) => lap.lap === selectedLap &&
    (selectedDriver === 'all' || lap.driverId === selectedDriver))
    .sort((a, b) => (a.position || 99) - (b.position || 99));
  const validLapRows = history.filter((lap) => lap.lap === selectedLap && lap.time > 0 && !lap.pitOut);
  const lapBenchmark = validLapRows.length ? Math.min(...validLapRows.map((lap) => lap.time)) : null;
  const driverMap = useMemo(() => {
    const map = new Map<string, Driver>();
    (data?.drivers || []).forEach((driver: Driver) => {
      map.set(String(driver.id), driver);
    });
    return map;
  }, [data?.drivers]);

  const paceSummary = useMemo(() => {
    const grouped = new Map<string, number[]>();
    history.filter((lap) => lap.time > 0 && !lap.pitOut).forEach((lap) => {
      const times = grouped.get(lap.driverId) || [];
      times.push(lap.time);
      grouped.set(lap.driverId, times);
    });
    return [...grouped].map(([driverId, times]) => ({
      driverId, count: times.length, best: Math.min(...times), median: median(times)!
    })).sort((a, b) => a.median - b.median);
  }, [history]);
  const paceLeader = paceSummary[0]?.median;
  const maxSpeed = carSamples.length ? Math.max(...carSamples.map((sample) => sample.speed || 0)) : 0;
  const share = (predicate: (sample: OpenF1CarData) => boolean) => carSamples.length
    ? `${(100 * carSamples.filter(predicate).length / carSamples.length).toFixed(1)}%` : '—';

  if (loading) return <RacePreloader label="Analyse de la course" detail={race.name} circuit={race.circuit} raceName={race.name} phase={loadPhase} compact />;
  if (!data) return null;

  const tabs = [
    { id: AnalysisTab.RESULTS, label: 'Results', icon: Award },
    { id: AnalysisTab.POSITIONS, label: 'Positions', icon: TrendingUp },
    { id: AnalysisTab.PACE, label: 'Lap Pace', icon: Activity },
    { id: AnalysisTab.WEATHER, label: 'Weather & Flags', icon: CloudRain }
  ];

  return <div className="pb-12 space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-mono hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to races
      </button>
      <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
        <span>{race.status === 'LIVE' ? 'Live · refresh every 30s' : 'OpenF1 session data'}{lastUpdated ? ` · ${lastUpdated.toLocaleTimeString()}` : ''}</span>
        <button onClick={() => void loadData(true)} disabled={refreshing} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>
    </div>

    <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 flex flex-wrap items-center justify-between gap-5">
      <div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#e10600] font-mono"><CountryFlag country={race.country} countryCode={race.countryCode} raceName={race.name} className="w-9 h-6" />{race.date.slice(0, 4)} Season · Round {race.round ?? '—'}</div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white font-display mt-2">{race.name}</h1>
        <div className="flex flex-wrap gap-4 mt-3 text-xs text-neutral-400 font-mono">
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{race.circuit}</span>
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{race.date}</span>
          <span className="flex items-center gap-1"><Flag className="w-4 h-4" />{totalLaps ? `${totalLaps} ${winner ? 'official laps' : 'laps recorded'}` : 'Laps unavailable'}</span>
        </div>
      </div>
      <CircuitMap src={race.image} name={race.name} circuit={race.circuit} className="w-48 h-28 object-contain" />
    </div>

    {data.sourceError && <div className="rounded-xl border border-amber-600/30 bg-amber-600/10 px-4 py-3 text-amber-200 text-sm">{data.sourceError}</div>}

    <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-neutral-900 border border-neutral-800">
      {tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setActiveTab(id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold ${activeTab === id ? 'bg-[#e10600] text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}>
        <Icon className="w-4 h-4" />{label}
      </button>)}
    </div>

    {activeTab === AnalysisTab.RESULTS && <div className="space-y-5">
      {winner && <div className="race-result-hero" style={{ '--winner-accent': data.drivers.find((driver) => driver.id === winner.driverNumber)?.color || race.winnerTeamColor || '#e10600' } as React.CSSProperties}>
        <div className="race-result-hero__pattern" aria-hidden="true" />
        <span className="race-result-hero__number" aria-hidden="true">01</span>
        <div className="race-result-hero__content">
          <div className="race-result-hero__eyebrow"><CountryFlag country={race.country} countryCode={race.countryCode} raceName={race.name} className="w-8 h-5" /><span>ROUND {String(race.round ?? '—').padStart(2, '0')} / {race.name}</span></div>
          <div className="race-result-hero__label"><span className="race-result-hero__label-mark" /> RACE WINNER <span className="race-result-hero__classified">01 / CLASSIFIED</span></div>
          <h2>{winner.driverName}</h2>
          <div className="race-result-hero__team">{winner.team}</div>
          <div className="race-result-hero__metrics"><span><small>RACE TIME</small>{winner.timeRetired || '—'}</span><span><small>LAPS</small>{winner.laps || '—'}</span><span><small>POINTS</small>{winner.points ?? '—'}</span></div>
        </div>
        {winnerPortrait && !winnerPortraitFailed ? <img className="race-result-hero__portrait" src={winnerPortrait} alt={`Portrait de ${winner.driverName}, vainqueur du ${race.name}`} onError={() => {
          const fallback = getLocalDriverPortrait(winner.driverName);
          if (fallback && !winnerPortraitFallback) setWinnerPortraitFallback(fallback);
          else setWinnerPortraitFailed(true);
        }} /> : null}
      </div>}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Winning race time" value={winner?.timeRetired || '—'} detail={winner?.team || 'Official result unavailable'} />
        <Stat label="Fastest recorded lap" value={fastestLap?.fastestLapTime || '—'} detail={fastestLap?.driverName || 'Lap data unavailable'} />
        <Stat label="Race entrants" value={raceResults.length ? String(raceResults.length) : '—'} detail="From OpenF1 session_result" />
      </div>
      <div className="session-switcher">
        {sessions.map((session) => <button key={session.key} onClick={() => setSessionKey(session.key)}
          className={`session-switcher__button ${session.key === sessionKey ? 'is-active' : ''}`}>
          {session.name} {session.results.length ? `(${session.results.length})` : ''}
        </button>)}
      </div>
      <div className="race-results-panel">
        <div className="race-results-panel__heading"><span>{selectedSession?.name || 'Session results'}</span><small>{results.length ? `${results.length} DRIVERS / OFFICIAL CLASSIFICATION` : 'OPENF1 CLASSIFICATION'}</small></div>
        {results.length ? <div className="overflow-x-auto"><table className="race-results-table w-full text-left text-xs font-mono">
          <thead className="bg-neutral-950 text-neutral-400 uppercase"><tr>
            <th className="p-3">Pos</th><th className="p-3">Driver</th><th className="p-3">Team</th>
            {isRaceResults && <th className="p-3">Grid</th>}
            <th className="p-3">Laps</th><th className="p-3">Time / status</th>
            {results.some((entry) => entry.qualifyingTimes) && <><th className="p-3">Q1 / SQ1</th><th className="p-3">Q2 / SQ2</th><th className="p-3">Q3 / SQ3</th></>}
            {isRaceResults && <th className="p-3">Best lap</th>}{hasPoints && <th className="p-3">Points</th>}
          </tr></thead>
          <tbody>{results.map((entry: RaceResultEntry, rowIndex) => <tr key={entry.driverNumber} className={`race-result-row ${entry.position === 1 ? 'race-result-row--leader' : ''}`} style={{ animationDelay: `${Math.min(rowIndex, 20) * 24}ms` }}>
            <td className="p-3 font-bold text-white"><span className="race-result-row__position">{entry.positionText}</span></td>
            <td className="p-3 text-white">{entry.driverName} <span className="text-neutral-500">#{entry.driverNumber}</span></td>
            <td className="p-3">{entry.team}</td>
            {isRaceResults && <td className="p-3">{entry.grid ?? '—'}</td>}
            <td className="p-3">{entry.laps}</td><td className="p-3">{entry.timeRetired}</td>
            {results.some((row) => row.qualifyingTimes) && <>{[0, 1, 2].map((index) => <td key={index} className="p-3">{seconds(entry.qualifyingTimes?.[index])}</td>)}</>}
            {isRaceResults && <td className="p-3">{entry.fastestLapTime || '—'}</td>}{hasPoints && <td className="p-3">{entry.points}</td>}
          </tr>)}</tbody>
        </table></div> : <div className="p-6 text-sm text-neutral-400">{selectedSession ? 'Classement indisponible pour cette séance.' : 'Aucune séance disponible depuis OpenF1.'}</div>}
      </div>
    </div>}

    {activeTab === AnalysisTab.POSITIONS && <div className="space-y-4">
      <p className="text-xs text-neutral-400 font-mono">Position OpenF1 connue à la fin de chaque tour. Les positions manquantes restent vides. Le classement final officiel peut différer après pénalités.</p>
      {history.some((lap) => lap.position > 0) ? <PositionHistoryChart data={data} /> : <Empty message="Aucune position par tour disponible." />}
    </div>}

    {activeTab === AnalysisTab.PACE && <div className="space-y-5">
      <p className="text-xs text-neutral-400 font-mono">Temps mesurés par OpenF1. Les médianes excluent uniquement les sorties de stands et les tours sans temps ; elles ne corrigent pas les neutralisations.</p>
      {history.some((lap) => lap.time > 0) ? <LapPaceChart data={data} /> : <Empty message="Aucun temps au tour disponible." />}
      {paceSummary.length > 0 && <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-x-auto">
        <div className="p-4 border-b border-neutral-800 font-display font-bold">Measured pace</div>
        <table className="w-full text-xs font-mono text-left"><thead className="text-neutral-400 bg-neutral-950"><tr><th className="p-3">Driver</th><th className="p-3">Timed laps</th><th className="p-3">Best lap</th><th className="p-3">Median lap</th><th className="p-3">Delta to best median</th></tr></thead>
          <tbody>{paceSummary.map((row) => <tr key={row.driverId} className="border-t border-neutral-800"><td className="p-3 text-white">{driverMap.get(row.driverId)?.name || `#${row.driverId}`}</td><td className="p-3">{row.count}</td><td className="p-3">{seconds(row.best)}</td><td className="p-3">{seconds(row.median)}</td><td className="p-3">{paceLeader === undefined ? '—' : `+${(row.median - paceLeader).toFixed(3)}s`}</td></tr>)}</tbody>
        </table>
      </div>}
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
        <div className="p-4 border-b border-neutral-800 font-display font-bold">Lap inspector</div>
        <div className="p-4 flex flex-wrap items-center gap-3 text-xs font-mono">
          <label htmlFor="lap-select">Lap</label>
          <select id="lap-select" value={selectedLap} onChange={(event) => setSelectedLap(Number(event.target.value))} className="bg-neutral-950 border border-neutral-700 rounded-lg p-2">
            {Array.from(new Set(history.map((lap) => lap.lap))).sort((a: number, b: number) => a - b).map((lap) => <option key={lap} value={lap}>{lap}</option>)}
          </select>
          <label htmlFor="driver-select">Driver</label>
          <select id="driver-select" value={selectedDriver} onChange={(event) => setSelectedDriver(event.target.value)} className="bg-neutral-950 border border-neutral-700 rounded-lg p-2">
            <option value="all">All drivers</option>{data.drivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name}</option>)}
          </select>
          <span className="text-neutral-500">Fastest measured lap in this lap: {seconds(lapBenchmark)}</span>
        </div>
        {lapRows.length ? <div className="overflow-x-auto"><table className="w-full text-xs font-mono text-left"><thead className="bg-neutral-950 text-neutral-400"><tr><th className="p-3">Pos</th><th className="p-3">Driver</th><th className="p-3">Lap time</th><th className="p-3">Delta</th><th className="p-3">S1</th><th className="p-3">S2</th><th className="p-3">S3</th><th className="p-3">Tyre</th></tr></thead>
          <tbody>{lapRows.map((lap: LapData) => <tr key={lap.driverId} className="border-t border-neutral-800"><td className="p-3">{lap.position || '—'}</td><td className="p-3 text-white">{driverMap.get(lap.driverId)?.name || `#${lap.driverId}`}</td><td className="p-3">{seconds(lap.time)}{lap.pitOut ? ' · pit out' : ''}</td><td className="p-3">{lapBenchmark !== null && lap.time > 0 && !lap.pitOut ? `+${(lap.time - lapBenchmark).toFixed(3)}s` : '—'}</td><td className="p-3">{seconds(lap.sectors?.[0])}</td><td className="p-3">{seconds(lap.sectors?.[1])}</td><td className="p-3">{seconds(lap.sectors?.[2])}</td><td className="p-3">{lap.tyre ? tyreName[lap.tyre] : '—'}</td></tr>)}</tbody></table></div> : <div className="p-5 text-neutral-400 text-sm">Aucun tour enregistré pour cette sélection.</div>}
      </div>
      {selectedDriver !== 'all' && <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-5 space-y-4">
        <div><h2 className="font-display font-bold">Car telemetry · lap {selectedLap}</h2><p className="text-xs font-mono text-neutral-500 mt-1">OpenF1 car_data samples for {driverMap.get(selectedDriver)?.name || `#${selectedDriver}`}. Percentages are shares of samples, not time or distance.</p></div>
        {carLoading ? <div className="text-sm text-neutral-400">Loading car samples…</div> : carSamples.length ? <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Top speed" value={`${maxSpeed} km/h`} detail="Maximum measured" />
            <Stat label="Full throttle" value={share((sample) => sample.throttle >= 95)} detail="Throttle ≥ 95%" />
            <Stat label="Braking" value={share((sample) => sample.brake === 100)} detail="Brake signal active" />
            <Stat label="DRS active" value={share((sample) => [10, 12, 14].includes(sample.drs))} detail="DRS codes 10, 12, 14" />
          </div>
          <div className="text-xs text-neutral-400 font-mono">Speed trace · {carSamples.length} samples</div>
          <svg viewBox="0 0 600 140" preserveAspectRatio="none" className="w-full h-36 rounded-lg bg-neutral-950" role="img" aria-label="Speed trace through selected lap">
            <polyline fill="none" stroke="#e10600" strokeWidth="2" points={carSamples.map((sample, index) => `${(index / Math.max(1, carSamples.length - 1) * 600).toFixed(1)},${(130 - (sample.speed || 0) / Math.max(1, maxSpeed) * 120).toFixed(1)}`).join(' ')} />
          </svg>
        </> : <div className="text-sm text-neutral-400">Car telemetry unavailable for this lap.</div>}
      </div>}
    </div>}

    {activeTab === AnalysisTab.WEATHER && <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Stat label="Track temperature" value={data.weather?.length ? `${data.weather.at(-1)!.track_temperature}°C` : '—'} detail="Latest OpenF1 reading" />
        <Stat label="Air temperature" value={data.weather?.length ? `${data.weather.at(-1)!.air_temperature}°C` : '—'} detail="Latest OpenF1 reading" />
        <Stat label="Humidity" value={data.weather?.length ? `${data.weather.at(-1)!.humidity}%` : '—'} detail="Latest OpenF1 reading" />
        <Stat label="Rain observed" value={data.weather?.length ? (data.weather.some((row) => row.rainfall > 0) ? 'Yes' : 'No') : '—'} detail="Observed, not a forecast" />
      </div>
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-5"><h2 className="font-display font-bold mb-4">Race control</h2>
        {data.raceControl?.length ? <div className="space-y-2 max-h-96 overflow-y-auto">{data.raceControl.map((message, index) => <div key={`${message.date}-${index}`} className="p-3 rounded-lg bg-neutral-950 text-xs font-mono text-neutral-300 flex gap-4 justify-between"><span>{message.message}</span><span className="text-neutral-500 whitespace-nowrap">{message.flag || message.category}</span></div>)}</div> : <Empty message="Aucun message de direction de course disponible." />}
      </div>
    </div>}
  </div>;
};

const Stat = ({ label, value, detail }: { label: string; value: string; detail: string }) => <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl"><div className="text-[11px] uppercase font-mono text-neutral-500">{label}</div><div className="text-lg font-display font-bold text-white mt-1">{value}</div><div className="text-xs text-neutral-400 mt-1">{detail}</div></div>;
const Empty = ({ message }: { message: string }) => <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-neutral-400 text-sm">{message}</div>;

export default RaceAnalysis;
