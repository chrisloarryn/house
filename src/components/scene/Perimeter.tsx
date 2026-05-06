import React from 'react';
import { L } from '../../config/constants';

function Box({ position, args, color }: { position: [number, number, number], args: [number, number, number], color: number }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

export function Perimeter() {
  const altMuro = 2.0;
  const grosor = 0.15;
  const fondoR = L.lote.fondoDer;
  const fondoI = L.lote.fondoIzq;

  return (
    <group>
      {/* Lateral derecho */}
      <Box 
        args={[grosor, altMuro, fondoR]} 
        position={[L.lote.frente - grosor / 2, altMuro / 2, fondoR / 2]} 
        color={0xa8a098} 
      />
      {/* Lateral izquierdo */}
      <Box 
        args={[grosor, altMuro, fondoI]} 
        position={[grosor / 2, altMuro / 2, fondoI / 2]} 
        color={0xa8a098} 
      />
      {/* Muro de fondo */}
      <Box 
        args={[L.lote.frente, altMuro, grosor]} 
        position={[L.lote.frente / 2, altMuro / 2, fondoI - grosor / 2]} 
        color={0xa8a098} 
      />

      {/* Bandas decorativas muro derecho */}
      {[0.45, 0.9, 1.35, 1.8].map((h, i) => (
        <mesh key={i} position={[L.lote.frente - grosor / 2, h, fondoR / 2]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[fondoR - 0.1, 0.02, grosor + 0.01]} />
          <meshStandardMaterial color={0x807870} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
