import React, { useEffect, useState } from 'react';
import { DRIVER_STANDINGS, CONSTRUCTOR_STANDINGS } from '../constants';
import { Trophy, Calendar, ArrowRight, Activity, Zap, Timer, Users, MapPin } from 'lucide-react';
import { Race } from '../types';
import { get2024Calendar } from '../services/f1Api';

interface Props {
  onSelectRace: (race: Race) => void;
}

const DashboardHome: React.FC<Props> = ({ onSelectRace }) => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const data = await get2024Calendar();
        setRaces(data);
      } catch (e) {
        console.error("Failed to load calendar", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRaces();
  }, []);

  const completedRaces = races.filter(r => r.status === 'COMPLETED');
  const upcomingRaces = races.filter(r => r.status !== 'COMPLETED');
  const nextRace = upcomingRaces[0];

  return (
    <div className="animate-fadeIn space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white font-display tracking-tight">
            Mission Control
          </h1>
          <p className="text-slate-400 mt-2 font-light">
            Live Telemetry & Season Analytics • 2024
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass-panel rounded-full">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-xs font-mono text-emerald-400">API SYSTEMS ONLINE</span>
        </div>
      </header>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Next Race Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl glass-card group p-8 flex flex-col justify-between min-h-[240px]">
          <div className="absolute inset-0 bg-gradient-to-br from-f1-red/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity"></div>
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-700">
             <Calendar className="w-64 h-64 text-white" />
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 mb-4">
               <div className="w-1.5 h-1.5 bg-white rounded-full mr-2 animate-pulse"></div> Next Grand Prix
            </div>
            <h2 className="text-4xl font-display font-bold text-white mb-2">{nextRace ? nextRace.name : 'Season Finished'}</h2>
            <p className="text-lg text-slate-300 flex items-center">
               <MapPin className="w-5 h-5 mr-2 text-f1-red" />
               {nextRace ? nextRace.circuit : 'See you in 2025'}
            </p>
          </div>
          
          {nextRace && (
            <div className="relative z-10 mt-6 flex gap-4">
               <div className="flex flex-col">
                  <span className="text-xs text-slate-400 uppercase">Date</span>
                  <span className="text-xl font-mono font-bold">{new Date(nextRace.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
               </div>
            </div>
          )}
        </div>

        {/* Mini Stats */}
        <div className="space-y-6">
           <div className="bg-slate-900/40 glass-card p-6 rounded-3xl relative overflow-hidden group h-full flex flex-col justify-center">
              <div className="absolute top-4 right-4 p-2 bg-emerald-500/20 rounded-xl">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Leader</h3>
              <div className="mt-2">
                <div className="text-3xl font-display font-bold text-white">Verstappen</div>
                <div className="text-emerald-400 text-sm font-mono mt-1">Red Bull Racing</div>
              </div>
           </div>
        </div>
        
        <div className="space-y-6">
           <div className="bg-slate-900/40 glass-card p-6 rounded-3xl relative overflow-hidden group h-full flex flex-col justify-center">
              <div className="absolute top-4 right-4 p-2 bg-purple-500/20 rounded-xl">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Season Laps</h3>
              <div className="mt-2">
                <div className="text-3xl font-display font-bold text-white">
                  {loading ? '...' : completedRaces.length * 55}
                </div>
                <div className="text-purple-400 text-sm font-mono mt-1">Data Points</div>
              </div>
           </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Standings */}
        <div className="lg:col-span-8 space-y-8">
           {/* Driver Standings */}
           <div className="glass-card rounded-3xl overflow-hidden border border-white/10">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="font-display font-bold text-xl flex items-center">
                   <Trophy className="w-5 h-5 mr-3 text-yellow-500" />
                   Driver Standings
                </h3>
              </div>
              <div className="p-2">
                 <table className="w-full">
                   <thead>
                     <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                       <th className="p-4">Pos</th>
                       <th className="p-4">Driver</th>
                       <th className="p-4 text-right">Points</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm">
                      {DRIVER_STANDINGS.map((driver, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors rounded-xl group">
                           <td className="p-4 font-display font-bold text-slate-400 group-hover:text-white">{driver.position}</td>
                           <td className="p-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-1 h-8 rounded-full" style={{backgroundColor: driver.teamColor}}></div>
                                 <span className="font-bold text-slate-200 group-hover:text-white">{driver.entity}</span>
                              </div>
                           </td>
                           <td className="p-4 text-right font-mono font-bold text-slate-300">{driver.points}</td>
                        </tr>
                      ))}
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
                   <div className="flex justify-center py-10">
                      <div className="w-8 h-8 border-4 border-f1-red border-t-transparent rounded-full animate-spin"></div>
                   </div>
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