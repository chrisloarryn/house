import React from 'react';
import { useStore } from '../../store/useStore';
import { SCENARIOS } from "../../config/scenarios";
import { L, M2_ACTUAL } from '../../config/constants';
import type { ScenarioKey } from '../../config/scenarios';
import type { ViewKey, VisibilityToggles } from '../../store/useStore';

function getConstructionBlocks(scenarioKey: ScenarioKey, toggles: VisibilityToggles) {
  const activeScenario = SCENARIOS[scenarioKey];
  const blocks = [];

  if (activeScenario.cubo) {
    const cuboFloorM2 = L.lote.frente * activeScenario.cubo.fondo;
    blocks.push({ label: 'Cubo frontal P1', m2: cuboFloorM2, active: toggles.cube1 });

    if (activeScenario.cubo.pisos === 2) {
      blocks.push({ label: 'Cubo frontal P2', m2: cuboFloorM2, active: toggles.cube2 });
    }
  }

  const latM2 = [activeScenario.ampLatL, activeScenario.ampLatR].reduce(
    (total, amp) => total + (amp ? amp.ancho * amp.fondo : 0),
    0,
  );
  if (latM2 > 0) {
    blocks.push({ label: 'Ampliaciones laterales', m2: latM2, active: toggles.lat });
  }

  if (activeScenario.ampBack) {
    blocks.push({
      label: 'Ampliación trasera',
      m2: L.lote.frente * (L.lote.fondoIzq - (L.antejardinMin + L.casa.fondo)),
      active: toggles.back,
    });
  }

  const patioM2 = activeScenario.cierraPatioInt
    ? L.casa.volDer.ancho * Math.max(0, L.casa.volIzq.fondo - L.casa.volDer.fondo)
    : 0;
  if (patioM2 > 0) {
    blocks.push({ label: 'Relleno patio interior', m2: patioM2, active: toggles.patio });
  }

  return blocks;
}

export function Overlay() {
  const { scenario, setScenario, view, setView, toggles, toggleVisibility, setAllToggles } = useStore();
  const constructionBlocks = getConstructionBlocks(scenario, toggles);
  const additionalM2 = constructionBlocks.reduce((total, block) => total + (block.active ? block.m2 : 0), 0);
  const inactiveM2 = constructionBlocks.reduce((total, block) => total + (!block.active ? block.m2 : 0), 0);
  const totalM2 = M2_ACTUAL + additionalM2;

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
          <p>Superficie base: {M2_ACTUAL.toFixed(2)} m²</p>
          <p>Adicional diseño: +{additionalM2.toFixed(2)} m²</p>
          {inactiveM2 > 0 && <p>Bloques quitados: -{inactiveM2.toFixed(2)} m²</p>}
          <p>Total estimado: {totalM2.toFixed(2)} m²</p>
          {constructionBlocks.length > 0 && (
            <div className="m2-breakdown">
              {constructionBlocks.map((block) => (
                <div key={block.label} className={`m2-row ${block.active ? 'active' : 'inactive'}`}>
                  <span>{block.active ? '+ ' : '- '}{block.label}</span>
                  <strong>{block.m2.toFixed(2)} m²</strong>
                </div>
              ))}
            </div>
          )}
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
            { key: 'side', label: 'Lateral' },
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
