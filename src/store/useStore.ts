import { create } from 'zustand';
import type { ScenarioKey } from '../config/scenarios';

export interface VisibilityToggles {
  terrain: boolean;
  perimeter: boolean;
  neighbors: boolean;
  existing: boolean;
  roof: boolean;
  cube1: boolean;
  cube2: boolean;
  back: boolean;
  latL: boolean;
  latR: boolean;
  patio: boolean;
  pergola: boolean;
  fence: boolean;
}

export type ViewKey = 'iso' | 'front' | 'side' | 'top' | 'back';

interface AppState {
  scenario: ScenarioKey;
  view: ViewKey;
  toggles: VisibilityToggles;
  
  setScenario: (scenario: ScenarioKey) => void;
  setView: (view: ViewKey) => void;
  toggleVisibility: (key: keyof VisibilityToggles) => void;
  setAllToggles: (state: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  scenario: 'actual',
  view: 'iso',
  toggles: {
    terrain: true,
    perimeter: true,
    neighbors: true,
    existing: true,
    roof: true,
    cube1: true,
    cube2: false,
    back: true,
    latL: true,
    latR: true,
    patio: true,
    pergola: true,
    fence: true,
  },
  
  setScenario: (scenario) => set({ scenario }),
  setView: (view) => set({ view }),
  toggleVisibility: (key) => set((state) => ({
    toggles: { ...state.toggles, [key]: !state.toggles[key] }
  })),
  setAllToggles: (isVisible) => set((state) => {
    const newToggles = { ...state.toggles };
    (Object.keys(newToggles) as (keyof VisibilityToggles)[]).forEach(k => {
      newToggles[k] = isVisible;
    });
    return { toggles: newToggles };
  })
}));
