import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import RaceAnalysis from './components/RaceAnalysis';
import DriversView from './components/DriversView';
import RacesView from './components/RacesView';
import SettingsView from './components/SettingsView';
import { Race, ViewState } from './types';
import { Search, Heart, X, MessageSquare, Menu } from 'lucide-react';
import { generateRaceInsight } from './services/geminiService';
import { SettingsProvider } from './context/SettingsContext';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResult(null);

    try {
      // We reuse the existing AI service, framing it as a general query
      const response = await generateRaceInsight(null, searchQuery);
      setSearchResult(response);
    } catch (error) {
      setSearchResult("My telemetry uplink is down. Please try again.");
    } finally {
      setIsSearching(false);
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
      case 'SETTINGS':
        return <SettingsView />;
      case 'DASHBOARD':
      default:
        return <DashboardHome onSelectRace={handleRaceSelect} />;
    }
  };

  return (
    <SettingsProvider>
      <div className="min-h-screen flex text-slate-100 selection:bg-f1-red selection:text-white bg-[#050505]">
        {/* Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          onChangeView={handleViewChange}
          isOpen_={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Layout */}
        <div className="flex-1 flex flex-col ml-0 lg:ml-64 transition-all duration-300 relative z-0 h-screen overflow-y-auto custom-scrollbar">

          {/* Top Bar */}
          <header className="h-20 lg:h-24 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl bg-[#050505]/80 border-b border-white/5">

            {/* Mobile Menu & Branding */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white bg-white/5 rounded-lg active:scale-95 transition-all"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="flex flex-col justify-center">
                <div className="hidden md:block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">F1 Analytics Engine</div>
                <div className="text-white font-display font-bold text-lg leading-none md:leading-normal">Virtual Pit Wall</div>
              </div>
            </div>

            {/* Search (Centered/Right) */}
            <form onSubmit={handleSearch} className="hidden md:block relative w-96 max-w-lg mx-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask the Pit Wall..."
                className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-f1-red/50 focus:bg-white/10 transition-all text-slate-300 placeholder-slate-600"
              />
            </form>

            {/* Decorative / Status Element */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] text-f1-red font-bold uppercase tracking-widest animate-pulse">Live</span>
                <span className="text-xs text-slate-500">2025 Season</span>
              </div>
              <div className="w-2 h-2 bg-f1-red rounded-full shadow-[0_0_10px_#e10600]"></div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-4 md:p-6 lg:p-10 flex flex-col relative">

            {/* AI Response Overlay */}
            {(isSearching || searchResult) && (
              <div className="mb-8 p-6 rounded-3xl bg-slate-900/90 border border-f1-red/30 backdrop-blur-xl animate-fadeIn relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-1 h-full bg-f1-red"></div>
                <button onClick={() => { setSearchResult(null); setSearchQuery(''); }} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>

                <h3 className="text-f1-red font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Race Engineer AI
                </h3>

                {isSearching ? (
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-2 h-2 bg-f1-red rounded-full animate-ping"></div>
                    Analyzing telemetry...
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-slate-200 leading-relaxed">{searchResult}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex-1 pb-10">
              {renderContent()}
            </div>

            {/* Footer / Creator Signature */}
            <footer className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center justify-center text-slate-500 text-center pb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">Engineered by</span>
                <span className="text-white font-display font-bold tracking-wide">LAAMARTI HATIM</span>
              </div>
              <div className="flex items-center text-xs opacity-60">
                <span>v3.0.0 (2025 Spec)</span>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </SettingsProvider>
  );
};
export default App;
