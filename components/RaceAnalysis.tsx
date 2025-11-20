import React, { useState, useEffect } from 'react';
import { Race, RaceAnalysisData, AnalysisTab } from '../types';
import { getRaceDetails } from '../services/f1Api';
import { generateRaceData } from '../services/dataGenerator';
import PositionHistoryChart from './charts/PositionHistoryChart';
import LapPaceChart from './charts/LapPaceChart';
import { generateRaceInsight } from '../services/geminiService';
import { Bot, TrendingUp, Activity, ArrowLeft, Flag, MapPin, Calendar, Timer, AlertCircle, Database } from 'lucide-react';

interface Props {
  race: Race;
  onBack: () => void;
}

const RaceAnalysis: React.FC<Props> = ({ race, onBack }) => {
  const [data, setData] = useState<RaceAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AnalysisTab>(AnalysisTab.POSITIONS);
  const [isMockData, setIsMockData] = useState(false);
  
  // Gemini State
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [userQuery, setUserQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Try to fetch real data first
        if (race.id) {
             const apiData = await getRaceDetails(race.id);
             if (apiData.history.length > 0) {
                 setData({
                     race,
                     drivers: apiData.drivers,
                     history: apiData.history
                 });
                 setIsMockData(false);
             } else {
                 // Fallback if API has no laps (e.g. very recent race or future)
                 throw new Error("No API data");
             }
        }
      } catch (error) {
        console.warn("Using mock data fallback", error);
        const mock = generateRaceData(race.id);
        setData(mock);
        setIsMockData(true);
      } finally {
        setLoading(false);
        setInsight('');
        setUserQuery('');
        setActiveTab(AnalysisTab.POSITIONS);
      }
    };
    
    loadData();
  }, [race]);

  const handleAskGemini = async () => {
    if (!data) return;
    setLoadingInsight(true);
    const query = userQuery || "Summarize the key strategic moments of this race.";
    const result = await generateRaceInsight(data, query);
    setInsight(result);
    setLoadingInsight(false);
  };

  if (loading) return (
    <div className="flex h-full items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center p-8 glass-card rounded-3xl">
        <div className="w-12 h-12 border-4 border-f1-red border-t-transparent rounded-full animate-spin mb-6"></div>
        <div className="text-white font-display tracking-widest text-lg animate-pulse">ESTABLISHING DOWNLINK...</div>
        <div className="text-slate-500 text-sm mt-2">Fetching Telemetry from OpenF1</div>
      </div>
    </div>
  );

  if (!data) return null;

  return (
    <div className="animate-fadeIn pb-12 h-full flex flex-col">
      {/* Nav & Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <button 
          onClick={onBack} 
          className="group flex items-center text-slate-400 hover:text-white transition-all px-5 py-2.5 rounded-full glass-panel hover:bg-white/10 self-start sm:self-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-medium">Mission Control</span>
        </button>
        
        <div className="flex flex-wrap justify-center p-1 glass-panel rounded-full gap-1">
           {[
               { id: AnalysisTab.POSITIONS, icon: TrendingUp, label: 'Positions' },
               { id: AnalysisTab.PACE, icon: Activity, label: 'Pace' },
               { id: AnalysisTab.AI_INSIGHTS, icon: Bot, label: 'AI Strategy' }
           ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-f1-red text-white shadow-lg shadow-f1-red/30' : 'text-slate-400 hover:text-white'}`}
              >
                <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
              </button>
           ))}
        </div>
      </div>

      {/* Data Source Indicator */}
      {isMockData && (
          <div className="mb-4 flex justify-center">
            <span className="text-xs bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full flex items-center">
                <Database className="w-3 h-3 mr-2" /> Simulated Data (API Unavailable)
            </span>
          </div>
      )}

      {/* Hero Section */}
      <div className="relative h-64 lg:h-80 w-full overflow-hidden rounded-3xl glass-card mb-8 group border-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-10"></div>
        <img src={race.image || 'https://picsum.photos/1200/600'} alt={race.name} className="h-full w-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" />
        
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-10 lg:px-16">
           <div className="flex items-center text-f1-red font-bold tracking-[0.2em] text-xs mb-3 uppercase">
              <span className="w-2 h-2 bg-f1-red rounded-full mr-3 animate-pulse shadow-[0_0_10px_#e10600]"></span>
              Post-Race Analytics
           </div>
           <h1 className="text-4xl lg:text-5xl font-bold text-white font-display uppercase tracking-wider mb-6 drop-shadow-2xl">{race.name}</h1>
           
           <div className="flex flex-wrap gap-x-4 gap-y-2 text-slate-200 text-sm font-medium">
            <div className="flex items-center bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10"><MapPin className="w-4 h-4 mr-2 text-f1-red" /> {race.circuit}</div>
            <div className="flex items-center bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10"><Calendar className="w-4 h-4 mr-2 text-f1-red" /> {race.date}</div>
            <div className="flex items-center bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10"><Flag className="w-4 h-4 mr-2 text-f1-red" /> {data.history.length > 0 ? Math.max(...data.history.map(h=>h.lap)) : race.laps} Laps</div>
          </div>
        </div>
      </div>

      {/* Charts & Content */}
      <div className="flex-1 min-h-0 relative">
        {activeTab === AnalysisTab.POSITIONS && (
          <div className="animate-slideUp space-y-6">
            <PositionHistoryChart data={data} />
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-3xl flex items-start hover:bg-white/5 transition-colors">
                    <div className="p-3 bg-f1-red/10 rounded-xl mr-4">
                        <Timer className="w-6 h-6 text-f1-red" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm font-display uppercase tracking-wide">Fastest Sector</h4>
                        <div className="text-2xl font-bold mt-1">28.4s</div>
                        <p className="text-xs text-slate-400 mt-1">L. Norris (Lap 42)</p>
                    </div>
                </div>
                <div className="glass-card p-6 rounded-3xl flex items-start hover:bg-white/5 transition-colors">
                    <div className="p-3 bg-yellow-500/10 rounded-xl mr-4">
                        <Activity className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm font-display uppercase tracking-wide">Overtakes</h4>
                        <div className="text-2xl font-bold mt-1">42</div>
                        <p className="text-xs text-slate-400 mt-1">Most: Piastri (+6)</p>
                    </div>
                </div>
                <div className="glass-card p-6 rounded-3xl flex items-start hover:bg-white/5 transition-colors">
                    <div className="p-3 bg-emerald-500/10 rounded-xl mr-4">
                        <TrendingUp className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm font-display uppercase tracking-wide">Top Speed</h4>
                        <div className="text-2xl font-bold mt-1">342 km/h</div>
                        <p className="text-xs text-slate-400 mt-1">Speed Trap (Magnussen)</p>
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === AnalysisTab.PACE && (
            <div className="animate-slideUp">
              <LapPaceChart data={data} />
            </div>
        )}

        {activeTab === AnalysisTab.AI_INSIGHTS && (
          <div className="glass-card rounded-3xl p-4 sm:p-8 shadow-2xl animate-slideUp h-full flex flex-col">
            <div className="flex flex-col sm:flex-row items-center mb-6 sm:mb-8 border-b border-white/5 pb-6">
              <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl mr-0 sm:mr-5 mb-4 sm:mb-0 shadow-lg shadow-indigo-500/20">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white font-display">AI Race Engineer</h2>
                <p className="text-slate-400 text-sm mt-1">Powered by Gemini 2.5 • Analyzing {data.history.length} Lap Data Points</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 flex flex-col">
                    {insight ? (
                        <div className="flex-1 bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/5 overflow-y-auto custom-scrollbar shadow-inner min-h-[200px] lg:min-h-0">
                             <div className="prose prose-invert prose-sm max-w-none">
                                <div className="text-slate-200 leading-relaxed whitespace-pre-line font-light text-base">
                                    {insight}
                                </div>
                             </div>
                        </div>
                    ) : (
                         <div className="flex-1 bg-white/5 rounded-2xl border border-white/5 border-dashed flex flex-col items-center justify-center text-center text-slate-500 p-6 sm:p-12 min-h-[200px] lg:min-h-0">
                            <Bot className="w-12 h-12 sm:w-16 sm:h-16 mb-4 opacity-20" />
                            <p className="text-base sm:text-lg">Ready to analyze strategy, tyre degradation, and race pace.</p>
                            <p className="text-xs sm:text-sm opacity-50">Select a query below or type your own.</p>
                         </div>
                    )}
                    
                     <div className="mt-6">
                        <div className="relative group">
                            <input 
                                type="text" 
                                value={userQuery}
                                onChange={(e) => setUserQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAskGemini()}
                                placeholder="Ask about strategy..."
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl pl-4 pr-28 sm:pl-6 sm:pr-36 py-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none shadow-inner transition-all"
                            />
                            <button 
                                onClick={handleAskGemini}
                                disabled={loadingInsight}
                                className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 sm:px-6 rounded-xl font-bold transition-all disabled:opacity-50 text-sm flex items-center shadow-lg"
                            >
                                {loadingInsight ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'ANALYZE'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Suggested Prompts Sidebar */}
                <div className="w-full lg:w-80 space-y-3 lg:space-y-4 shrink-0">
                    <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 px-2">Suggested Queries</h4>
                    {[
                        "Summarize the race winner's strategy",
                        "Analyze the lap time consistency of the top 3",
                        "Did the safety car affect the outcome?",
                        "Compare the pace on Hard vs Medium tyres"
                    ].map((q, i) => (
                        <button 
                            key={i} 
                            onClick={() => setUserQuery(q)}
                            className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/50 text-sm text-slate-300 hover:text-white transition-all duration-300 group relative overflow-hidden"
                        >
                            <span className="relative z-10">{q}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                    ))}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RaceAnalysis;