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
