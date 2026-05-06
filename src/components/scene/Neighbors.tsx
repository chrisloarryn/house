import React from 'react';
import { ExistingHouse } from './ExistingHouse';
import { Roof } from './Roof';
import { L } from '../../config/constants';
import type { Palette } from '../../config/palettes';

// Reusing ExistingHouse and Roof, just translated
export function Neighbors({ palette }: { palette: Palette }) {
  const f = L.lote.frente;

  return (
    <group>
      <group position={[-f, 0, 0]}>
        <ExistingHouse palette={palette} isActual={true} />
        <Roof palette={palette} isActual={true} />
      </group>
      <group position={[f, 0, 0]}>
        <ExistingHouse palette={palette} isActual={true} />
        <Roof palette={palette} isActual={true} />
      </group>
    </group>
  );
}
