import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DashboardHome from './components/DashboardHome';
import RaceAnalysis from './components/RaceAnalysis';
import DriversView from './components/DriversView';
import RacesView from './components/RacesView';
import StandingsView from './components/StandingsView';
import { Race, ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  const handleRaceSelect = (race: Race) => {
    setSelectedRace(race);
    window.scrollTo(0, 0);
  };

  const handleBackToDashboard = () => {
    setSelectedRace(null);
    setCurrentView('DASHBOARD');
  };

  const handleBackToRaces = () => {
    setSelectedRace(null);
    setCurrentView('RACES');
  };

  const handleViewChange = (view: ViewState) => {
    setCurrentView(view);
    setSelectedRace(null);
  };

  const renderContent = () => {
    if (selectedRace) {
      return <RaceAnalysis race={selectedRace} onBack={handleBackToRaces} />;
    }

    switch (currentView) {
      case 'STANDINGS':
        return <StandingsView />;
      case 'RACES':
        return <RacesView onSelectRace={handleRaceSelect} />;
      case 'DRIVERS':
        return <DriversView />;
      case 'DASHBOARD':
      default:
        return (
          <DashboardHome
            onSelectRace={handleRaceSelect}
            onNavigateStandings={() => handleViewChange('STANDINGS')}
          />
        );
    }
  };

  return (
      <div className="min-h-screen flex flex-col text-slate-100 selection:bg-f1-red selection:text-white bg-[#090b0e]">
        {/* Top Navigation Bar - Solid Architectural Surface (No Glassmorphism) */}
        <Navbar
          currentView={currentView}
          onChangeView={handleViewChange}
          selectedRace={selectedRace}
          onBackToDashboard={handleBackToDashboard}
        />

        {/* Main Content Area - Full width balanced layout */}
        <main className="flex-1 w-full max-w-[1720px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col relative">
          <div className="flex-1 pb-10">
            {renderContent()}
          </div>
        </main>

        {/* Modernized Architectural Telemetry Footer */}
        <Footer />
      </div>
  );
};

export default App;
