import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import { getCalendar, getRaceWinner } from '../services/f1Api';
import { Race } from '../types';
import CircuitMap from './CircuitMap';
import CountryFlag from './CountryFlag';
import RacePreloader from './RacePreloader';
import { getLocalDriverPortrait } from '../services/imageUtils';

interface Props {
  onSelectRace: (race: Race) => void;
}

const RaceCard: React.FC<{ race: Race; index: number; onSelectRace: (race: Race) => void }> = ({ race, index, onSelectRace }) => {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [winner, setWinner] = useState<Awaited<ReturnType<typeof getRaceWinner>>>(null);
  const [winnerLoaded, setWinnerLoaded] = useState(false);
  const [portraitFailed, setPortraitFailed] = useState(false);
  const [portraitFallback, setPortraitFallback] = useState<string>();

  useEffect(() => {
    if (race.status !== 'COMPLETED' || !race.sessionKey) return;
    let cancelled = false;
    const load = () => {
      void getRaceWinner(race).then((result) => {
        if (!cancelled) setWinner(result);
      }).finally(() => { if (!cancelled) setWinnerLoaded(true); });
    };
    const node = cardRef.current;
    if (!node || !('IntersectionObserver' in window)) {
      load();
      return () => { cancelled = true; };
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        load();
      }
    }, { rootMargin: '320px' });
    observer.observe(node);
    return () => { cancelled = true; observer.disconnect(); };
  }, [race]);

  const enriched = { ...race, ...winner };
  const showPortrait = Boolean((portraitFallback || winner?.winnerImage) && !portraitFailed);
  const status = race.status === 'LIVE' ? 'LIVE SESSION' : race.status === 'COMPLETED' ? 'CLASSIFIED' : 'UPCOMING';
  const date = new Date(`${race.date}T12:00:00Z`).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

  return <button
    ref={cardRef}
    type="button"
    onClick={() => onSelectRace(enriched)}
    className={`race-card group ${index === 0 ? 'race-card--featured' : ''}`}
    style={{ animationDelay: `${Math.min(index, 10) * 65}ms`, '--team-accent': winner?.winnerTeamColor || '#e10600' } as React.CSSProperties}
    aria-label={`Ouvrir l'analyse du ${race.name}`}
  >
    <div className="race-card__art">
      <div className="race-card__topline">
        <span className="race-card__round">ROUND {String(race.round || index + 1).padStart(2, '0')}</span>
        <span className={`race-card__status ${race.status === 'LIVE' ? 'race-card__status--live' : ''}`}><i />{status}</span>
      </div>
      <div className="race-card__circuit" aria-hidden="true">
        <CircuitMap src={race.image} name={race.name} circuit={race.circuit} allowZoom={false} className="w-full h-full" />
      </div>
      {showPortrait && <img
        className="race-card__portrait"
        src={portraitFallback || winner!.winnerImage}
        alt={`Portrait de ${winner!.winnerName}, vainqueur du ${race.name}`}
        loading="lazy"
        onError={() => {
          const fallback = getLocalDriverPortrait(winner?.winnerName);
          if (fallback && !portraitFallback) setPortraitFallback(fallback);
          else setPortraitFailed(true);
        }}
      />}
      <span className="race-card__watermark" aria-hidden="true">{String(race.round || index + 1).padStart(2, '0')}</span>
      <div className="race-card__location">
        <CountryFlag country={race.country} countryCode={race.countryCode} raceName={race.name} className="w-8 h-5" />
        <span>{race.country || race.circuit}</span>
      </div>
    </div>
    <div className="race-card__body">
      <div className="race-card__meta"><span><CalendarDays size={13} /> {date}</span><span><MapPin size={13} /> {race.circuit}</span></div>
      <h3>{race.name}</h3>
      <div className="race-card__bottom">
        {race.status === 'COMPLETED' ? <div className="race-card__winner">
          <span className="race-card__micro">RACE WINNER</span>
          <strong>{winner?.winnerName || (winnerLoaded ? 'Result unavailable' : 'Loading result…')}</strong>
          {winner?.winnerTeam && <span className="race-card__team">{winner.winnerTeam}</span>}
        </div> : <div className="race-card__winner"><span className="race-card__micro">RACE WEEKEND</span><strong>{race.status === 'LIVE' ? 'In progress' : 'Awaiting session'}</strong></div>}
        <span className="race-card__arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
      </div>
    </div>
  </button>;
};

const RacesView: React.FC<Props> = ({ onSelectRace }) => {
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(2026);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void getCalendar(selectedSeason).then((data) => {
      if (!cancelled) setRaces(data);
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [selectedSeason, retryCount]);

  if (loading) return <RacePreloader label="Chargement du calendrier" detail={`Sessions et circuits · saison ${selectedSeason}`} />;

  return <section className="race-index pb-12">
    <header className="race-index__header">
      <div>
        <div className="race-index__eyebrow"><span /> SEASON ARCHIVE / {selectedSeason}</div>
        <h1>Grand Prix <em>Calendar</em></h1>
        <p>Explorez les week-ends de course, leurs classements et leurs données tour par tour.</p>
      </div>
      <div className="race-index__seasons" role="group" aria-label="Choisir une saison">
        {[2026, 2025, 2024].map((year) => <button key={year} type="button" onClick={() => setSelectedSeason(year)} aria-pressed={selectedSeason === year} className={selectedSeason === year ? 'is-active' : ''}>{year}</button>)}
      </div>
    </header>
    {races.length ? <div className="race-index__grid">{races.map((race, index) => <RaceCard key={race.id} race={race} index={index} onSelectRace={onSelectRace} />)}</div>
      : <div className="race-index__empty"><p>Calendrier OpenF1 indisponible pour cette saison.</p><button type="button" onClick={() => setRetryCount((count) => count + 1)}>Réessayer</button></div>}
  </section>;
};

export default RacesView;
