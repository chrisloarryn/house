import React from 'react';
import { L, cx, cz } from '../../config/constants';
import type { VisibilityToggles } from '../../store/useStore';

function Slab({ position, args, color }: { position: [number, number, number], args: [number, number, number], color: number }) {
  return (
    <mesh position={position} receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.82} />
    </mesh>
  );
}

function Edge({ position, args }: { position: [number, number, number], args: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={0x5f5b54} roughness={0.9} />
    </mesh>
  );
}

function RadierPart({ x, z, width, depth, color }: { x: number, z: number, width: number, depth: number, color: number }) {
  const y = 0.035;
  const h = 0.055;

  return (
    <group>
      <Slab position={[x + width / 2, y, z + depth / 2]} args={[width, h, depth]} color={color} />
      <Edge position={[x + width / 2, y + 0.035, z]} args={[width, 0.018, 0.035]} />
      <Edge position={[x + width / 2, y + 0.035, z + depth]} args={[width, 0.018, 0.035]} />
      <Edge position={[x, y + 0.035, z + depth / 2]} args={[0.035, 0.018, depth]} />
      <Edge position={[x + width, y + 0.035, z + depth / 2]} args={[0.035, 0.018, depth]} />
    </group>
  );
}

export function Radier({ toggles }: { toggles: VisibilityToggles }) {
  const rearStartZ = cz + L.casa.fondo;
  const rearDepth = Math.max(0, L.lote.fondoIzq - rearStartZ - 0.2);
  const visualRightWidth = cx;

  return (
    <group>
      {toggles.radierFront && (
        <RadierPart
          x={0.18}
          z={0.18}
          width={L.lote.frente - 0.36}
          depth={cz - 0.28}
          color={0xb8b5ad}
        />
      )}

      {toggles.radierRight && (
        <RadierPart
          x={0.12}
          z={cz}
          width={visualRightWidth - 0.18}
          depth={L.casa.fondo}
          color={0xaaa79f}
        />
      )}

      {toggles.radierBack && (
        <RadierPart
          x={cx}
          z={rearStartZ}
          width={L.casa.ancho}
          depth={rearDepth}
          color={0xc0bcb4}
        />
      )}
    </group>
  );
}
