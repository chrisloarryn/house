import React from 'react';
import {
  Calculator,
  Eye,
  EyeOff,
  FileText,
  Layers3,
  MousePointer2,
  Ruler,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SCENARIOS } from '../../config/scenarios';
import {
  M2_ACTUAL,
  M2_PRIMER_PISO,
  M2_SEGUNDO_PISO,
  PLAN_FACTS,
  TOPE_DFL2,
} from '../../config/constants';
import type { ScenarioKey } from '../../config/scenarios';
import type { ViewKey, VisibilityToggles } from '../../store/useStore';

const plantaP1 = new URL('../../../images/espacios/plano_secciones/01_planta_piso1.png', import.meta.url).href;
const plantaP2 = new URL('../../../images/espacios/plano_secciones/02_planta_piso2.png', import.meta.url).href;

const SCENARIO_TABS: ScenarioKey[] = ['actual', 'medA', 'medB'];

const FLOOR_PROGRAM = [
  {
    label: 'Primer piso',
    area: M2_PRIMER_PISO,
    rooms: ['estar', 'comedor', 'cocina', 'baño visita', 'despensa', 'dormitorio 4'],
  },
  {
    label: 'Segundo piso',
    area: M2_SEGUNDO_PISO,
    rooms: ['dormitorio 1', 'dormitorio 2', 'dormitorio 3', 'dos baños', 'escritorio estar'],
  },
];

const VIEW_OPTIONS: Array<{ key: ViewKey; label: string }> = [
  { key: 'front', label: 'Frente' },
  { key: 'side', label: 'Lateral' },
  { key: 'iso', label: 'Iso' },
  { key: 'top', label: 'Planta' },
  { key: 'back', label: 'Patio' },
];

function getConstructionBlocks(scenarioKey: ScenarioKey, toggles: VisibilityToggles) {
  const activeScenario = SCENARIOS[scenarioKey];
  const blocks = [];

  if (activeScenario.cubo) {
    const cuboFloorM2 = activeScenario.cubo.ancho * activeScenario.cubo.fondo;
    blocks.push({ label: 'Cubo frontal P1', m2: cuboFloorM2, active: toggles.cube1 });

    if (activeScenario.cubo.pisos === 2) {
      blocks.push({ label: 'Cubo frontal P2', m2: cuboFloorM2, active: toggles.cube2 });
    }
  }

  if (activeScenario.ampLatL) {
    blocks.push({
      label: 'Ampliación lateral izq.',
      m2: activeScenario.ampLatL.ancho * activeScenario.ampLatL.fondo,
      active: toggles.latL,
    });
  }

  if (activeScenario.ampLatR) {
    blocks.push({
      label: 'Ampliación lateral der.',
      m2: activeScenario.ampLatR.ancho * activeScenario.ampLatR.fondo,
      active: toggles.latR,
    });
  }

  if (activeScenario.ampBack) {
    blocks.push({
      label: activeScenario.ampBack.fondo > 2 ? 'Living + logia posterior' : 'Estirón posterior DFL2',
      m2: activeScenario.ampBack.ancho * activeScenario.ampBack.fondo,
      active: toggles.back,
    });
  }

  return blocks;
}

