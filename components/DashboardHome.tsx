import React, { useEffect, useState } from 'react';
import { Trophy, Calendar, ArrowRight, Activity, Zap, MapPin, ChevronRight, RefreshCw } from 'lucide-react';
import { Race, Driver } from '../types';
import { getCalendar, getSeasonDrivers } from '../services/f1Api';
import Skeleton from './Skeleton';
import DriverImage from './DriverImage';
import CircuitMap from './CircuitMap';
import CountryFlag from './CountryFlag';

interface Props {
  onSelectRace: (race: Race) => void;
  onNavigateStandings?: () => void;
}

const DashboardHome: React.FC<Props> = ({ onSelectRace, onNavigateStandings }) => {
  const [races, setRaces] = useState<Race[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async (isBackground: boolean = false) => {
    if (!isBackground) setLoading(true);
    else setIsRefreshing(true);

    try {
      const raceData = await getCalendar(2026);
      setRaces(raceData);

      const driverData = await getSeasonDrivers(2026);
      const sortedDrivers = [...driverData].sort((a, b) => (b.points || 0) - (a.points || 0));
      setDrivers(sortedDrivers);
    } catch (e) {
      console.error("Failed to load dashboard data", e);
    } finally {
      if (!isBackground) setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const completedRaces = races.filter((r) => r.status === 'COMPLETED');
  const upcomingRaces = races.filter((r) => r.status !== 'COMPLETED');
  const nextRace = upcomingRaces[0] || races[races.length - 1];

  return (
    <div className="animate-fadeIn space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest mb-1">
            OpenF1 Race Sessions & Analytics
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-display tracking-tight">
            Mission Control
          </h1>
          <p className="text-neutral-400 mt-2 font-light text-sm md:text-base">
            Race timing from OpenF1 · championship tables are bundled snapshots
          </p>
        </div>
        <div className="self-start md:self-auto flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-mono text-emerald-400">OPENF1 SOURCE</span>
          </div>
          <button
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh 2026 Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#e10600]' : ''}`} />
          </button>
        </div>
      </header>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Next/Featured Race Card */}
        <div className="col-span-1 md:col-span-2 relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 p-6 md:p-8 flex flex-col justify-between min-h-[220px]">
          {nextRace && (
            <div className="absolute -right-6 -bottom-6 w-56 h-56 opacity-15 pointer-events-none hidden sm:block">
              <CircuitMap
                src={nextRace.image}
                name={nextRace.name}
                circuit={nextRace.circuit}
                allowZoom={false}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="relative z-10 w-full">
            {loading ? (
              <div className="space-y-4">
                <Skeleton width="120px" height="24px" />
                <Skeleton width="60%" height="40px" />
                <Skeleton width="40%" height="20px" />
              </div>
            ) : (
              <>
                <div className="inline-flex items-center px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700 text-[#e10600] text-xs font-mono font-bold uppercase tracking-wider mb-3">
                  Round {nextRace ? nextRace.round || nextRace.id : '20'} • Next Grand Prix
                </div>
                {nextRace && <div className="mb-3 flex items-center gap-2 text-[10px] font-mono tracking-widest text-neutral-400 uppercase"><CountryFlag country={nextRace.country} countryCode={nextRace.countryCode} raceName={nextRace.name} className="w-8 h-5" />{nextRace.country || 'Grand Prix'}</div>}
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 leading-none">
                  {nextRace ? nextRace.name : 'Season Finished'}
                </h2>
                <p className="text-sm md:text-base text-neutral-300 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-[#e10600]" />
                  {nextRace ? nextRace.circuit : 'Formula 1 Season'}
                </p>
              </>
            )}
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
            {nextRace && (
              <div className="flex gap-6">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-mono block">Date</span>
                  <span className="text-sm md:text-base font-mono font-bold text-white">
                    {new Date(nextRace.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-mono block">Status</span>
                  <span className="text-sm md:text-base font-mono font-bold text-emerald-400">
                    {nextRace.status === 'COMPLETED' ? 'Completed' : 'Upcoming Round'}
                  </span>
                </div>
              </div>
            )}
            {nextRace && (
              <button
                onClick={() => onSelectRace(nextRace)}
                className="flex items-center gap-1 text-xs font-mono font-bold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded transition-colors"
              >
                <span>Race analysis</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#e10600]" />
              </button>
            )}
          </div>
        </div>

        {/* Drivers Leader Card */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 text-xs font-mono font-bold uppercase tracking-widest">
              2026 Snapshot Leader
            </span>
            <div className="p-2 bg-neutral-800 rounded-lg">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div className="mt-4">
            <div>
              <div className="text-2xl md:text-3xl font-display font-bold text-white">
                {drivers[0]?.name || 'TBD'}
              </div>
              <div className="text-sm font-mono text-[#e10600] mt-1">
                {drivers[0]?.team || ''} • {drivers[0]?.points || 0} PTS
              </div>
            </div>
          </div>
        </div>

        {/* Season Laps / Telemetry Data points */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 text-xs font-mono font-bold uppercase tracking-widest">
              2026 Completed
            </span>
            <div className="p-2 bg-neutral-800 rounded-lg">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl md:text-3xl font-display font-bold text-white">
              {loading ? <Skeleton width="80px" height="36px" /> : `${completedRaces.length} Rounds`}
            </div>
            <div className="text-emerald-400 text-sm font-mono mt-1">
              Race sessions completed in OpenF1
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Standings Preview + Archive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Left Column: Standings Preview */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-neutral-800 flex flex-wrap justify-between items-center gap-2">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>2026 World Drivers' Championship</span>
              </h3>
              {onNavigateStandings && (
                <button
                  onClick={onNavigateStandings}
                  className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Full 2026 Standings</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#e10600]" />
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse text-left">
                <thead>
                  <tr className="border-b border-neutral-800 text-[11px] font-mono text-neutral-400 uppercase tracking-wider bg-neutral-950/40">
                    <th className="p-3 text-center w-12">Pos</th>
                    <th className="p-3">Driver</th>
                    <th className="p-3">Constructor</th>
                    <th className="p-3 text-right">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-sm">
                  {loading ? (
                    Array(8).fill(0).map((_, i) => (
                      <tr key={i}><td colSpan={4} className="p-4"><Skeleton height="32px" /></td></tr>
                    ))
                  ) : (
                    drivers.slice(0, 10).map((driver, i) => (
                      <tr
                        key={driver.id}
                        className="hover:bg-neutral-800/40 transition-colors group"
                      >
                        <td className="p-3 text-center font-display font-bold text-neutral-400 group-hover:text-white">
                          {i + 1}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <DriverImage
                              src={driver.headshot}
                              alt={driver.name}
                              driverNumber={driver.id}
                              teamColor={driver.color}
                              className="w-8 h-8 object-cover rounded-lg flex-shrink-0"
                            />
                            <div>
                              <span className="font-bold text-neutral-200 group-hover:text-white text-sm">
                                {driver.name}
                              </span>
                              <span className="ml-2 font-mono text-xs text-neutral-500">{driver.code}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: driver.color }}
                            />
                            <span className="text-neutral-400 text-xs">{driver.team}</span>
                          </div>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-[#e10600] text-base">
                          <span>
                            {driver.points || 0}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: 2026 Recent Races List */}
        <div className="lg:col-span-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl h-full flex flex-col">
            <div className="p-5 border-b border-neutral-800 flex justify-between items-center">
              <h3 className="font-display font-bold text-lg text-white">2026 Season Races</h3>
              <span className="text-xs font-mono text-neutral-500">{races.length} Rounds</span>
            </div>
            <div className="flex-1 p-3 space-y-2 overflow-y-auto max-h-[580px] custom-scrollbar">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="bg-neutral-800/50 p-4 rounded-xl space-y-2">
                    <Skeleton width="40%" height="12px" />
                    <Skeleton width="70%" height="20px" />
                  </div>
                ))
              ) : (
                races.map((race) => (
                  <div
                    key={race.id}
                    onClick={() => onSelectRace(race)}
                    className="group cursor-pointer bg-neutral-950/60 hover:bg-neutral-800/60 border border-neutral-800 hover:border-neutral-700 p-4 rounded-xl transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-[#e10600] uppercase tracking-wider block">
                            Round {race.round || race.id}
                          </span>
                          {race.status === 'COMPLETED' ? (
                            <span className="text-[9px] font-mono text-emerald-400 uppercase">Done</span>
                          ) : (
                            <span className="text-[9px] font-mono text-neutral-500 uppercase">Upcoming</span>
                          )}
                        </div>
                        <h4 className="font-bold text-white text-sm group-hover:text-[#e10600] transition-colors mt-0.5 flex items-center gap-2">
                          <CountryFlag country={race.country} countryCode={race.countryCode} raceName={race.name} className="w-7 h-[18px]" />{race.name}
                        </h4>
                        <p className="text-xs text-neutral-400 mt-1">{race.circuit}</p>
                      </div>
                      <div className="w-7 h-7 rounded bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:bg-[#e10600] transition-colors">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
