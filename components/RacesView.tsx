import React, { useEffect, useState } from 'react';
import { get2024Calendar } from '../services/f1Api';
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
      const data = await get2024Calendar();
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
         <p className="text-slate-400 mt-2 font-light">2024 World Championship Schedule</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
         {races.map((race, index) => {
             const isCompleted = race.status === 'COMPLETED';
             return (
                <div 
                    key={race.id}
                    onClick={() => isCompleted && onSelectRace(race)}
                    className={`
                        group relative rounded-3xl overflow-hidden border transition-all duration-300
                        ${isCompleted ? 'glass-card cursor-pointer hover:border-f1-red/40' : 'bg-white/5 border-white/5 opacity-70 grayscale hover:grayscale-0 hover:opacity-100'}
                    `}
                >
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-20">
                        {isCompleted ? (
                             <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center border border-emerald-500/20">
                                 <CheckCircle className="w-3 h-3 mr-1" /> Finished
                             </div>
                        ) : (
                             <div className="bg-slate-500/20 text-slate-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center border border-slate-500/20">
                                 <CircleDashed className="w-3 h-3 mr-1" /> Upcoming
                             </div>
                        )}
                    </div>

                    {/* Image BG */}
                    <div className="h-48 overflow-hidden relative">
                         <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] to-transparent z-10"></div>
                         <img 
                            src={race.image} 
                            alt={race.name} 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                         />
                         
                         <div className="absolute bottom-4 left-6 z-20">
                             <div className="text-f1-red font-bold text-xs uppercase tracking-widest mb-1">Round {index + 1}</div>
                             <h3 className="text-xl font-bold text-white font-display">{race.name}</h3>
                         </div>
                    </div>

                    <div className="p-6 pt-4">
                        <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center text-slate-400 text-sm">
                                 <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                                 {race.circuit}
                             </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                             <div className="flex items-center text-white font-mono">
                                 <Calendar className="w-4 h-4 mr-2 text-f1-red" />
                                 {new Date(race.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                             </div>
                             {isCompleted && (
                                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-f1-red group-hover:text-white transition-colors">
                                     <ArrowRight className="w-4 h-4" />
                                 </div>
                             )}
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
