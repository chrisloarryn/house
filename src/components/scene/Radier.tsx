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

function EmptyRadierPart({ x, z, width, depth }: { x: number, z: number, width: number, depth: number }) {
  const y = 0.018;

  return (
    <mesh position={[x + width / 2, y, z + depth / 2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, depth]} />
      <meshBasicMaterial color={0xf8f8f2} />
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
  const frontX = 0.18;
  const frontZ = 0.18;
  const frontDepth = cz - 0.28;
  const frontGap = 0.04;
  const frontASplitX = cx;
  const frontBSplitX = L.lote.frente - 2.35;
  const frontAWidth = frontASplitX - frontX;
  const frontBWidth = frontBSplitX - frontASplitX - frontGap;
  const frontCWidth = L.lote.frente - 0.36 - frontAWidth - frontBWidth - frontGap * 2;

  return (
    <group>
      {toggles.radierFrontA && (
        <RadierPart
          x={frontX + frontAWidth + frontBWidth + frontGap * 2}
          z={frontZ}
          width={frontCWidth}
          depth={frontDepth}
          color={0x99968f}
        />
      )}
      {!toggles.radierFrontA && (
        <EmptyRadierPart
          x={frontX + frontAWidth + frontBWidth + frontGap * 2}
          z={frontZ}
          width={frontCWidth}
          depth={frontDepth}
        />
      )}

      {toggles.radierFrontB && (
        <RadierPart
          x={frontX + frontAWidth + frontGap}
          z={frontZ}
          width={frontBWidth}
          depth={frontDepth}
          color={0xa7a49d}
        />
      )}
      {!toggles.radierFrontB && (
        <EmptyRadierPart
          x={frontX + frontAWidth + frontGap}
          z={frontZ}
          width={frontBWidth}
          depth={frontDepth}
        />
      )}

      {toggles.radierFrontC && (
        <RadierPart
          x={frontX}
          z={frontZ}
          width={frontAWidth}
          depth={frontDepth}
          color={0xb8b5ad}
        />
      )}
      {!toggles.radierFrontC && (
        <EmptyRadierPart
          x={frontX}
          z={frontZ}
          width={frontAWidth}
          depth={frontDepth}
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
