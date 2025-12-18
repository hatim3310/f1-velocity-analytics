import React from 'react';
import { LayoutDashboard, Flag, Users, Settings, Zap, LogOut, CircuitBoard } from 'lucide-react';
import { ViewState } from '../types';

interface Props {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen_: boolean; // Renamed to avoid collision if needed, but lets just use isOpen
  onClose: () => void;
}

const Sidebar: React.FC<Props> = ({ currentView, onChangeView, isOpen_, onClose }) => {
  const navItems = [
    { id: 'DASHBOARD', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'RACES', icon: Flag, label: 'Races' },
    { id: 'DRIVERS', icon: Users, label: 'Drivers' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 z-40 lg:hidden transition-opacity duration-300 ${isOpen_ ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#050505] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen_ ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-24 flex items-center px-8 border-b border-white/5 relative">
          <div className="relative">
            <div className="absolute -inset-2 bg-f1-red blur-lg opacity-20"></div>
            <Zap className="relative w-8 h-8 text-f1-red fill-current" />
          </div>
          <span className="ml-4 font-display font-bold text-xl tracking-widest text-white">
            VELOCITY
          </span>

          {/* Mobile Close Button */}
          <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 lg:hidden text-slate-400 hover:text-white">
            <LogOut className="w-5 h-5 rotate-180" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 flex flex-col gap-3 px-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onChangeView(item.id as ViewState); onClose(); }}
              className={`
                relative overflow-hidden flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group
                ${currentView === item.id
                  ? 'text-white bg-white/5 shadow-[0_0_20px_rgba(255,24,1,0.1)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}
            >
              {currentView === item.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-f1-red/10 to-transparent rounded-2xl -z-10 border-l-2 border-f1-red"></div>
              )}
              <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-f1-red' : ''} transition-transform duration-300`} />
              <span className="ml-3 font-medium tracking-wide text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-white/5">
          <button
            onClick={() => { onChangeView('SETTINGS'); onClose(); }}
            className={`
                w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group
                ${currentView === 'SETTINGS'
                ? 'text-white bg-white/5 shadow-[0_0_20px_rgba(255,24,1,0.1)]'
                : 'text-slate-500 hover:text-white hover:bg-white/5'}
            `}
          >
            <Settings className={`w-5 h-5 transition-transform duration-500 ${currentView === 'SETTINGS' ? 'text-f1-red rotate-90' : 'group-hover:rotate-90'}`} />
            <span className="ml-3 font-medium text-sm">Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;