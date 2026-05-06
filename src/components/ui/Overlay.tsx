import React from 'react';
import { useStore } from '../../store/useStore';
import { SCENARIOS } from "../../config/scenarios";
import type { ScenarioKey } from '../../config/scenarios';
import type { ViewKey } from '../../store/useStore';

export function Overlay() {
  const { scenario, setScenario, view, setView, toggles, toggleVisibility, setAllToggles } = useStore();

  const toggleConfig = [
    { key: 'terrain', label: 'Terreno y Lote' },
    { key: 'perimeter', label: 'Muros perimetrales' },
    { key: 'neighbors', label: 'Vecinos' },
    { key: 'existing', label: 'Casa existente' },
    { key: 'roof', label: 'Techo principal' },
    { key: 'cube1', label: 'Cubo frontal (Piso 1)' },
    { key: 'cube2', label: 'Cubo frontal (Piso 2)' },
    { key: 'back', label: 'Ampliación trasera' },
    { key: 'lat', label: 'Ampliación lateral' },
    { key: 'patio', label: 'Relleno patio int.' },
    { key: 'pergola', label: 'Pérgola' },
    { key: 'fence', label: 'Reja principal' },
  ];

  return (
    <div className="ui-overlay">
      <div className="header">
        <div className="title-card">
          <h1>Casa Laurel — Masterplan</h1>
          <p>Superficie base: 103.77 m²</p>
        </div>

        <div className="scenario-tabs">
          {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
            <button
              key={key}
              className={`tab-btn ${scenario === key ? 'active' : ''}`}
              onClick={() => setScenario(key)}
            >
              {SCENARIOS[key].name}
            </button>
          ))}
        </div>
      </div>

      <div className="bottom-area">
        <div className="controls-panel">
          <div className="controls-header">
            <span>Visibilidad</span>
            <button className="toggle-all-btn" onClick={() => {
              const allOn = Object.values(toggles).every(v => v);
              setAllToggles(!allOn);
            }}>
              {Object.values(toggles).every(v => v) ? 'Ocultar todo' : 'Mostrar todo'}
            </button>
          </div>
          
          {toggleConfig.map(({ key, label }) => (
            <label key={key} className="toggle-row">
              <input
                type="checkbox"
                checked={toggles[key as keyof typeof toggles]}
                onChange={() => toggleVisibility(key as keyof typeof toggles)}
              />
              {label}
            </label>
          ))}
        </div>

        <div className="view-buttons">
          {[
            { key: 'front', label: 'Frontal' },
            { key: 'iso', label: 'Isométrica' },
            { key: 'top', label: 'Planta' },
            { key: 'back', label: 'Patio' },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`view-btn ${view === key ? 'active' : ''}`}
              onClick={() => setView(key as ViewKey)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="hint">Arrastrar: rotar · Rueda: zoom · Click derecho: pan</div>
    </div>
  );
}
