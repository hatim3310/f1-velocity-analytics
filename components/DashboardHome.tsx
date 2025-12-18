import React, { useEffect, useState } from 'react';
import { DRIVER_STANDINGS, CONSTRUCTOR_STANDINGS } from '../constants';
import { Trophy, Calendar, ArrowRight, Activity, Zap, Timer, Users, MapPin } from 'lucide-react';
import { Race } from '../types';
import { getCalendar } from '../services/f1Api';
import Skeleton from './Skeleton';
import { useSettings } from '../context/SettingsContext';

interface Props {
  onSelectRace: (race: Race) => void;
}

const DashboardHome: React.FC<Props> = ({ onSelectRace }) => {
  const { spoilerMode } = useSettings(); // Get Spoiler Mode state
  const [races, setRaces] = useState<Race[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]); // Use strict type in real app
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const raceData = await getCalendar(); // This now returns 2025 dynamically
        setRaces(raceData);

        // Fetch drivers for the season using the API helper
        // Since we updated f1Api.ts to handle season start, this should return the grid
        const { getSeasonDrivers } = await import('../services/f1Api');
        const driverData = await getSeasonDrivers();

        // Sort by team or points (if any)
        const sortedDrivers = driverData.sort((a, b) => (b.points || 0) - (a.points || 0));
        setDrivers(sortedDrivers);

      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedRaces = races.filter(r => r.status === 'COMPLETED');
  const upcomingRaces = races.filter(r => r.status !== 'COMPLETED');
  const nextRace = upcomingRaces[0];

  return (
    <div className="animate-fadeIn space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-display tracking-tight">
            Mission Control
          </h1>
          <p className="text-slate-400 mt-2 font-light text-sm md:text-base">
            Live Telemetry & Season Analytics • {new Date().getFullYear()}
          </p>
        </div>
        <div className="self-start md:self-auto flex items-center gap-2 px-4 py-2 glass-panel rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-mono text-emerald-400">API SYSTEMS ONLINE</span>
        </div>
      </header>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Next Race Card (First on Mobile) */}
        <div className="col-span-1 md:col-span-2 relative overflow-hidden rounded-3xl glass-card group p-6 md:p-8 flex flex-col justify-between min-h-[200px] md:min-h-[240px]">
          <div className="absolute inset-0 bg-gradient-to-br from-f1-red/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity"></div>
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-700">
            <Calendar className="w-48 h-48 md:w-64 md:h-64 text-white" />
          </div>

          <div className="relative z-10 w-full">
            {loading ? (
              <div className="space-y-4">
                <Skeleton width="120px" height="24px" className="rounded-full" />
                <Skeleton width="60%" height="48px" />
                <Skeleton width="40%" height="24px" />
              </div>
            ) : (
              <>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 mb-4">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mr-2 animate-pulse"></div> Next Grand Prix
                </div>
                <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-2 leading-none">{nextRace ? nextRace.name : 'Season Finished'}</h2>
                <p className="text-base md:text-lg text-slate-300 flex items-center">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2 text-f1-red" />
                  {nextRace ? nextRace.circuit : `See you in ${new Date().getFullYear() + 1}`}
                </p>
              </>
            )}
          </div>

          <div className="relative z-10 mt-6">
            {nextRace && (
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase">Date</span>
                  <span className="text-lg md:text-xl font-mono font-bold">{new Date(nextRace.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mini Stats (Stacked on Mobile) */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-slate-900/40 glass-card p-6 rounded-3xl relative overflow-hidden group h-full flex flex-col justify-center">
            <div className="absolute top-4 right-4 p-2 bg-emerald-500/20 rounded-xl">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Leader</h3>
            <div className="mt-2 relative">
              <div className={`transition-all duration-300 ${spoilerMode ? 'blur-md select-none opacity-50' : ''}`}>
                <div className="text-2xl md:text-3xl font-display font-bold text-white">{drivers[0]?.name?.split(' ').pop() || 'TBD'}</div>
                <div className="text-emerald-400 text-sm font-mono mt-1">{drivers[0]?.team || 'Season Start'}</div>
              </div>
              {spoilerMode && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white bg-slate-800/80 px-2 py-1 rounded border border-white/10">HIDDEN</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="bg-slate-900/40 glass-card p-6 rounded-3xl relative overflow-hidden group h-full flex flex-col justify-center">
            <div className="absolute top-4 right-4 p-2 bg-purple-500/20 rounded-xl">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Season Laps</h3>
            <div className="mt-2">
              <div className="text-2xl md:text-3xl font-display font-bold text-white">
                {loading ? <Skeleton width="80px" height="36px" /> : completedRaces.length * 55}
              </div>
              <div className="text-purple-400 text-sm font-mono mt-1">Data Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Standings + Archive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

        {/* Left Column: Standings (Scrollable on Mobile) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Driver Standings */}
          <div className="glass-card rounded-3xl overflow-hidden border border-white/10">
            <div className="p-6 border-b border-white/5 flex flex-wrap justify-between items-center bg-white/5 gap-2">
              <h3 className="font-display font-bold text-lg md:text-xl flex items-center">
                <Trophy className="w-5 h-5 mr-3 text-yellow-500" />
                {completedRaces.length > 0 ? "Driver Standings" : `${new Date().getFullYear()} Driver Lineup`}
              </h3>
            </div>

            {/* Scroll Container (Removed min-width for strictly fitting screen) */}
            <div className="p-2">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-white/5">
                    <th className="p-3 w-12 text-center">Pos</th>
                    <th className="p-3">Driver</th>
                    <th className="p-3 text-right">Pts</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i}><td colSpan={3} className="p-4"><Skeleton height="32px" /></td></tr>
                    ))
                  ) : (
                    drivers.map((driver, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0">
                        <td className="p-3 text-center font-display font-bold text-slate-400 group-hover:text-white">
                          {completedRaces.length > 0 ? i + 1 : '-'}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            {/* Team Color Indicator */}
                            <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: driver.color }}></div>

                            {/* Driver Name (Full visibility) */}
                            <span className="font-bold text-slate-200 group-hover:text-white text-sm md:text-base">
                              {driver.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-f1-red text-base md:text-lg">
                          <span className={`${spoilerMode ? 'blur-sm opacity-50' : ''}`}>
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

        {/* Right Column: Recent Races List */}
        <div className="lg:col-span-4">
          <div className="glass-card rounded-3xl h-full flex flex-col border border-white/10">
            <div className="p-6 border-b border-white/5 bg-white/5">
              <h3 className="font-display font-bold text-xl text-white">Race Archive</h3>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[600px] custom-scrollbar">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                    <div className="flex justify-between items-start">
                      <div className="w-full">
                        <Skeleton width="40%" height="12px" className="mb-2" />
                        <Skeleton width="70%" height="20px" className="mb-2" />
                        <Skeleton width="50%" height="12px" />
                      </div>
                      <Skeleton variant="circular" width="32px" height="32px" />
                    </div>
                  </div>
                ))
              ) : (
                completedRaces.slice().reverse().map((race) => (
                  <div
                    key={race.id}
                    onClick={() => onSelectRace(race)}
                    className="group cursor-pointer bg-white/5 hover:bg-white/10 border border-white/5 hover:border-f1-red/40 p-4 rounded-2xl transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <span className="text-[10px] font-bold text-f1-red uppercase tracking-widest mb-1 block">Round {race.id}</span>
                        <h4 className="font-bold text-white group-hover:text-f1-red transition-colors">{race.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">{race.circuit}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-f1-red group-hover:text-white transition-all">
                        <ArrowRight className="w-4 h-4" />
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