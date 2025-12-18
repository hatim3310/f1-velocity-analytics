import React, { useEffect, useState } from 'react';
import { getSeasonDrivers } from '../services/f1Api';
import { Driver } from '../types';
import { Trophy, Medal, Gauge } from 'lucide-react';

const DriversView: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      const data = await getSeasonDrivers();
      // Sort by Points (descending)
      setDrivers(data.sort((a, b) => (b.points || 0) - (a.points || 0)));
      setLoading(false);
    };
    fetchDrivers();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-f1-red border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-white font-display tracking-widest animate-pulse">LOADING GRID...</div>
      </div>
    </div>
  );

  return (
    <div className="animate-fadeIn pb-12">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-5xl font-bold text-white font-display tracking-tighter">{new Date().getFullYear()} GRID</h1>
          <p className="text-slate-400 mt-2 font-light text-lg">Championship Contenders & Driver Profiles</p>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-f1-red font-bold font-mono text-2xl">{drivers.length}</div>
          <div className="text-xs text-slate-500 uppercase tracking-widest">Active Drivers</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {drivers.map((driver, index) => (
          <div
            key={driver.id}
            className="group relative bg-[#121212] rounded-[2rem] overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
          >
            {/* Top Stripe (Team Color) */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/5 to-transparent opacity-50"></div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-transparent to-white/5 rounded-bl-[100px] -z-0"></div>

            {/* Team Color Glow (Dynamic) */}
            <div
              className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-[100px] opacity-20 transition-opacity duration-500 group-hover:opacity-40"
              style={{ backgroundColor: driver.color }}
            ></div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col h-[500px]">

              {/* Header: Rank & Logo */}
              <div className="px-6 pt-6 flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-display font-black text-6xl text-white/10 leading-none select-none group-hover:text-white/30 transition-colors">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-f1-red uppercase tracking-widest ml-1">Rank</span>
                </div>
                {driver.teamLogo && (
                  <img
                    src={driver.teamLogo}
                    alt={driver.team}
                    className="h-12 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                )}
              </div>

              {/* Driver Image (Absolute centered/bottom) */}
              <div className="absolute top-16 inset-x-0 flex justify-center pointer-events-none">
                <img
                  src={driver.headshot}
                  alt={driver.name}
                  className="h-80 object-cover drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] z-20 transform group-hover:scale-105 transition-transform duration-500"
                  style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
                />
              </div>

              {/* Stats Overlay (Points) */}
              <div className="absolute top-32 left-6 z-30">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white font-display drop-shadow-lg">{driver.points}</span>
                  <span className="text-xs font-bold text-f1-red uppercase">PTS</span>
                </div>
                {driver.podiums ? (
                  <div className="flex items-center gap-1 mt-1 text-yellow-400 drop-shadow-md">
                    <Trophy className="w-3 h-3 fill-current" />
                    <span className="text-xs font-bold">{driver.podiums} Podiums</span>
                  </div>
                ) : null}
              </div>

              {/* Driver Name & Car (Bottom Section) */}
              <div className="mt-auto relative bg-gradient-to-t from-black via-black/90 to-transparent pt-20 pb-6 px-6">

                {/* Helmet Icon (Simulated with Circle + Number) */}
                <div className="absolute -top-10 right-6 z-30 w-14 h-14 rounded-full border-2 border-white/20 bg-black/50 backdrop-blur-md flex items-center justify-center group-hover:border-f1-red transition-colors shadow-lg">
                  <span className="font-display font-bold text-xl text-white italic">{driver.id}</span>
                </div>

                {/* Car Image */}
                <div className="absolute -top-20 -right-10 opacity-60 group-hover:opacity-100 transition-all duration-500 transform translate-x-10 group-hover:translate-x-0 z-10">
                  {driver.carImage && (
                    <img src={driver.carImage} alt="Car" className="w-64 object-contain drop-shadow-2xl" />
                  )}
                </div>

                <div className="relative z-20">
                  <div className="text-xs font-bold text-f1-red uppercase tracking-[0.2em] mb-1">{driver.code}</div>
                  <h3 className="text-3xl font-bold text-white font-display leading-tight uppercase mb-1">
                    {driver.name.split(' ')[0]} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                      {driver.name.split(' ').slice(1).join(' ')}
                    </span>
                  </h3>
                  <p className="text-sm text-slate-400 font-medium">{driver.team}</p>
                </div>
              </div>
            </div>

            {/* Hover Border Glow */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/10 rounded-[2rem] pointer-events-none transition-all duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriversView;