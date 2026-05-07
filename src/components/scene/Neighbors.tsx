import React from 'react';
import { ExistingHouse } from './ExistingHouse';
import { Roof } from './Roof';
import { Perimeter } from './Perimeter';
import { Fence } from './Fence';
import { L } from '../../config/constants';
import type { Palette } from '../../config/palettes';

// Reusing ExistingHouse, Roof, and now Perimeter for neighbor houses
export function Neighbors({ palette }: { palette: Palette }) {
  const f = L.lote.frente;

  return (
    <group>
      <group position={[-f, 0, 0]}>
        <ExistingHouse palette={palette} isActual={true} />
        <Roof palette={palette} isActual={true} />
        <Perimeter />
        <Fence />
      </group>
      <group position={[f, 0, 0]}>
        <ExistingHouse palette={palette} isActual={true} />
        <Roof palette={palette} isActual={true} />
        <Perimeter />
        <Fence />
      </group>
    </group>
  );
}
