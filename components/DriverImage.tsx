import React, { useState } from 'react';
import { toUltraHdDriverUrl } from '../services/imageUtils';
import { Maximize2, X, Trophy } from 'lucide-react';

interface Props {
  src?: string;
  alt: string;
  driverNumber: string;
  teamColor?: string;
  className?: string;
  containerClassName?: string;
  style?: React.CSSProperties;
  allowZoom?: boolean;
  driverName?: string;
  teamName?: string;
}

const DriverImage: React.FC<Props> = ({
  src,
  alt,
  driverNumber,
  teamColor = '#e10600',
  className = '',
  containerClassName,
  style,
  allowZoom = false,
  driverName,
  teamName
}) => {
  const [hasError, setHasError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Upgrade image to full uncompressed Master Ultra HD URL
  const ultraHdSrc = toUltraHdDriverUrl(src);

  if (!ultraHdSrc || hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center select-none bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden ${className}`}
        style={style}
      >
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ backgroundColor: teamColor }}
        />
        <svg
          viewBox="0 0 100 100"
          className="w-2/3 h-2/3 opacity-30 fill-neutral-400 stroke-neutral-300"
        >
          <path d="M50 15 C32 15 20 28 20 45 C20 52 23 58 28 63 L28 85 L72 85 L72 63 C77 58 80 52 80 45 C80 28 68 15 50 15 Z" />
          <path d="M35 38 L68 38 C72 38 74 41 73 45 L69 52 C67 54 64 56 60 56 L38 56 C33 56 30 52 32 47 Z" fill="#000" fillOpacity="0.6" />
        </svg>
        <span
          className="absolute font-mono font-black text-2xl tracking-tighter"
          style={{ color: teamColor }}
        >
          {driverNumber}
        </span>
      </div>
    );
  }

  return (
    <>
      <div className={containerClassName || "relative group/driver-img inline-block"}>
        <img
          src={ultraHdSrc}
          alt={alt}
          onError={() => setHasError(true)}
          className={className}
          style={style}
          loading="lazy"
        />

        {allowZoom && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-neutral-400 hover:text-white transition-opacity opacity-0 group-hover/driver-img:opacity-100 flex items-center gap-1 text-[10px] font-mono shadow-lg z-20"
            title="Inspect Ultra HD Portrait"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#e10600]" />
            <span className="hidden sm:inline">Ultra HD</span>
          </button>
        )}
      </div>

      {/* Ultra HD Driver Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
              <div>
                <div className="text-[11px] font-mono font-bold text-[#e10600] uppercase tracking-wider">
                  Ultra HD Driver Master Portrait
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-0.5">
                  {driverName || alt}
                </h3>
                {teamName && (
                  <p className="text-xs font-mono text-neutral-400">{teamName}</p>
                )}
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-80 sm:h-96 flex items-center justify-center bg-neutral-900 rounded-2xl border border-neutral-800 p-4 overflow-hidden">
              <img
                src={ultraHdSrc}
                alt={alt}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
              />
            </div>

            <div className="w-full mt-4 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Race Number: #{driverNumber}</span>
              <span className="text-neutral-500">Uncompressed Studio PNG</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DriverImage;
