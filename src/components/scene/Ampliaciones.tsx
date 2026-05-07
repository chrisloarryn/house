import React from 'react';
import type { Scenario } from '../../config/scenarios';
import type { Palette } from '../../config/palettes';
import type { VisibilityToggles } from '../../store/useStore';
import { L, cx, cz } from '../../config/constants';

function Box({ position, args, color }: { position: [number, number, number], args: [number, number, number], color: number }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

export function Ampliaciones({ scenario, palette, toggles }: { scenario: Scenario, palette: Palette, toggles: VisibilityToggles }) {
  const isMed = scenario.paleta === 'med';
  const colorBase = isMed ? palette.estuco1 : palette.cubo;
  const colorBand = isMed ? palette.cuboBand : 0xeeeeee;
  const rearDepth = L.lote.fondoIzq - (cz + L.casa.fondo);
  
  return (
    <group>
      {/* Ampliación Trasera */}
      {toggles.back && scenario.ampBack && (
        <group>
          <Box 
            position={[L.lote.frente / 2, scenario.ampBack.alto / 2, cz + L.casa.fondo + rearDepth / 2]} 
            args={[L.lote.frente, scenario.ampBack.alto, rearDepth]} 
            color={colorBase} 
          />
          {/* Cornisa trasera */}
          <Box 
            position={[L.lote.frente / 2, scenario.ampBack.alto + 0.09, cz + L.casa.fondo + rearDepth / 2]} 
            args={[L.lote.frente, 0.18, rearDepth + 0.05]} 
            color={colorBand} 
          />
          {/* Tejadillo si es mediterraneo */}
          {isMed && (
            <mesh position={[L.lote.frente / 2, scenario.ampBack.alto + 0.37, cz + L.casa.fondo + rearDepth / 2]} rotation={[-0.06, 0, 0]}>
              <boxGeometry args={[L.lote.frente + 0.3, 0.1, rearDepth + 0.3]} />
              <meshStandardMaterial color={palette.teja} roughness={0.9} />
            </mesh>
          )}
          {/* Ventanal */}
          <Box 
            position={[L.lote.frente / 2, (scenario.ampBack.alto - 0.7) / 2 + 0.3, cz + L.casa.fondo + rearDepth + 0.01]} 
            args={[L.lote.frente - 1.4, scenario.ampBack.alto - 0.7, 0.04]} 
            color={palette.marco || 0x222} 
          />
        </group>
      )}

      {/* Ampliaciones Laterales */}
      {toggles.lat && (
        <group>
          {scenario.ampLatL && (
            <group>
              <Box 
                position={[0.15 + (cx - 0.15) / 2, scenario.ampLatL.alto / 2, cz + scenario.ampLatL.fondo / 2]} 
                args={[cx - 0.15, scenario.ampLatL.alto, scenario.ampLatL.fondo]} 
                color={colorBase} 
              />
              <Box 
                position={[0.15 + (cx - 0.15) / 2, scenario.ampLatL.alto + 0.09, cz + scenario.ampLatL.fondo / 2]} 
                args={[cx - 0.15, 0.18, scenario.ampLatL.fondo]} 
                color={colorBand} 
              />
            </group>
          )}
          {scenario.ampLatR && (
            <group>
              <Box 
                position={[cx + L.casa.ancho + (L.lote.frente - 0.15 - (cx + L.casa.ancho)) / 2, scenario.ampLatR.alto / 2, cz + scenario.ampLatR.fondo / 2]} 
                args={[L.lote.frente - 0.15 - (cx + L.casa.ancho), scenario.ampLatR.alto, scenario.ampLatR.fondo]} 
                color={colorBase} 
              />
              <Box 
                position={[cx + L.casa.ancho + (L.lote.frente - 0.15 - (cx + L.casa.ancho)) / 2, scenario.ampLatR.alto + 0.09, cz + scenario.ampLatR.fondo / 2]} 
                args={[L.lote.frente - 0.15 - (cx + L.casa.ancho), 0.18, scenario.ampLatR.fondo]} 
                color={colorBand} 
              />
            </group>
          )}
        </group>
      )}

      {/* Patio Infill */}
      {toggles.patio && scenario.cierraPatioInt && (
        <group>
          <Box 
            position={[cx + L.casa.volIzq.ancho + L.casa.volDer.ancho / 2, L.casa.alto1 / 2, cz + L.casa.volDer.fondo + (L.casa.volIzq.fondo - L.casa.volDer.fondo) / 2]} 
            args={[L.casa.volDer.ancho, L.casa.alto1, L.casa.volIzq.fondo - L.casa.volDer.fondo]} 
            color={colorBase} 
          />
        </group>
      )}

      {/* Pergola */}
      {toggles.pergola && scenario.pergola && (
        <group>
          <Box position={[0.25 + 4.3 / 2, 2.6, 1.5]} args={[4.3, 0.15, 3.0]} color={0x3a2a1a} />
          {/* Postes */}
          <Box position={[0.4, 1.3, 2.8]} args={[0.15, 2.6, 0.15]} color={0x3a2a1a} />
          <Box position={[4.4, 1.3, 2.8]} args={[0.15, 2.6, 0.15]} color={0x3a2a1a} />
        </group>
      )}
    </group>
  );
}
