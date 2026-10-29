import React from 'react';
import { Zap, Radio, Github, ExternalLink, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-14 border-t border-[#1f242c] bg-[#0b0d10] text-neutral-400">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

          {/* Left: Brand Identity & Telemetry Engine Spec */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-1">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-[#14171e] border border-[#252b36] flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-[#ff1801] fill-current" />
              </div>
              <span className="font-display font-black text-sm tracking-wider text-white uppercase">
                VELOCITY
              </span>
              <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                Analytics Engine
              </span>
            </div>
            <p className="font-mono text-xs text-neutral-400 mt-1">
              FIA Formula 1 World Championship • 2026 Season Telemetry
            </p>
            <p className="font-mono text-[11px] text-neutral-400">
              Unofficial telemetry platform powered by OpenF1 API. All racing marks belong to Formula One Licensing B.V.
            </p>
          </div>

          {/* Center: data source */}
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#12151c] border border-[#222732] shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e10600]"></span>
            </span>
            <div className="flex flex-col text-left">
              <span className="font-mono text-[10px] font-bold text-[#f4483e] uppercase tracking-widest leading-none">
                DATA SOURCE
              </span>
              <span className="font-mono text-xs text-neutral-300 font-semibold leading-tight mt-0.5">
                OpenF1 Data
              </span>
            </div>
            <div className="h-6 w-px bg-[#222732] mx-1"></div>
            <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[10px] font-bold tracking-wider">
              <Radio className="w-3.5 h-3.5 text-neutral-400" />
              <span>ON DEMAND</span>
            </div>
          </div>

          {/* Right: Engineering Signature & External Links */}
          <div className="flex flex-col items-center lg:items-end text-center lg:text-right gap-1.5 font-mono text-xs">
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-1.5">
              <span className="text-neutral-400">Engineered by</span>
              <a
                href="https://laamarti.space"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 text-white hover:text-[#ff1801] font-display font-bold tracking-wide uppercase text-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#ff1801] focus-visible:outline-offset-2 rounded"
                aria-label="Portfolio de LAAMARTI HATIM (laamarti.space)"
              >
                <span>LAAMARTI HATIM</span>
                <span className="font-mono text-[11px] font-normal lowercase tracking-normal text-neutral-400 group-hover:text-neutral-200 transition-colors">
                  (laamarti.space)
                </span>
                <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-[#ff1801] transition-colors" />
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2.5 text-neutral-400 text-[11px]">
              <span>Velocity Telemetry Engine</span>
              <span className="text-neutral-700">•</span>
              <a
                href="https://laamarti.space"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-neutral-300 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#ff1801] rounded"
                aria-label="Portfolio (laamarti.space)"
              >
                <Globe className="w-3 h-3 text-neutral-400" />
                <span>laamarti.space</span>
              </a>
              <span className="text-neutral-700">•</span>
              <a
                href="https://github.com/hatim3310"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-neutral-300 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#ff1801] rounded"
                aria-label="GitHub de LAAMARTI HATIM"
              >
                <Github className="w-3 h-3 text-neutral-400" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
