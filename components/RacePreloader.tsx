import React, { useEffect, useState } from 'react';
import { getCircuitSpec } from '../services/circuitData';
import type { RaceLoadPhase } from '../services/f1Api';

const racePhases: { key: RaceLoadPhase; label: string }[] = [
  { key: 'session', label: 'Identification de la séance' },
  { key: 'context', label: 'Chargement des données de course' },
  { key: 'laps', label: 'Reconstruction des tours et positions' },
  { key: 'results', label: 'Classement des séances' }
];

interface Props {
  label?: string;
  detail?: string;
  compact?: boolean;
  circuit?: string;
  raceName?: string;
  phase?: RaceLoadPhase;
}

const RacePreloader: React.FC<Props> = ({
  label = 'Synchronisation des données',
  detail = 'Connexion aux sessions OpenF1',
  compact = false,
  circuit,
  raceName,
  phase
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [circuitFailed, setCircuitFailed] = useState(false);
  const requestedCircuit = (circuit || raceName || '').trim();
  const spec = requestedCircuit ? getCircuitSpec(requestedCircuit) : null;
  const showCircuit = Boolean(spec && !circuitFailed);
  const phaseIndex = phase ? racePhases.findIndex((item) => item.key === phase) : -1;

  useEffect(() => {
    setCircuitFailed(false);
  }, [spec?.localMapUrl]);

  useEffect(() => {
    const started = Date.now();
    const interval = window.setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return <div className={`race-preloader ${compact ? 'race-preloader--compact' : ''}`} role="status" aria-live="polite">
    <div className="race-preloader__grid" aria-hidden="true" />
    <div className="race-preloader__topline">
      <span className="race-preloader__source"><i aria-hidden="true" /> OPENF1 / DATA LINK</span>
      <span className="race-preloader__mode">{spec ? 'CIRCUIT DATA' : 'SEASON DATA'}</span>
    </div>

    <div className="race-preloader__content">
      <div className="race-preloader__stage" aria-hidden="true">
        <span className="race-preloader__corner race-preloader__corner--tl" />
        <span className="race-preloader__corner race-preloader__corner--tr" />
        <span className="race-preloader__corner race-preloader__corner--bl" />
        <span className="race-preloader__corner race-preloader__corner--br" />
        {showCircuit && spec ? <>
          <img className="race-preloader__circuit race-preloader__circuit--base" src={spec.localMapUrl} alt="" onError={() => setCircuitFailed(true)} />
          <div className="race-preloader__circuit-reveal">
            <img className="race-preloader__circuit race-preloader__circuit--active" src={spec.localMapUrl} alt="" onError={() => setCircuitFailed(true)} />
          </div>
          <span className="race-preloader__scan" />
        </> : <div className="race-preloader__velocity">
          <span>V</span>
          <i /><i /><i />
        </div>}
        <span className="race-preloader__stage-label">{spec ? spec.circuit : 'VELOCITY ANALYTICS'}</span>
      </div>

      <div className="race-preloader__copy">
        <span className="race-preloader__kicker">{spec ? 'ACQUISITION / GRAND PRIX' : 'ACQUISITION / CALENDRIER'}</span>
        <h2>{label}</h2>
        <p>{detail}</p>
      </div>

      {phaseIndex >= 0 && <div className="race-preloader__phase">
        <span>{racePhases[phaseIndex].label}</span>
        <span>ÉTAPE {String(phaseIndex + 1).padStart(2, '0')} / 04</span>
      </div>}
      <div className={`race-preloader__progress ${phaseIndex >= 0 ? 'race-preloader__progress--stages' : ''}`} aria-hidden="true">
        {phaseIndex >= 0
          ? racePhases.map((item, index) => <span key={item.key} className={index < phaseIndex ? 'is-complete' : index === phaseIndex ? 'is-current' : ''} />)
          : <span />}
      </div>
      <div className="race-preloader__foot">
        <span>{elapsed >= 12 ? 'OpenF1 répond lentement · traitement en cours…' : 'Synchronisation OpenF1 en cours…'}</span>
        <time aria-hidden="true">{String(Math.floor(elapsed / 60)).padStart(2, '0')}:{String(elapsed % 60).padStart(2, '0')}</time>
      </div>
    </div>
  </div>;
};

export default RacePreloader;
