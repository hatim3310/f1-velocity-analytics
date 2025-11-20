import React from 'react';
import { LayoutDashboard, Flag, Users, Settings, Zap, LogOut, CircuitBoard } from 'lucide-react';
import { ViewState } from '../types';

interface Props {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Sidebar: React.FC<Props> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: 'DASHBOARD', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'RACES', icon: Flag, label: 'Races' },
    { id: 'DRIVERS', icon: Users, label: 'Drivers' },
  ];

  return (
    <aside className="w-20 lg:w-64 h-screen fixed left-0 top-0 z-50 flex flex-col border-r border-white/5 bg-[#050505]/80 backdrop-blur-xl transition-all duration-300">
      {/* Logo */}
      <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white/5">
        <div className="relative">
            <div className="absolute -inset-2 bg-f1-red blur-lg opacity-20"></div>
            <Zap className="relative w-8 h-8 text-f1-red fill-current" />
        </div>
        <span className="hidden lg:block ml-4 font-display font-bold text-xl tracking-widest text-white">
          VELOCITY
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 flex flex-col gap-3 px-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id as ViewState)}
            className={`
              relative overflow-hidden flex items-center justify-center lg:justify-start lg:px-4 py-3.5 rounded-2xl transition-all duration-300 group
              ${currentView === item.id 
                ? 'text-white shadow-[0_0_20px_rgba(255,24,1,0.3)]' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'}
            `}
          >
            {currentView === item.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-f1-red/80 to-f1-red/40 rounded-2xl -z-10"></div>
            )}
            <item.icon className={`w-5 h-5 ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`} />
            <span className="hidden lg:block ml-3 font-medium tracking-wide text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-white/5">
        <button className="w-full flex items-center justify-center lg:justify-start lg:px-4 py-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors group">
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          <span className="hidden lg:block ml-3 font-medium text-sm">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;