export function Overlay() {
  const { scenario, setScenario, view, setView, toggles, toggleVisibility, setAllToggles } = useStore();
  const [pricePerM2, setPricePerM2] = React.useState('');
  const constructionBlocks = getConstructionBlocks(scenario, toggles);
  const additionalM2 = constructionBlocks.reduce((total, block) => total + (block.active ? block.m2 : 0), 0);
  const inactiveM2 = constructionBlocks.reduce((total, block) => total + (!block.active ? block.m2 : 0), 0);
  const totalM2 = M2_ACTUAL + additionalM2;
  const dflRemaining = TOPE_DFL2 - totalM2;
  const dflProgress = Math.min(100, (totalM2 / TOPE_DFL2) * 100);
  const dflStatus = dflRemaining >= 0 ? `${dflRemaining.toFixed(1)} m² libres` : `${Math.abs(dflRemaining).toFixed(1)} m² sobre`;
  const priceNumber = Number(pricePerM2.replace(/[^0-9.]/g, ''));
  const totalPrice = Number.isFinite(priceNumber) && priceNumber > 0 ? additionalM2 * priceNumber : 0;
  const allVisible = Object.values(toggles).every(Boolean);
  const moneyFormatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  });

  const toggleConfig: Array<{ key: keyof VisibilityToggles; label: string }> = [
    { key: 'terrain', label: 'Terreno' },
    { key: 'perimeter', label: 'Muros' },
    { key: 'neighbors', label: 'Vecinos' },
    { key: 'existing', label: 'Casa oficial' },
    { key: 'roof', label: 'Techo dos aguas' },
    { key: 'cube1', label: 'Cubo P1' },
    { key: 'cube2', label: 'Cubo P2' },
    { key: 'back', label: 'Posterior' },
    { key: 'latL', label: 'Lateral izq.' },
    { key: 'latR', label: 'Lateral der.' },
    { key: 'patio', label: 'Patio interior' },
    { key: 'pergola', label: 'Pérgola' },
    { key: 'fence', label: 'Reja' },
  ];

  return (
    <div className="ui-overlay">
      <header className="top-shell">
        <section className="project-panel">
          <div className="eyebrow">
            <FileText size={14} aria-hidden />
            Plano municipal · {PLAN_FACTS.escalaPlantas}
          </div>
          <h1>Casa Laurel</h1>
          <p>
            {PLAN_FACTS.proyecto}, {PLAN_FACTS.conjunto}. La lectura parte del plano oficial y compara la casa actual con dos ampliaciones.
          </p>

          <div className="metrics-grid" aria-label="Metricas del plano oficial">
            <div>
              <span>Total actual</span>
              <strong>{M2_ACTUAL.toFixed(2)} m²</strong>
            </div>
            <div>
              <span>Primer piso</span>
              <strong>{M2_PRIMER_PISO.toFixed(2)} m²</strong>
            </div>
            <div>
              <span>Segundo piso</span>
              <strong>{M2_SEGUNDO_PISO.toFixed(2)} m²</strong>
            </div>
            <div>
              <span>Antejardín</span>
              <strong>{PLAN_FACTS.antejardinMin.toFixed(1)} m</strong>
            </div>
          </div>
        </section>

        <aside className="decision-panel" aria-label="Comparador de escenarios">
          <div className="scenario-tabs">
            {SCENARIO_TABS.map((key) => (
              <button
                key={key}
                className={`tab-btn ${scenario === key ? 'active' : ''}`}
                onClick={() => setScenario(key)}
              >
                {SCENARIOS[key].name}
              </button>
            ))}
          </div>

          <div className="dfl-card">
            <div>
              <span className="panel-label">Superficie proyectada</span>
              <strong>{totalM2.toFixed(1)} m²</strong>
            </div>
            <div className={`dfl-badge ${dflRemaining >= 0 ? 'ok' : 'over'}`}>{dflStatus}</div>
            <div className="meter" aria-label={`Avance DFL2 ${dflProgress.toFixed(0)}%`}>
              <span style={{ width: `${dflProgress}%` }} />
            </div>
            {inactiveM2 > 0 && <small>{inactiveM2.toFixed(1)} m² ocultos por capas apagadas.</small>}
          </div>
        </aside>
      </header>

      <aside className="plan-panel">
        <div className="panel-heading">
          <Ruler size={16} aria-hidden />
          <span>Programa del plano</span>
        </div>

        <div className="plan-thumbs">
          <figure>
            <img src={plantaP1} alt="Planta arquitectura primer piso" />
            <figcaption>Piso 1</figcaption>
          </figure>
          <figure>
            <img src={plantaP2} alt="Planta arquitectura segundo piso" />
            <figcaption>Piso 2</figcaption>
          </figure>
        </div>

        <div className="floor-program">
          {FLOOR_PROGRAM.map((floor) => (
            <div key={floor.label} className="floor-row">
              <div>
                <span>{floor.label}</span>
                <strong>{floor.area.toFixed(2)} m²</strong>
              </div>
              <p>{floor.rooms.join(' · ')}</p>
            </div>
          ))}
        </div>

        <div className="price-estimator">
          <label htmlFor="price-per-m2">
            <Calculator size={14} aria-hidden />
            Valor por m²
          </label>
          <input
            id="price-per-m2"
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="$ / m²"
            value={pricePerM2}
            onChange={(event) => setPricePerM2(event.target.value)}
          />
          <div className="price-total">
            <span>Total ampliación</span>
            <strong>{totalPrice > 0 ? moneyFormatter.format(totalPrice) : 'Pendiente'}</strong>
          </div>
        </div>
      </aside>

      <footer className="bottom-area">
        <section className="controls-panel">
          <div className="controls-header">
            <span>
              <Layers3 size={15} aria-hidden />
              Capas 3D
            </span>
            <button
              className="toggle-all-btn"
              onClick={() => {
                setAllToggles(!allVisible);
              }}
            >
              {allVisible ? <EyeOff size={14} aria-hidden /> : <Eye size={14} aria-hidden />}
              {allVisible ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          <div className="toggle-grid">
            {toggleConfig.map(({ key, label }) => (
              <label key={key} className={`toggle-row ${toggles[key] ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={toggles[key]}
                  onChange={() => toggleVisibility(key)}
                />
                <span aria-hidden />
                {label}
              </label>
            ))}
          </div>
        </section>

        <nav className="view-buttons" aria-label="Vistas de camara">
          {VIEW_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              className={`view-btn ${view === key ? 'active' : ''}`}
              onClick={() => setView(key)}
            >
              {label}
            </button>
          ))}
        </nav>
      </footer>

      <div className="hint">
        <MousePointer2 size={14} aria-hidden />
        Arrastrar para rotar · pellizcar para zoom · dos dedos para pan
      </div>
    </div>
  );
}
