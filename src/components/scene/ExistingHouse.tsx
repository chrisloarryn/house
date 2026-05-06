import React from 'react';
import { L, cx, cz } from '../../config/constants';
import type { Palette } from '../../config/palettes';

function Box({ position, args, color }: { position: [number, number, number], args: [number, number, number], color: number }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

export function ExistingHouse({ palette, isActual }: { palette: Palette; isActual: boolean }) {
  const w = L.casa.ancho;
  const f = L.casa.fondo;
  const a1 = L.casa.alto1;
  const a2 = L.casa.alto2;

  // Centro geométrico de la casa base relativa al lote
  const x = cx + w / 2;
  const z = cz + f / 2;

  return (
    <group>
      {/* Piso 1 */}
      <Box position={[x, a1 / 2, z]} args={[w, a1, f]} color={palette.estuco1} />
      
      {/* Piso 2 */}
      <Box position={[x, a1 + a2 / 2, z]} args={[w, a2, f]} color={palette.siding2} />

      {/* Zócalo */}
      <Box position={[x, 0.19, cz - 0.045]} args={[w + 0.03, 0.38, 0.08]} color={0xd8d0be} />

      {/* Banda divisoria pisos */}
      <Box 
        position={[x, a1 + 0.04, z]} 
        args={[w + 0.05, 0.08, f + 0.05]} 
        color={isActual ? 0xa89880 : (palette.marco || 0x808080)} 
      />

      {/* Ventanas Piso 1 */}
      <Window position={[cx + 1.90, a1 / 2, cz - 0.005]} args={[1.5, 1.4]} palette={palette} />
      <Window position={[cx + 4.90, a1 / 2, cz - 0.005]} args={[1.5, 1.4]} palette={palette} />

      {/* Ventanas Piso 2 */}
      <Window position={[cx + 1.90, a1 + a2 / 2 - 0.1, cz - 0.005]} args={[1.2, 1.2]} palette={palette} />
      <Window position={[cx + 4.90, a1 + a2 / 2 - 0.1, cz - 0.005]} args={[1.2, 1.2]} palette={palette} />

      {/* Puerta principal (lateral izquierda) */}
      <Box position={[cx - 0.01, a1 / 2 - 0.1, cz + 2.0]} args={[0.04, 2.0, 0.9]} color={0x4a3a2a} />
    </group>
  );
}

function Window({ position, args, palette }: { position: [number, number, number], args: [number, number], palette: Palette }) {
  const [w, h] = args;
  return (
    <group position={position}>
      {/* Marco */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[w + 0.1, h + 0.1, 0.04]} />
        <meshStandardMaterial color={palette.marco || 0x4a4a4a} roughness={0.6} />
      </mesh>
      {/* Vidrio */}
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[w, h, 0.02]} />
        <meshStandardMaterial color={palette.vidrio || 0x6a8aa8} roughness={0.15} metalness={0.4} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}
