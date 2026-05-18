import React from 'react';
import { L } from '../../config/constants';

function Box({ position, args, color, rotation = [0, 0, 0] }: { position: [number, number, number], args: [number, number, number], color: number, rotation?: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

function BlockCourses({
  x,
  z,
  length,
  side,
  height,
}: {
  x: number;
  z: number;
  length: number;
  side: 'left' | 'right' | 'back';
  height: number;
}) {
  const dark = 0x7d7770;
  const yLines = Array.from({ length: Math.floor(height / 0.36) }, (_, i) => 0.36 + i * 0.36);

  if (side === 'back') {
    return (
      <group>
        {yLines.map((y) => (
          <Box key={`back-h-${y}`} position={[x, y, z - 0.08]} args={[length - 0.18, 0.018, 0.018]} color={dark} />
        ))}
        {Array.from({ length: Math.floor(length / 0.78) }, (_, i) => (
          <Box key={`back-v-${i}`} position={[x - length / 2 + 0.58 + i * 0.78, height / 2, z - 0.082]} args={[0.018, height - 0.18, 0.018]} color={dark} />
        ))}
      </group>
    );
  }

  return (
    <group>
      {yLines.map((y) => (
        <Box key={`${side}-h-${y}`} position={[x, y, z]} args={[0.018, 0.018, length - 0.18]} color={dark} />
      ))}
      {Array.from({ length: Math.floor(length / 0.78) }, (_, i) => (
        <Box key={`${side}-v-${i}`} position={[x, height / 2, z - length / 2 + 0.58 + i * 0.78]} args={[0.018, height - 0.18, 0.018]} color={dark} />
      ))}
    </group>
  );
}

export function Perimeter() {
  const altMuro = 2.0;
  const grosor = 0.15;
  const cut = L.lote.chaflanDer;
  const fondoR = L.lote.fondoDer;
  const fondoI = L.lote.fondoIzq;

  return (
    <group>
      {/* Lateral derecho */}
      <Box 
        args={[grosor, altMuro, fondoR - cut.fondo]} 
        position={[L.lote.frente - grosor / 2, altMuro / 2, cut.fondo + (fondoR - cut.fondo) / 2]} 
        color={0xa8a098} 
      />
      <BlockCourses x={L.lote.frente - grosor - 0.008} z={cut.fondo + (fondoR - cut.fondo) / 2} length={fondoR - cut.fondo} side="right" height={altMuro} />
      {/* Lateral izquierdo */}
      <Box 
        args={[grosor, altMuro, fondoI]} 
        position={[grosor / 2, altMuro / 2, fondoI / 2]} 
        color={0xa8a098} 
      />
      <BlockCourses x={grosor + 0.008} z={fondoI / 2} length={fondoI} side="left" height={altMuro} />
      {/* Muro de fondo */}
      <Box 
        args={[L.lote.frente, altMuro, grosor]} 
        position={[L.lote.frente / 2, altMuro / 2, fondoI - grosor / 2]} 
        color={0xa8a098} 
      />
      <BlockCourses x={L.lote.frente / 2} z={fondoI - grosor - 0.008} length={L.lote.frente} side="back" height={altMuro} />

      {/* Chaflán frontal derecho del terreno */}
      <Box
        args={[Math.hypot(cut.frente, cut.fondo), altMuro, grosor]}
        position={[L.lote.frente - cut.frente / 2, altMuro / 2, cut.fondo / 2]}
        rotation={[0, -Math.atan2(cut.fondo, cut.frente), 0]}
        color={0xa8a098}
      />

      {/* Bandas decorativas muro derecho */}
      {[0.45, 0.9, 1.35, 1.8].map((h, i) => (
        <mesh key={i} position={[L.lote.frente - grosor / 2, h, cut.fondo + (fondoR - cut.fondo) / 2]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[fondoR - cut.fondo - 0.1, 0.02, grosor + 0.01]} />
          <meshStandardMaterial color={0x807870} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
