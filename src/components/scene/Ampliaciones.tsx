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

function StuccoGrain({ x, zStart, depth, height }: { x: number, zStart: number, depth: number, height: number }) {
  return (
    <group>
      {Array.from({ length: 22 }, (_, i) => {
        const z = zStart + 0.22 + ((i * 0.43) % Math.max(0.5, depth - 0.44));
        const y = 0.35 + ((i * 0.31) % Math.max(0.5, height - 0.7));
        const shade = i % 3 === 0 ? 0xf4ead5 : i % 3 === 1 ? 0xcab789 : 0xb49c6f;
        return (
          <mesh key={i} position={[x, y, z]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.018 + (i % 4) * 0.004, 8]} />
            <meshStandardMaterial color={shade} roughness={1} />
          </mesh>
        );
      })}
    </group>
  );
}

export function Ampliaciones({ scenario, palette, toggles }: { scenario: Scenario, palette: Palette, toggles: VisibilityToggles }) {
  const isMed = scenario.paleta === 'med';
  const colorBase = isMed ? palette.estuco1 : palette.cubo;
  const colorLateral = 0xe6d4b0;
  const colorBand = isMed ? palette.cuboBand : 0xeeeeee;
  const techoMedColor = palette.teja || 0xb55a30;
  const rearStartZ = cz + L.casa.fondo;
  const rearCenterX = cx + L.casa.ancho / 2;
  const latLeftX = cx + L.casa.ancho;
  const latLeftWidth = L.lote.frente - latLeftX;
  const latRightX = 0;
  const latRightWidth = cx;
  
  return (
    <group>
      {/* Ampliación Trasera */}
      {toggles.back && scenario.ampBack && (
        <group>
          <Box 
            position={[rearCenterX, scenario.ampBack.alto / 2, rearStartZ + scenario.ampBack.fondo / 2]} 
            args={[scenario.ampBack.ancho, scenario.ampBack.alto, scenario.ampBack.fondo]} 
            color={colorBase} 
          />
          {/* Cornisa trasera */}
          <Box 
            position={[rearCenterX, scenario.ampBack.alto + 0.09, rearStartZ + scenario.ampBack.fondo / 2]} 
            args={[scenario.ampBack.ancho, 0.18, scenario.ampBack.fondo + 0.05]} 
            color={colorBand} 
          />
          {/* Tejadillo si es mediterraneo */}
          {isMed && (
            <mesh position={[rearCenterX, scenario.ampBack.alto + 0.37, rearStartZ + scenario.ampBack.fondo / 2]} rotation={[-0.06, 0, 0]}>
              <boxGeometry args={[scenario.ampBack.ancho + 0.3, 0.1, scenario.ampBack.fondo + 0.3]} />
              <meshStandardMaterial color={palette.teja} roughness={0.9} />
            </mesh>
          )}
          {/* Ventanal */}
          <Box 
            position={[rearCenterX, (scenario.ampBack.alto - 0.7) / 2 + 0.3, rearStartZ + scenario.ampBack.fondo + 0.01]} 
            args={[scenario.ampBack.ancho - 1.0, scenario.ampBack.alto - 0.7, 0.04]} 
            color={palette.marco || 0x222} 
          />
        </group>
      )}

      {/* Ampliaciones Laterales */}
      {toggles.latL && scenario.ampLatL && (
        <group>
          <Box 
            position={[latLeftX + latLeftWidth / 2, scenario.ampLatL.alto / 2, cz + scenario.ampLatL.fondo / 2]} 
            args={[latLeftWidth, scenario.ampLatL.alto, scenario.ampLatL.fondo]} 
            color={colorLateral} 
          />
          <Box 
            position={[latLeftX + latLeftWidth / 2, scenario.ampLatL.alto + 0.09, cz + scenario.ampLatL.fondo / 2]} 
            args={[latLeftWidth, 0.18, scenario.ampLatL.fondo]} 
            color={colorBand} 
          />
          <mesh position={[latLeftX + latLeftWidth / 2, scenario.ampLatL.alto + 0.38, cz + scenario.ampLatL.fondo / 2]} rotation={[0, 0, -0.12]}>
            <boxGeometry args={[latLeftWidth + 0.42, 0.12, scenario.ampLatL.fondo + 0.42]} />
            <meshStandardMaterial color={techoMedColor} roughness={0.86} />
          </mesh>
          <Box
            position={[L.lote.frente - 0.08, scenario.ampLatL.alto + 0.22, cz + scenario.ampLatL.fondo / 2]}
            args={[0.12, 0.12, scenario.ampLatL.fondo + 0.34]}
            color={0x25221f}
          />
          <Box
            position={[L.lote.frente - 0.08, scenario.ampLatL.alto - 0.72, cz + scenario.ampLatL.fondo - 0.24]}
            args={[0.09, 1.72, 0.09]}
            color={0x25221f}
          />
          {Array.from({ length: 9 }, (_, i) => {
            const amp = scenario.ampLatL!;
            return (
              <mesh
                key={i}
                position={[latLeftX + latLeftWidth / 2, amp.alto + 0.46, cz + 0.45 + i * ((amp.fondo - 0.9) / 8)]}
                rotation={[0, 0, -0.12]}
              >
                <boxGeometry args={[latLeftWidth + 0.5, 0.026, 0.05]} />
                <meshStandardMaterial color={0x8f3f27} roughness={0.9} />
              </mesh>
            );
          })}
          <StuccoGrain
            x={L.lote.frente + 0.004}
            zStart={cz}
            depth={scenario.ampLatL.fondo}
            height={scenario.ampLatL.alto}
          />
          {toggles.latLDoor && (
            <>
              <Box
                position={[latLeftX + latLeftWidth / 2, 1.05, cz - 0.025]}
                args={[0.86, 2.1, 0.05]}
                color={0x4b3b2a}
              />
              <Box
                position={[latLeftX + latLeftWidth / 2, 1.05, cz + scenario.ampLatL.fondo + 0.025]}
                args={[0.86, 2.1, 0.05]}
                color={0x4b3b2a}
              />
            </>
          )}
          {toggles.latLWindow && (
            <Box
              position={[L.lote.frente + 0.025, 1.48, cz + scenario.ampLatL.fondo * 0.55]}
              args={[0.05, 1.05, 1.18]}
              color={palette.vidrio || 0x6f858f}
            />
          )}
        </group>
      )}

      {toggles.latR && scenario.ampLatR && (
        <group>
          <Box 
            position={[latRightX + latRightWidth / 2, scenario.ampLatR.alto / 2, cz + scenario.ampLatR.fondo / 2]} 
            args={[latRightWidth, scenario.ampLatR.alto, scenario.ampLatR.fondo]} 
            color={colorLateral} 
          />
          <Box 
            position={[latRightX + latRightWidth / 2, scenario.ampLatR.alto + 0.09, cz + scenario.ampLatR.fondo / 2]} 
            args={[latRightWidth, 0.18, scenario.ampLatR.fondo]} 
            color={colorBand} 
          />
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
