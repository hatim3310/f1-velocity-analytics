import React, { useEffect, useState } from 'react';
import { getCalendar } from '../services/f1Api';
import { Race } from '../types';
import { MapPin, Calendar, CheckCircle, CircleDashed, ArrowRight } from 'lucide-react';

interface Props {
  onSelectRace: (race: Race) => void;
}

const RacesView: React.FC<Props> = ({ onSelectRace }) => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await getCalendar();
      setRaces(data);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-12 h-12 border-4 border-f1-red border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="animate-fadeIn pb-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white font-display tracking-tight">Season Calendar</h1>
        <p className="text-slate-400 mt-2 font-light">{new Date().getFullYear()} World Championship Schedule</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {races.map((race, index) => {
          const isCompleted = race.status === 'COMPLETED';
          return (
            <div
              key={race.id}
              onClick={() => isCompleted && onSelectRace(race)}
              className={`
                        group relative rounded-3xl overflow-hidden border transition-all duration-500
                        ${isCompleted
                  ? 'bg-gradient-to-br from-white/5 to-white/0 border-white/10 hover:border-f1-red/50 hover:shadow-[0_0_30px_-5px_rgba(255,24,1,0.3)] cursor-pointer'
                  : 'bg-white/5 border-white/5 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
                }
                    `}
            >
              {/* Status Indicator */}
              <div className="absolute top-0 right-0 p-4 z-30">
                {isCompleted ? (
                  <div className="bg-black/50 backdrop-blur-md text-emerald-400 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center border border-emerald-500/30 shadow-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse"></div>
                    <span className="font-mono">Complete</span>
                  </div>
                ) : (
                  <div className="bg-black/50 backdrop-blur-md text-slate-400 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center border border-white/10">
                    <CircleDashed className="w-3 h-3 mr-2" />
                    <span className="font-mono">Upcoming</span>
                  </div>
                )}
              </div>

              {/* Image / Visual Area */}
              <div className="h-56 overflow-hidden relative bg-[#1a1a1a]">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-10"></div>

                {/* Circuit Image */}
                <img
                  src={race.image}
                  alt={race.name}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out relative z-20"
                />

                {/* Fallback pattern (Technical Grid) */}
                <div className="absolute inset-0 z-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>
                <div className="absolute inset-0 flex items-center justify-center z-0 opacity-20">
                  <MapPin className="w-32 h-32 text-white stroke-1" />
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 relative">
                {/* Round Number (Overlapping image) */}
                <div className="absolute -top-6 left-6 z-20 bg-f1-red text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded shadow-lg font-mono">
                  Round {String(index + 1).padStart(2, '0')}
                </div>

                <div className="mt-2">
                  <h3 className="text-2xl font-bold text-white font-display mb-1 group-hover:text-f1-red transition-colors duration-300">
                    {race.name.replace(' Grand Prix', '')}
                  </h3>
                  <div className="flex items-center text-slate-400 text-xs font-medium uppercase tracking-wider mb-6">
                    <span className="text-f1-red mr-2">GP</span>
                    {race.circuit}
                  </div>
                </div>

                {/* Data Grid */}
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Date</div>
                    <div className="flex items-center text-slate-200 font-mono text-sm">
                      <Calendar className="w-3.5 h-3.5 mr-2 text-f1-red" />
                      {new Date(race.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Action</div>
                    <div className="flex items-center text-slate-200 font-mono text-sm">
                      {isCompleted ? (
                        <span className="flex items-center group-hover:translate-x-1 transition-transform duration-300">
                          View Data <ArrowRight className="w-3.5 h-3.5 ml-2 text-f1-red" />
                        </span>
                      ) : (
                        <span className="opacity-50">Locked</span>
                      )}
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

export default RacesView;
