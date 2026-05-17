import type { PaletteKey } from './palettes';

export type ScenarioKey = 'actual' | 'ampliacion' | 'idea' | 'medA' | 'medB';

export interface Ampliacion {
  ancho: number;
  alto: number;
  fondo: number;
  pisos?: number;
}

export interface Scenario {
  name: string;
  paleta: PaletteKey;
  cubo: Ampliacion | null;
  ampLatL: Ampliacion | null;
  ampLatR: Ampliacion | null;
  ampBack: Ampliacion | null;
  cierraPatioInt: boolean;
  pergola: boolean;
  fence: boolean;
}

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  actual: {
    name: 'Plano oficial',
    paleta: 'actual',
    cubo: null,
    ampLatL: null,
    ampLatR: null,
    ampBack: null,
    cierraPatioInt: false,
    pergola: false,
    fence: true,
  },
  ampliacion: {
    name: 'Ampliación',
    paleta: 'actual',
    cubo: null,
    ampLatL: { ancho: 2.07, alto: 2.7, fondo: 9.73 },
    ampLatR: null,
    ampBack: null,
    cierraPatioInt: false,
    pergola: false,
    fence: true,
  },
  idea: {
    name: 'Referencia gris',
    paleta: 'idea',
    cubo: { ancho: 7.82, alto: 2.7, fondo: 3.6, pisos: 1 }, // solo primer piso visible por defecto
    ampLatL: { ancho: 0.76, alto: 2.7, fondo: 9.73 },
    ampLatR: { ancho: 0.76, alto: 2.7, fondo: 9.73 },
    ampBack: { ancho: 6.30, alto: 2.7, fondo: 3.5 },
    cierraPatioInt: true,
    pergola: false,
    fence: true,
   },
   medA: {
     name: 'DFL2 conservado',
     paleta: 'med',
     cubo: { ancho: 7.82, alto: 2.7, fondo: 3.6, pisos: 1 },
     ampLatL: null,
     ampLatR: null,
     ampBack: { ancho: 6.30, alto: 2.7, fondo: 1.28 },
     cierraPatioInt: false,
     pergola: false,
     fence: true,
   },
   medB: {
    name: 'Ampliación máxima',
    paleta: 'med',
    cubo: { ancho: 7.82, alto: 2.7, fondo: 3.6, pisos: 2 },
    ampLatL: { ancho: 0.76, alto: 2.7, fondo: 9.73 },
    ampLatR: { ancho: 0.76, alto: 2.7, fondo: 9.73 },
    ampBack: { ancho: 6.30, alto: 2.7, fondo: 3.5 },
    cierraPatioInt: false,
    pergola: false,
    fence: true,
  }
};
