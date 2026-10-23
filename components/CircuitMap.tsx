import React, { useState } from 'react';
import { getCircuitSpec, CircuitSpec } from '../services/circuitData';
import { Maximize2, X, Compass, Gauge, Flag, Timer, Layers } from 'lucide-react';

interface Props {
  src?: string;
  name: string;
  circuit: string;
  className?: string;
  allowZoom?: boolean;
}

const CircuitMap: React.FC<Props> = ({
  src,
  name,
  circuit,
  className = '',
  allowZoom = true
}) => {
  const [localError, setLocalError] = useState(false);
  const [masterError, setMasterError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalView, setActiveModalView] = useState<'vector' | 'official'>('vector');

  const spec: CircuitSpec | null = getCircuitSpec(circuit || name);
  const localUrl = spec?.localMapUrl;
  const masterUrl = src ? src.replace(/\.transform\/.*$/, '') : spec?.fullMapUrl;

  const currentDisplayUrl = !localError && localUrl ? localUrl : (!masterError ? masterUrl : null);
  const modalUrl = activeModalView === 'vector' && !localError && localUrl
    ? localUrl : !masterError && masterUrl ? masterUrl : !localError ? localUrl : null;

  const handleOpenModal = (e: React.MouseEvent) => {
    if (!allowZoom) return;
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className={`relative group/circuit overflow-hidden flex items-center justify-center ${className}`}>
        {currentDisplayUrl ? (
          <img
            src={currentDisplayUrl}
            alt={`${name} track map`}
            onError={() => {
              if (currentDisplayUrl === localUrl) {
                setLocalError(true);
              } else {
                setMasterError(true);
              }
            }}
            className="w-full h-full object-contain p-2 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover/circuit:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-neutral-950 p-6 overflow-hidden">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            <div className="relative z-10 mt-1 text-center font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
              {circuit} • Tracé indisponible
            </div>
          </div>
        )}

        {/* Hover Zoom Overlay Button */}
        {allowZoom && currentDisplayUrl && (
          <button
            onClick={handleOpenModal}
            className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-neutral-400 hover:text-white transition-opacity opacity-0 group-hover/circuit:opacity-100 flex items-center gap-1 text-[10px] font-mono shadow-md z-10"
            title="Inspect Ultra HD Circuit"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#e10600]" />
            <span className="hidden sm:inline">Ultra HD</span>
          </button>
        )}
      </div>

      {/* Ultra HD Circuit Lightbox Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-none animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-neutral-800 pb-5 mb-6 gap-4">
              <div>
                <div className="text-xs font-mono font-bold text-[#e10600] uppercase tracking-wider mb-1">
                  Ultra HD Telemetry Layout • Master Circuit Asset
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-white uppercase">
                  {name}
                </h2>
                <p className="text-xs font-mono text-neutral-400 mt-0.5">{circuit}</p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {/* View switcher: Vector vs Official */}
                <div className="flex bg-neutral-900 border border-neutral-800 rounded-xl p-1 text-xs font-mono">
                  <button
                    onClick={() => setActiveModalView('vector')}
                    className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                      activeModalView === 'vector'
                        ? 'bg-neutral-800 text-white font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-[#e10600]" />
                    <span>Vector Map</span>
                  </button>
                  <button
                    onClick={() => setActiveModalView('official')}
                    className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                      activeModalView === 'official'
                        ? 'bg-neutral-800 text-white font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>Official Map</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Ultra HD Circuit Rendering */}
            <div className="relative h-72 sm:h-96 w-full bg-neutral-900/40 rounded-2xl border border-neutral-800/80 p-6 flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />
              {modalUrl ? <img
                src={modalUrl}
                alt={`${name} Ultra HD`}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_24px_rgba(0,0,0,0.9)]"
              /> : <span className="relative text-sm font-mono text-neutral-400">Tracé indisponible</span>}
            </div>

            {/* Technical Circuit Specifications */}
            {spec && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-neutral-800 font-mono text-xs">
                <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase flex items-center gap-1">
                    <Flag className="w-3 h-3 text-[#e10600]" />
                    <span>Length</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1">{spec.lengthKm} km</div>
                </div>

                <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-amber-400" />
                    <span>Turns</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1">{spec.turns} Corners</div>
                </div>

                <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase flex items-center gap-1">
                    <Timer className="w-3 h-3 text-emerald-400" />
                    <span>DRS Zones</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1">{spec.drsZones} Zones</div>
                </div>

                <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase flex items-center gap-1">
                    <Compass className="w-3 h-3 text-cyan-400" />
                    <span>Direction</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1">{spec.direction}</div>
                </div>

                <div className="col-span-2 bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase">Lap Record</div>
                  <div className="text-sm font-bold text-[#e10600] mt-1">
                    {spec.lapRecord.time}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {spec.lapRecord.driver} ({spec.lapRecord.year})
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CircuitMap;
