import React, { useEffect, useState } from 'react';
import { getSeasonDrivers } from '../services/f1Api';
import { Driver } from '../types';
import { Trophy, Medal } from 'lucide-react';
import DriverImage from './DriverImage';
import TeamLogo from './TeamLogo';

const DriversView: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(2026);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      const data = await getSeasonDrivers(selectedSeason);
      setDrivers(data.sort((a, b) => (b.points || 0) - (a.points || 0)));
      setLoading(false);
    };
    fetchDrivers();
  }, [selectedSeason]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-2 border-[#e10600] border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-white font-mono text-xs tracking-widest uppercase">
            Loading Driver Grid...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn pb-12">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest mb-1">
            Championship Lineup
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-display tracking-tight">
            {selectedSeason} Driver Grid
          </h1>
          <p className="text-neutral-400 mt-2 font-light text-sm md:text-base">
            Bundled driver snapshot, constructors and points breakdown
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1">
            <button
              onClick={() => setSelectedSeason(2026)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                selectedSeason === 2026 ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              2026 Grid
            </button>
            <button
              onClick={() => setSelectedSeason(2025)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                selectedSeason === 2025 ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              2025 Grid
            </button>
          </div>

          <div className="text-right">
            <div className="text-[#e10600] font-bold font-mono text-2xl">{drivers.length}</div>
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
              Classified Drivers
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {drivers.map((driver, index) => {
          const rank = index + 1;
          const nameParts = driver.name.trim().split(' ');
          const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : driver.name;
          const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : '';

          return (
            <div
              key={driver.id}
              className="group relative bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Top Team Color Accent Line */}
              <div
                className="h-1.5 w-full flex-shrink-0"
                style={{ backgroundColor: driver.color }}
              />

              {/* Header: Rank, Racing Number, Team Logo */}
              <div className="p-5 pb-2 flex justify-between items-center z-20 relative">
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-xs ${
                    rank === 1
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-bold'
                      : rank === 2
                      ? 'bg-slate-300/10 border-slate-300/30 text-slate-200 font-bold'
                      : rank === 3
                      ? 'bg-amber-700/10 border-amber-700/30 text-amber-400 font-bold'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-400 group-hover:text-white group-hover:border-neutral-700 transition-colors'
                  }`}
                >
                  <span className="text-[10px] text-neutral-500 font-bold uppercase">P</span>
                  <span className="font-display font-black text-sm">
                    {rank < 10 ? `0${rank}` : rank}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="font-mono font-black text-xs px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800 text-neutral-200 group-hover:text-white transition-colors"
                    style={{ borderLeftColor: driver.color, borderLeftWidth: '3px' }}
                  >
                    #{driver.id}
                  </span>
                  {driver.teamLogo && (
                    <div className="h-7 w-11 px-1.5 rounded-md bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0">
                      <TeamLogo
                        src={driver.teamLogo}
                        name={driver.team}
                        className="max-h-5 max-w-full w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Driver Portrait Stage: Clean Architectural Framing */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden flex items-end justify-center pt-2">
                <DriverImage
                  src={driver.headshot}
                  alt={driver.name}
                  driverNumber={driver.id}
                  teamColor={driver.color}
                  containerClassName="relative w-full h-full flex items-end justify-center z-10"
                  className="h-full w-full max-h-64 sm:max-h-72 object-contain object-bottom filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500 ease-out"
                  allowZoom={true}
                  driverName={driver.name}
                  teamName={driver.team}
                />
              </div>

              {/* Driver Info & Telemetry Stats */}
              <div className="p-5 bg-neutral-950 border-t border-neutral-800 z-20 relative">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider"
                      style={{ backgroundColor: `${driver.color}20`, color: driver.color }}
                    >
                      {driver.code}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                      {driver.countryCode || 'FIA'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-mono font-black text-white">
                      {driver.points || 0}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-neutral-400 ml-1">
                      PTS
                    </span>
                  </div>
                </div>

                <div className="mt-2">
                  {firstName && (
                    <div className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">
                      {firstName}
                    </div>
                  )}
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight leading-tight uppercase group-hover:text-neutral-100 transition-colors">
                    {lastName}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    {driver.teamLogo && (
                      <TeamLogo
                        src={driver.teamLogo}
                        name={driver.team}
                        className="h-3.5 w-auto max-w-[22px] object-contain shrink-0 opacity-80"
                      />
                    )}
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: driver.color }}
                    />
                    <p className="text-xs text-neutral-400 font-sans truncate">{driver.team}</p>
                  </div>
                </div>

                {/* Stats badges */}
                <div className="mt-4 pt-3.5 border-t border-neutral-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                    <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-white font-bold leading-none">{driver.wins || 0}</span>
                      <span className="text-[9px] text-neutral-500 uppercase mt-0.5">Wins</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                    <Medal className="w-4 h-4 text-neutral-300 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-white font-bold leading-none">{driver.podiums || 0}</span>
                      <span className="text-[9px] text-neutral-500 uppercase mt-0.5">Podiums</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriversView;
