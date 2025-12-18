import React, { useState, useEffect } from 'react';
import { Monitor, RefreshCw, Database, Trash2, Cpu, Globe, Check } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const SettingsView: React.FC = () => {
    // Use Global Context
    const {
        highPerformance, setHighPerformance,
        spoilerMode, setSpoilerMode,
        autoRefresh, setAutoRefresh
    } = useSettings();

    const [cacheSize, setCacheSize] = useState<string>('0 MB');
    const [isClearing, setIsClearing] = useState(false);
    const [cleared, setCleared] = useState(false);

    useEffect(() => {
        // Simulate calculating cache size
        const size = Math.random() * (15 - 2) + 2;
        setCacheSize(`${size.toFixed(1)} MB`);
    }, []);

    const handleClearCache = () => {
        setIsClearing(true);
        setTimeout(() => {
            setCacheSize('0.0 MB');
            setIsClearing(false);
            setCleared(true);
            setTimeout(() => setCleared(false), 3000);
            // In a real app, we would clear localStorage or indexedDB here
            // localStorage.clear();
        }, 1500);
    };

    return (
        <div className="animate-fadeIn max-w-4xl mx-auto space-y-8 pb-12">
            <header className="mb-10">
                <h1 className="text-3xl md:text-5xl font-bold text-white font-display tracking-tighter">SYSTEM SETTINGS</h1>
                <p className="text-slate-400 mt-2 font-light text-base md:text-lg">Configure your Pit Wall telemetry and display preferences.</p>
            </header>

            {/* General Configuration */}
            <section className="space-y-4">
                <h2 className="text-f1-red font-bold uppercase tracking-widest text-sm mb-4 flex items-center">
                    <Monitor className="w-4 h-4 mr-2" /> Display & Interface
                </h2>

                <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
                    {/* Setting Item */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-bold text-lg">High Performance Mode</h3>
                            <p className="text-slate-400 text-sm">Disable complex animations for faster telemetry processing.</p>
                        </div>
                        <button
                            onClick={() => setHighPerformance(!highPerformance)}
                            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${highPerformance ? 'bg-f1-red' : 'bg-white/10'}`}
                        >
                            <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${highPerformance ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>

                    <div className="border-t border-white/5 mx-[-1rem] md:mx-[-2rem]"></div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-bold text-lg">Spoiler Mode</h3>
                            <p className="text-slate-400 text-sm">Hide race results until you click "Reveal".</p>
                        </div>
                        <button
                            onClick={() => setSpoilerMode(!spoilerMode)}
                            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${spoilerMode ? 'bg-f1-red' : 'bg-white/10'}`}
                        >
                            <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${spoilerMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                </div>
            </section>

            {/* Data & Network */}
            <section className="space-y-4 mt-8">
                <h2 className="text-f1-red font-bold uppercase tracking-widest text-sm mb-4 flex items-center">
                    <Globe className="w-4 h-4 mr-2" /> Network & Data
                </h2>

                <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-bold text-lg">Auto-Refresh Telemetry</h3>
                            <p className="text-slate-400 text-sm">Automatically fetch new data every 30 seconds.</p>
                        </div>
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${autoRefresh ? 'bg-emerald-500' : 'bg-white/10'}`}
                        >
                            <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${autoRefresh ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>

                    <div className="border-t border-white/5 mx-[-1rem] md:mx-[-2rem]"></div>

                    {/* Clear Cache Action */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-white font-bold text-lg">Local Cache</h3>
                            <p className="text-slate-400 text-sm">Manage locally stored images and race data.</p>
                            <div className="mt-2 flex items-center gap-2 text-xs font-mono text-slate-500">
                                <Database className="w-3 h-3" />
                                Current Usage: <span className="text-white">{cacheSize}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleClearCache}
                            disabled={isClearing || cleared}
                            className={`
                        px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2
                        ${cleared
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                                    : 'bg-white/5 hover:bg-white/10 hover:text-white text-slate-300 border border-white/10 hover:border-f1-red/50'}
                    `}
                        >
                            {isClearing ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : cleared ? (
                                <>
                                    <Check className="w-4 h-4" /> Cleared
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" /> Clear Data
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </section>

            {/* System Status */}
            <section className="space-y-4 mt-8">
                <h2 className="text-f1-red font-bold uppercase tracking-widest text-sm mb-4 flex items-center">
                    <Cpu className="w-4 h-4 mr-2" /> System Diagnostics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div>
                            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">API Status</div>
                            <div className="text-emerald-400 font-bold flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                Operational
                            </div>
                        </div>
                        <Globe className="w-8 h-8 text-slate-700" />
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div>
                            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Application Version</div>
                            <div className="text-white font-bold font-mono">v3.0.0-beta</div>
                        </div>
                        <div className="px-3 py-1 bg-white/5 rounded-lg text-xs font-mono text-slate-400">2025 SPEC</div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default SettingsView;
