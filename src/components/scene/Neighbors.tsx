import React from 'react';
import { ExistingHouse } from './ExistingHouse';
import { Roof } from './Roof';
import { Perimeter } from './Perimeter';
import { Fence } from './Fence';
import { L } from '../../config/constants';
import type { Palette } from '../../config/palettes';

function Box({ position, args, color }: { position: [number, number, number], args: [number, number, number], color: number }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

function NeighborPanderetas() {
  const h = 2.0;
  const t = 0.15;
  const w = L.lote.frente;
  const d = L.lote.fondoDer;

  return (
    <group>
      <Box position={[t / 2, h / 2, d / 2]} args={[t, h, d]} color={0xa8a098} />
      <Box position={[w - t / 2, h / 2, d / 2]} args={[t, h, d]} color={0xa8a098} />
      <Box position={[w / 2, h / 2, d - t / 2]} args={[w, h, t]} color={0xa8a098} />
    </group>
  );
}

export function Neighbors({ palette }: { palette: Palette }) {
  const f = L.lote.frente;
  const sideSetbackFromMyLot = 2.6;
  const sideNeighborPegadoX = L.lote.frente + L.lote.fondoDer;
  const sideNeighborSetbackX = sideNeighborPegadoX + sideSetbackFromMyLot;
  const sideNeighborZ = L.lote.fondoDer / 2 - L.lote.frente / 2;
  const sideNeighborStep = L.lote.frente;

  return (
    <group>
      <group position={[-f, 0, 0]}>
        <ExistingHouse palette={palette} isActual={true} />
        <Roof palette={palette} isActual={true} />
        <NeighborPanderetas />
        <Fence />
      </group>
      {Array.from({ length: 3 }, (_, i) => (
        <group
          key={`side-neighbor-${i}`}
          position={[i === 0 ? sideNeighborPegadoX : sideNeighborSetbackX, 0, sideNeighborZ - i * sideNeighborStep]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <NeighborPanderetas />
          <ExistingHouse palette={palette} isActual={true} />
          <Roof palette={palette} isActual={true} />
        </group>
      ))}
    </group>
  );
}
