import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import RaceAnalysis from './components/RaceAnalysis';
import DriversView from './components/DriversView';
import RacesView from './components/RacesView';
import { Race, ViewState } from './types';
import { Search, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  const handleRaceSelect = (race: Race) => {
    setSelectedRace(race);
  };

  const handleBackToDashboard = () => {
    setSelectedRace(null);
    setCurrentView('DASHBOARD');
  };

  const handleViewChange = (view: ViewState) => {
    setCurrentView(view);
    if (view !== 'RACES') {
      setSelectedRace(null);
    }
  };

  const renderContent = () => {
    if (selectedRace) {
      return <RaceAnalysis race={selectedRace} onBack={handleBackToDashboard} />;
    }

    switch (currentView) {
      case 'RACES':
        return <RacesView onSelectRace={handleRaceSelect} />;
      case 'DRIVERS':
        return <DriversView />;
      case 'DASHBOARD':
      default:
        return <DashboardHome onSelectRace={handleRaceSelect} />;
    }
  };

  return (
    <div className="min-h-screen flex text-slate-100 selection:bg-f1-red selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar currentView={currentView} onChangeView={handleViewChange} />

      {/* Main Layout */}
      <div className="flex-1 flex flex-col ml-20 lg:ml-64 transition-all duration-300 relative z-0">
        
        {/* Top Bar */}
        <header className="h-24 px-8 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-[#050505]/50 border-b border-white/5">
           {/* Branding */}
           <div className="flex flex-col justify-center">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">F1 Analytics Engine</div>
              <div className="text-white font-display font-bold text-lg">Virtual Pit Wall</div>
           </div>

           {/* Search (Centered/Right) */}
           <div className="hidden md:block relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search telemetry, drivers, or strategy..." 
                className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-f1-red/50 focus:bg-white/10 transition-all text-slate-300 placeholder-slate-600"
              />
           </div>

           {/* Decorative / Status Element */}
           <div className="hidden lg:flex items-center gap-3">
              <div className="flex flex-col items-end">
                  <span className="text-[10px] text-f1-red font-bold uppercase tracking-widest animate-pulse">Live Data</span>
                  <span className="text-xs text-slate-500">Server: ONLINE</span>
              </div>
              <div className="w-2 h-2 bg-f1-red rounded-full shadow-[0_0_10px_#e10600]"></div>
           </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-10 overflow-x-hidden flex flex-col">
          <div className="flex-1">
            {renderContent()}
          </div>

          {/* Footer / Creator Signature */}
          <footer className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center justify-center text-slate-500">
             <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm">Designed & Developed by</span>
                <span className="text-white font-display font-bold tracking-wide">LAAMARTI HATIM</span>
             </div>
             <div className="flex items-center text-xs space-x-1 opacity-60">
                <span>Coded with</span>
                <Heart className="w-3 h-3 text-f1-red fill-current mx-1" />
                <span>for the Passion of Racing</span>
             </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
