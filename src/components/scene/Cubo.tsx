import React from 'react';
import type { Ampliacion } from '../../config/scenarios';
import type { Palette } from '../../config/palettes';
import { L } from '../../config/constants';

function Box({ position, args, color }: { position: [number, number, number], args: [number, number, number], color: number }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

export function Cubo({ level, data, palette, isMed }: { level: number, data: Ampliacion, palette: Palette, isMed: boolean }) {
  const cuboX = 0.15; // respetando el muro izquierdo
  const cuboW = L.lote.frente - cuboX * 2;
  const f = data.fondo; // 3.6
  const h = data.alto; // 2.7
  
  const yBase = level === 1 ? 0 : h;
  const color = (level === 2 && isMed) ? (palette.siding2 || palette.cubo) : palette.cubo;

  return (
    <group position={[0, yBase, 0]}>
      {/* Volumen principal */}
      <Box 
        position={[cuboX + cuboW / 2, h / 2, f / 2]} 
        args={[cuboW, h, f]} 
        color={color} 
      />

      {/* Cornisa */}
      <Box 
        position={[cuboX + cuboW / 2, h + (isMed ? 0.175 : 0.11), f / 2]} 
        args={[cuboW, isMed ? 0.35 : 0.22, f + 0.06]} 
        color={palette.cuboBand} 
      />

      {/* Detalles Piso 1 */}
      {level === 1 && isMed && (
        <Box 
          position={[cuboX + cuboW / 2, 0.2, f / 2]} 
          args={[cuboW, 0.4, f + 0.04]} 
          color={palette.zocalo} 
        />
      )}
      
      {level === 1 && !isMed && (
        <Box 
          position={[cuboX + cuboW / 2, 0.2, f / 2]} 
          args={[cuboW, 0.4, f + 0.02]} 
          color={0xa0a0a0} 
        />
      )}

      {/* Portón y Puerta (Piso 1) */}
      {level === 1 && (
        <group>
          {/* Portón Vehicular */}
          <Box position={[cuboX + 4.5, 1.1, f + 0.01]} args={[2.8, 2.2, 0.05]} color={0x2a2a2a} />
          {/* Puerta Peatonal */}
          <Box position={[cuboX + 1.2, 1.1, f + 0.01]} args={[1.0, 2.2, 0.05]} color={0x4a3a2a} />
          {/* Alero Porche */}
          <Box position={[cuboX + 1.2, 2.4, f + 0.5]} args={[2.0, 0.15, 1.0]} color={palette.cuboBand} />
        </group>
      )}

      {/* Ventanales (Piso 2) */}
      {level === 2 && (
        <group>
          <Box position={[cuboX + cuboW / 2, h / 2, f + 0.01]} args={[3.0, 1.8, 0.04]} color={0x222222} />
          <Box position={[cuboX + cuboW / 2, h / 2, f + 0.02]} args={[2.9, 1.7, 0.02]} color={0x7a9ab8} />
        </group>
      )}
    </group>
  );
}
