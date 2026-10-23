import React, { useState } from 'react';

const threeToTwo: Record<string, string> = {
  AUS: 'au', AUT: 'at', AZE: 'az', BAH: 'bh', BEL: 'be', BRA: 'br', CAN: 'ca', CHN: 'cn',
  HUN: 'hu', ITA: 'it', JPN: 'jp', MEX: 'mx', MCO: 'mc', NED: 'nl', NLD: 'nl', QAT: 'qa',
  KSA: 'sa', SGP: 'sg', ESP: 'es', GBR: 'gb', UAE: 'ae', USA: 'us'
};

const locations: [RegExp, string][] = [
  [/austria|austrian|spielberg/i, 'at'],
  [/australia|australian|melbourne/i, 'au'],
  [/azerbaijan|baku/i, 'az'],
  [/bahrain|sakhir/i, 'bh'],
  [/belgium|belgian|spa.francorchamps/i, 'be'],
  [/brazil|brazilian|sao paulo|interlagos/i, 'br'],
  [/canada|canadian|montreal/i, 'ca'],
  [/china|chinese|shanghai/i, 'cn'],
  [/hungary|hungarian|budapest/i, 'hu'],
  [/italy|italian|monza|imola|emilia/i, 'it'],
  [/japan|japanese|suzuka/i, 'jp'],
  [/mexico|mexican/i, 'mx'],
  [/monaco|monte carlo/i, 'mc'],
  [/netherlands|dutch|zandvoort/i, 'nl'],
  [/qatar|lusail|losail/i, 'qa'],
  [/saudi|jeddah/i, 'sa'],
  [/singapore|marina bay/i, 'sg'],
  [/spain|spanish|barcelona|madrid/i, 'es'],
  [/great britain|british|united kingdom|silverstone/i, 'gb'],
  [/united arab emirates|abu dhabi|yas marina/i, 'ae'],
  [/united states|united states of america|usa|america|miami|austin|las vegas/i, 'us']
];

export const getFlagCode = (country?: string, countryCode?: string, raceName?: string): string | null => {
  const code = countryCode?.toUpperCase();
  if (code && threeToTwo[code]) return threeToTwo[code];
  if (code?.length === 2) return code.toLowerCase();
  const label = `${country || ''} ${raceName || ''}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return locations.find(([pattern]) => pattern.test(label))?.[1] || null;
};

interface Props {
  country?: string;
  countryCode?: string;
  raceName?: string;
  className?: string;
}

const CountryFlag: React.FC<Props> = ({ country, countryCode, raceName, className = '' }) => {
  const [failed, setFailed] = useState(false);
  const code = getFlagCode(country, countryCode, raceName);
  return <span className={`inline-flex items-center justify-center overflow-hidden rounded-[3px] border border-white/15 bg-white/5 shadow-[0_3px_8px_rgba(0,0,0,.3)] shrink-0 ${className}`}>
    {code && !failed
      ? <img src={`https://flagcdn.com/w80/${code}.png`} alt={`Drapeau ${country || raceName || code}`} loading="lazy" onError={() => setFailed(true)} className="w-full h-full object-cover" />
      : <span className="text-[9px] font-mono font-bold tracking-widest text-neutral-300">{(countryCode || code || 'GP').toUpperCase()}</span>}
  </span>;
};

export default CountryFlag;
