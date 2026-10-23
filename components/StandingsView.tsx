import React, { useEffect, useState } from 'react';
import { Trophy, Shield, Users, Flame, Timer, ChevronRight } from 'lucide-react';
import { DriverStanding, ConstructorStanding } from '../types';
import { getSeasonStandings } from '../services/f1Api';
import DriverImage from './DriverImage';
import TeamLogo from './TeamLogo';
import Skeleton from './Skeleton';

const StandingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DRIVERS' | 'CONSTRUCTORS'>('DRIVERS');
  const [selectedSeason, setSelectedSeason] = useState<number>(2026);
  const [drivers, setDrivers] = useState<DriverStanding[]>([]);
  const [constructors, setConstructors] = useState<ConstructorStanding[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      try {
        const data = await getSeasonStandings(selectedSeason);
        setDrivers(data.drivers);
        setConstructors(data.constructors);
      } catch (e) {
        console.error("Failed to load championship standings", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStandings();
  }, [selectedSeason]);

  return (
    <div className="animate-fadeIn pb-12">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest mb-1">
            FIA Formula 1 World Championship
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-display tracking-tight">
            Championship Standings
          </h1>
          <p className="text-neutral-400 mt-2 font-light text-sm md:text-base">
            Bundled championship snapshots; race session results are fetched from OpenF1
          </p>
        </div>

        {/* Season & Category Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1">
            <button
              onClick={() => setSelectedSeason(2026)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                selectedSeason === 2026 ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              2026 Season
            </button>
            <button
              onClick={() => setSelectedSeason(2025)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                selectedSeason === 2025 ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              2025 Season
            </button>
          </div>

          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('DRIVERS')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'DRIVERS' ? 'bg-[#e10600] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Drivers</span>
            </button>
            <button
              onClick={() => setActiveTab('CONSTRUCTORS')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'CONSTRUCTORS' ? 'bg-[#e10600] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Constructors</span>
            </button>
          </div>
        </div>
      </header>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
          <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Championship Leader</div>
          <div className="text-xl md:text-2xl font-bold font-display text-white mt-1">
            {drivers[0]?.driverName || 'TBD'}
          </div>
          <div className="text-xs font-mono text-[#e10600] mt-1">
            {drivers[0]?.points || 0} PTS • {drivers[0]?.team || ''}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
          <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Constructor Leader</div>
          <div className="text-xl md:text-2xl font-bold font-display text-white mt-1">
            {constructors[0]?.team || 'TBD'}
          </div>
          <div className="text-xs font-mono text-emerald-400 mt-1">
            {constructors[0]?.points || 0} PTS • {constructors[0]?.wins || 0} Wins
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
          <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Title Margin</div>
          <div className="text-xl md:text-2xl font-bold font-display text-white mt-1">
            {drivers.length > 1 ? Math.abs((drivers[0]?.points || 0) - (drivers[1]?.points || 0)) : 0} PTS
          </div>
          <div className="text-xs font-mono text-neutral-400 mt-1">
            P1 vs P2 Differential
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
          <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Data Mode</div>
          <div className="text-xl md:text-2xl font-bold font-display text-white mt-1">
            Snapshot
          </div>
          <div className="text-xs font-mono text-neutral-400 mt-1">
            Bundled {selectedSeason} standings
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      {loading ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
          {Array(8).fill(0).map((_, i) => (
            <Skeleton key={i} height="48px" />
          ))}
        </div>
      ) : activeTab === 'DRIVERS' ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 md:p-6 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="font-display font-bold text-lg md:text-xl text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-neutral-400" />
              <span>World Drivers' Championship Standings</span>
            </h2>
            <span className="text-xs font-mono text-neutral-500">{drivers.length} Entrants</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-800 text-[11px] font-mono text-neutral-400 uppercase tracking-wider bg-neutral-950/60">
                  <th className="py-3 px-4 text-center w-14">Pos</th>
                  <th className="py-3 px-4">Driver</th>
                  <th className="py-3 px-4">Nationality</th>
                  <th className="py-3 px-4">Constructor</th>
                  <th className="py-3 px-4 text-center">Wins</th>
                  <th className="py-3 px-4 text-center">Podiums</th>
                  <th className="py-3 px-4 text-center">Fast Laps</th>
                  <th className="py-3 px-4 text-right">Gap</th>
                  <th className="py-3 px-6 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-sm">
                {drivers.map((driver) => (
                  <tr
                    key={driver.driverNumber}
                    className="hover:bg-neutral-800/50 transition-colors group"
                  >
                    {/* Position */}
                    <td className="py-3.5 px-4 text-center font-display font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-mono ${
                          driver.position === 1
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                            : driver.position === 2
                            ? 'bg-neutral-300/20 text-neutral-200 border border-neutral-300/40 font-bold'
                            : driver.position === 3
                            ? 'bg-amber-700/20 text-amber-400 border border-amber-700/40 font-bold'
                            : 'text-neutral-400'
                        }`}
                      >
                        {driver.position}
                      </span>
                    </td>

                    {/* Driver & Photo */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <DriverImage
                          src={driver.headshot}
                          alt={driver.driverName}
                          driverNumber={driver.driverNumber}
                          teamColor={driver.teamColor}
                          className="w-10 h-10 object-cover flex-shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white group-hover:text-[#e10600] transition-colors flex items-center gap-2">
                            <span>{driver.driverName}</span>
                            <span className="font-mono text-xs text-neutral-500 uppercase">{driver.code}</span>
                          </div>
                          <span className="font-mono text-[11px] text-neutral-400">#{driver.driverNumber}</span>
                        </div>
                      </div>
                    </td>

                    {/* Nationality */}
                    <td className="py-3.5 px-4 font-mono text-xs text-neutral-300">
                      {driver.countryCode || 'FIA'}
                    </td>

                    {/* Team */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: driver.teamColor }}
                        />
                        <span className="text-neutral-200 text-xs md:text-sm">{driver.team}</span>
                      </div>
                    </td>

                    {/* Wins */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-neutral-300">
                      {driver.wins}
                    </td>

                    {/* Podiums */}
                    <td className="py-3.5 px-4 text-center font-mono text-neutral-300">
                      {driver.podiums}
                    </td>

                    {/* Fastest Laps */}
                    <td className="py-3.5 px-4 text-center font-mono text-neutral-300">
                      {driver.fastestLaps}
                    </td>

                    {/* Gap to Leader */}
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-neutral-400">
                      {driver.diff === 0 ? '-' : `${driver.diff} PTS`}
                    </td>

                    {/* Total Points */}
                    <td className="py-3.5 px-6 text-right font-mono font-bold text-[#e10600] text-base md:text-lg">
                      {driver.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 md:p-6 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="font-display font-bold text-lg md:text-xl text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-neutral-400" />
              <span>World Constructors' Championship Standings</span>
            </h2>
            <span className="text-xs font-mono text-neutral-500">{constructors.length} Constructors</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-800 text-[11px] font-mono text-neutral-400 uppercase tracking-wider bg-neutral-950/60">
                  <th className="py-3 px-4 text-center w-14">Pos</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-4">Drivers</th>
                  <th className="py-3 px-4 text-center">Wins</th>
                  <th className="py-3 px-4 text-center">Podiums</th>
                  <th className="py-3 px-4 text-right">Gap</th>
                  <th className="py-3 px-6 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-sm">
                {constructors.map((c) => (
                  <tr
                    key={c.team}
                    className="hover:bg-neutral-800/50 transition-colors group"
                  >
                    {/* Position */}
                    <td className="py-3.5 px-4 text-center font-display font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-mono ${
                          c.position === 1
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                            : c.position === 2
                            ? 'bg-neutral-300/20 text-neutral-200 border border-neutral-300/40 font-bold'
                            : c.position === 3
                            ? 'bg-amber-700/20 text-amber-400 border border-amber-700/40 font-bold'
                            : 'text-neutral-400'
                        }`}
                      >
                        {c.position}
                      </span>
                    </td>

                    {/* Team & Logo */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-1.5 h-10 rounded-full flex-shrink-0"
                          style={{ backgroundColor: c.color }}
                        />
                        {c.logo && (
                          <div className="h-8 w-11 px-1 rounded-md bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0">
                            <TeamLogo
                              src={c.logo}
                              name={c.team}
                              className="max-h-6 max-w-full w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                          </div>
                        )}
                        <span className="font-bold text-white group-hover:text-[#e10600] transition-colors">
                          {c.team}
                        </span>
                      </div>
                    </td>

                    {/* Drivers in Team */}
                    <td className="py-3.5 px-4 font-mono text-xs text-neutral-300">
                      {c.drivers.join(' • ')}
                    </td>

                    {/* Wins */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-neutral-300">
                      {c.wins}
                    </td>

                    {/* Podiums */}
                    <td className="py-3.5 px-4 text-center font-mono text-neutral-300">
                      {c.podiums}
                    </td>

                    {/* Gap */}
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-neutral-400">
                      {c.diff === 0 ? '-' : `${c.diff} PTS`}
                    </td>

                    {/* Points */}
                    <td className="py-3.5 px-6 text-right font-mono font-bold text-[#e10600] text-base md:text-lg">
                      {c.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StandingsView;
