import React, { useMemo } from 'react';
import * as THREE from 'three';
import { L, PLAN3D, cx, cz } from '../../config/constants';
import type { Palette } from '../../config/palettes';

function Plano({ verts, color }: { verts: number[], color: number }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
    g.computeVertexNormals();
    return g;
  }, [verts]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.9} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Box({
  position,
  args,
  color,
  rotationZ = 0,
}: {
  position: [number, number, number];
  args: [number, number, number];
  color: number;
  rotationZ?: number;
}) {
  return (
    <mesh position={position} rotation={[0, 0, rotationZ]} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

function SlopedTrim({
  start,
  end,
  color,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: number;
}) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const length = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);

  return (
    <Box
      position={[(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, start[2]]}
      args={[length, 0.12, 0.1]}
      color={color}
      rotationZ={angle}
    />
  );
}

export function Roof({ palette }: { palette: Palette; isActual: boolean }) {
  const yBase = L.casa.alto1 + L.casa.alto2;
  const upperSmallX0 = cx + PLAN3D.upperFloor.leftSmall.x;
  const upperMainX0 = cx + PLAN3D.upperFloor.rightMain.x;
  const upperMainX1 = upperMainX0 + PLAN3D.upperFloor.rightMain.ancho;
  const upperSmallFrontZ = cz + PLAN3D.upperFloor.leftSmall.zFront;
  const upperSmallDepth = PLAN3D.upperFloor.leftSmall.fondo;
  const upperMainFrontZ = cz + PLAN3D.upperFloor.rightMain.zFront;
  const upperMainDepth = PLAN3D.upperFloor.rightMain.fondo;

  const roofColor = palette.techo;
  const trimColor = palette.zocalo || 0xd4c8b2;
  const sidingColor = palette.siding2;

  return (
    <group>
      {/* Frontón izquierdo del plano: menor, adelantado y sin ventana frontal */}
      <GableFrontal 
        x0={upperSmallX0 - 0.18} 
        x1={cx + L.casa.ancho + 0.28} 
        zFace={upperSmallFrontZ - 0.06} 
        fondo={upperSmallDepth + 0.34} 
        alt={PLAN3D.upperFloor.leftSmall.roofAlt} 
        yBase={yBase} 
        siding={sidingColor} 
        roof={roofColor} 
        trim={trimColor}
      />
      <EaveTrim
        x0={upperSmallX0 - 0.24}
        x1={cx + L.casa.ancho + 0.34}
        zFront={upperSmallFrontZ - 0.12}
        zBack={upperSmallFrontZ + upperSmallDepth + 0.24}
        y={yBase - 0.08}
        color={trimColor}
      />

      {/* Frontón derecho del plano: principal, retrasado, profundo y con ventana */}
      <GableFrontal 
        x0={upperMainX0 - 0.42} 
        x1={upperMainX1 + 0.45} 
        zFace={upperMainFrontZ - 0.62} 
        fondo={upperMainDepth + 0.74} 
        alt={PLAN3D.upperFloor.rightMain.roofAlt} 
        yBase={yBase} 
        siding={sidingColor} 
        roof={roofColor} 
        trim={trimColor}
      />
      <EaveTrim
        x0={upperMainX0 - 0.48}
        x1={upperMainX1 + 0.52}
        zFront={upperMainFrontZ - 0.72}
        zBack={upperMainFrontZ + upperMainDepth + 0.34}
        y={yBase - 0.08}
        color={trimColor}
      />

      {/* Canaletas/bajadas negras visibles en la unión de los dos frontones */}
      <Box position={[upperSmallX0 - 0.08, yBase - 0.16, upperMainFrontZ - 0.14]} args={[0.12, 0.12, 0.55]} color={0x1d1d1d} />
      <Box position={[upperSmallX0 - 0.08, yBase / 2 + 0.28, upperMainFrontZ + 0.06]} args={[0.07, yBase - 0.55, 0.07]} color={0x1d1d1d} />
      <Box position={[cx - 0.18, yBase / 2 + 0.2, cz + 0.08]} args={[0.055, yBase - 0.65, 0.055]} color={0x1d1d1d} />
      <Box position={[cx + L.casa.ancho + 0.18, yBase / 2 + 0.2, upperMainFrontZ + 0.08]} args={[0.055, yBase - 0.65, 0.055]} color={0x1d1d1d} />
    </group>
  );
}

function EaveTrim({
  x0,
  x1,
  zFront,
  zBack,
  y,
  color,
}: {
  x0: number;
  x1: number;
  zFront: number;
  zBack: number;
  y: number;
  color: number;
}) {
  return (
    <group>
      <Box position={[(x0 + x1) / 2, y, zFront]} args={[x1 - x0, 0.16, 0.12]} color={color} />
      <Box position={[(x0 + x1) / 2, y - 0.1, zFront + 0.08]} args={[x1 - x0 - 0.18, 0.08, 0.36]} color={0x3a352e} />
      <Box position={[x0, y, (zFront + zBack) / 2]} args={[0.12, 0.16, zBack - zFront]} color={color} />
      <Box position={[x1, y, (zFront + zBack) / 2]} args={[0.12, 0.16, zBack - zFront]} color={color} />
    </group>
  );
}

interface GableFrontalProps {
  x0: number;
  x1: number;
  zFace: number;
  fondo: number;
  alt: number;
  yBase: number;
  siding: number;
  roof: number;
  trim: number;
}

function GableFrontal({ x0, x1, zFace, fondo, alt, yBase, siding, roof, trim }: GableFrontalProps) {
  const xMid = (x0 + x1) / 2;
  const yTip = yBase + alt;
  const zRidge = zFace + fondo;
  const sidingLines = Array.from({ length: Math.max(2, Math.floor(alt / 0.18)) }, (_, i) => yBase + 0.18 + i * 0.18);

  return (
    <group>
      {/* Triángulo frontal (Siding) */}
      <Plano 
        color={siding}
        verts={[
          x0, yBase, zFace,
          x1, yBase, zFace,
          xMid, yTip, zFace
        ]}
      />
      {sidingLines.map((lineY) => {
        const t = (lineY - yBase) / alt;
        const halfWidth = ((x1 - x0) / 2) * (1 - t);
        return (
          <Box
            key={lineY}
            position={[xMid, lineY, zFace - 0.035]}
            args={[Math.max(0.2, halfWidth * 2), 0.022, 0.035]}
            color={0x6f6a58}
          />
        );
      })}
      <Box position={[xMid, yBase - 0.04, zFace - 0.08]} args={[x1 - x0 + 0.28, 0.12, 0.12]} color={trim} />
      <SlopedTrim start={[x0 - 0.08, yBase + 0.02, zFace - 0.12]} end={[xMid, yTip + 0.04, zFace - 0.12]} color={trim} />
      <SlopedTrim start={[xMid, yTip + 0.04, zFace - 0.12]} end={[x1 + 0.08, yBase + 0.02, zFace - 0.12]} color={trim} />
      <Box position={[xMid, yBase - 0.16, zFace - 0.18]} args={[x1 - x0 + 0.42, 0.07, 0.08]} color={0x171717} />
      {/* Techo gable izquierdo */}
      <Plano 
        color={roof}
        verts={[
          x0 - 0.1, yBase - 0.05, zFace - 0.1,
          xMid, yTip + 0.05, zFace - 0.1,
          xMid, yTip + 0.05, zRidge,

          x0 - 0.1, yBase - 0.05, zFace - 0.1,
          xMid, yTip + 0.05, zRidge,
          x0 - 0.1, yBase - 0.05, zRidge
        ]}
      />
      {/* Techo gable derecho */}
      <Plano 
        color={roof}
        verts={[
          xMid, yTip + 0.05, zFace - 0.1,
          x1 + 0.1, yBase - 0.05, zFace - 0.1,
          x1 + 0.1, yBase - 0.05, zRidge,

          xMid, yTip + 0.05, zFace - 0.1,
          x1 + 0.1, yBase - 0.05, zRidge,
          xMid, yTip + 0.05, zRidge
        ]}
      />
    </group>
  );
}
