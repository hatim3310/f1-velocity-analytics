import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Trophy, Flag, Users, Zap, Menu, X, ArrowLeft, Radio } from 'lucide-react';
import { ViewState, Race } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  selectedRace?: Race | null;
  onBackToDashboard?: () => void;
}

interface NavItem {
  id: ViewState;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'STANDINGS', label: 'Standings', icon: Trophy },
  { id: 'RACES', label: 'Races & Calendar', icon: Flag },
  { id: 'DRIVERS', label: 'Drivers Grid', icon: Users },
];

const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onChangeView,
  selectedRace,
  onBackToDashboard,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        toggleButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Close mobile menu when viewport is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const handleNavClick = (viewId: ViewState) => {
    onChangeView(viewId);
    setIsMobileMenuOpen(false);
  };

  const handleBrandClick = () => {
    if (selectedRace && onBackToDashboard) {
      onBackToDashboard();
    } else {
      onChangeView('DASHBOARD');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b0d10] border-b border-[#20252e] shadow-lg">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-18 lg:h-20 flex items-center justify-between gap-4">

          {/* Left: Brand Identity */}
          <div className="flex items-center gap-6">
            <button
              onClick={handleBrandClick}
              className="flex items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-[#ff1801] rounded-lg p-1 group transition-transform active:scale-98"
              aria-label="F1 Velocity Analytics - Return to Mission Control"
            >
              <div className="w-10 h-10 rounded-xl bg-[#14171e] border border-[#252b36] flex items-center justify-center transition-colors group-hover:border-[#ff1801]">
                <Zap className="w-5 h-5 text-[#ff1801] fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-lg md:text-xl tracking-wider text-white uppercase leading-none">
                  VELOCITY
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="font-mono text-[9px] md:text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none">
                    F1 Telemetry Engine
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#ff1801]"></span>
                  <span className="font-mono text-[9px] md:text-[10px] text-neutral-400 font-bold leading-none">
                    2026
                  </span>
                </div>
              </div>
            </button>

            {/* Active Race Breadcrumb (Visible when analyzing a race) */}
            {selectedRace && (
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#13161c] border border-[#242932]">
                <span className="font-mono text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                  Analyzing:
                </span>
                <span className="font-display text-xs text-white font-bold tracking-wide max-w-[200px] truncate">
                  {selectedRace.name}
                </span>
                {onBackToDashboard && (
                  <button
                    onClick={onBackToDashboard}
                    className="ml-1 inline-flex items-center gap-1 font-mono text-[10px] text-[#ff1801] hover:text-white uppercase font-bold tracking-wider transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Back
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Center: Desktop Navigation Bar */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-1 bg-[#12151c] p-1.5 rounded-xl border border-[#222732]"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = currentView === item.id && !selectedRace;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    flex items-center gap-2.5 px-3.5 py-2 rounded-lg font-mono text-xs uppercase tracking-wider font-bold transition-all duration-150
                    ${isActive
                      ? 'bg-[#1e232d] text-white border border-[#2e3644] shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-[#161a22] border border-transparent'}
                    focus-visible:outline-2 focus-visible:outline-[#ff1801] focus-visible:outline-offset-1
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#ff1801]' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Telemetry Status and Mobile Trigger */}
          <div className="flex items-center gap-3">
            {/* Data source (Desktop & Tablet) */}
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#12151c] border border-[#222732]">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e10600]"></span>
              </span>
              <div className="flex flex-col text-left">
                <span className="font-mono text-[9px] font-bold text-[#f4483e] uppercase tracking-widest leading-none">
                  Data Source
                </span>
                <span className="font-mono text-[10px] text-neutral-400 font-semibold leading-tight">
                  OpenF1 Data
                </span>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              ref={toggleButtonRef}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="lg:hidden p-2.5 rounded-xl bg-[#12151c] hover:bg-[#161a22] text-neutral-300 hover:text-white border border-[#222732] active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-[#ff1801]"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-neutral-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer - Solid Architectural Surface (No Glassmorphism) */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          ref={mobileMenuRef}
          className="lg:hidden w-full bg-[#0b0d10] border-t border-[#1f242c] px-4 py-4 space-y-2 shadow-2xl"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = currentView === item.id && !selectedRace;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all
                  ${isActive
                    ? 'bg-[#1e232d] text-white border border-[#2e3644]'
                    : 'text-neutral-400 hover:text-white hover:bg-[#14171e] border border-transparent'}
                  focus-visible:outline-2 focus-visible:outline-[#ff1801]
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#ff1801]' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <div className="w-2 h-2 rounded-full bg-[#ff1801]"></div>}
              </button>
            );
          })}

          {/* Live Status Row in Mobile Menu */}
          <div className="pt-2 flex items-center justify-between px-4 py-2.5 bg-[#12151c] rounded-xl border border-[#222732] text-xs font-mono">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-[#ff1801]" />
              <span className="text-neutral-400 font-semibold">Feed Status</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                OpenF1 on demand
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
