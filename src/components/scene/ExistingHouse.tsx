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

function FrontStrip({ x, y, z, width, color = 0x5f5a4b }: { x: number; y: number; z: number; width: number; color?: number }) {
  return <Box position={[x, y, z]} args={[width, 0.022, 0.035]} color={color} />;
}

function SideStrip({ x, y, z, depth, color = 0x5f5a4b }: { x: number; y: number; z: number; depth: number; color?: number }) {
  return <Box position={[x, y, z]} args={[0.035, 0.022, depth]} color={color} />;
}

export function ExistingHouse({ palette, isActual }: { palette: Palette; isActual: boolean }) {
  const w = L.casa.ancho;
  const f = L.casa.fondo;
  const a1 = L.casa.alto1;
  const a2 = L.casa.alto2;
  const leftW = L.casa.volIzq.ancho;
  const rightW = w - leftW;
  const rightSetback = 0.58;
  const porchDepth = 1.28;
  const leftCenterX = cx + leftW / 2;
  const rightCenterX = cx + leftW + rightW / 2;
  const leftFrontZ = cz - 0.07;
  const rightFrontZ = cz + rightSetback - 0.04;

  const z = cz + f / 2;

  return (
    <group>
      {/* Piso 1: dos cuerpos reales, dejando el porche como vacío bajo el segundo piso */}
      <Box position={[leftCenterX, a1 / 2, z]} args={[leftW, a1, f]} color={palette.estuco1} />
      <Box
        position={[rightCenterX, a1 / 2, cz + porchDepth + (f - porchDepth) / 2]}
        args={[rightW, a1, f - porchDepth]}
        color={palette.estuco1}
      />
      
      {/* Piso 2 en dos crujías: izquierda adelantada y derecha retranqueada según planta/foto */}
      <Box position={[leftCenterX, a1 + a2 / 2, z]} args={[leftW, a2, f]} color={palette.siding2} />
      <Box
        position={[rightCenterX, a1 + a2 / 2, cz + rightSetback + (f - rightSetback) / 2]}
        args={[rightW, a2, f - rightSetback]}
        color={palette.siding2}
      />

      {/* Porche retranqueado y sombra del acceso */}
      <Box position={[cx + 5.05, a1 - 0.08, cz + porchDepth / 2]} args={[2.08, 0.16, porchDepth]} color={0x4f4a40} />
      <Box position={[cx + 4.12, 1.35, cz + porchDepth / 2]} args={[0.16, 2.7, 0.16]} color={0xf0eadf} />
      <Box position={[cx + 5.95, 1.35, cz + porchDepth / 2]} args={[0.16, 2.7, 0.16]} color={0xf0eadf} />
      <Box position={[cx + 5.05, 0.04, cz + porchDepth / 2]} args={[1.9, 0.08, porchDepth]} color={0xbcb7ad} />
      <Box position={[cx + 5.05, 1.35, cz + porchDepth + 0.03]} args={[1.65, 2.5, 0.08]} color={0xe8e4d8} />

      {/* Zócalo */}
      <Box position={[leftCenterX, 0.19, cz - 0.055]} args={[leftW + 0.15, 0.38, 0.08]} color={0xd8d0be} />
      <Box position={[rightCenterX, 0.19, cz - 0.055]} args={[rightW + 0.15, 0.38, 0.08]} color={0xd8d0be} />

      {/* Banda divisoria pisos */}
      <Box 
        position={[cx + w / 2, a1 + 0.04, z]} 
        args={[w + 0.05, 0.08, f + 0.05]} 
        color={isActual ? 0xa89880 : (palette.marco || 0x808080)} 
      />

      {/* Siding horizontal visible en la fachada */}
      {Array.from({ length: 12 }, (_, i) => a1 + 0.24 + i * 0.18).map((yLine) => (
        <React.Fragment key={yLine}>
          <FrontStrip x={leftCenterX} y={yLine} z={leftFrontZ} width={leftW - 0.22} />
          <FrontStrip x={rightCenterX} y={yLine} z={rightFrontZ} width={rightW - 0.18} />
          <SideStrip x={cx - 0.035} y={yLine} z={cz + f / 2} depth={f - 0.35} />
          <SideStrip x={cx + w + 0.035} y={yLine} z={cz + rightSetback + (f - rightSetback) / 2} depth={f - rightSetback - 0.35} />
        </React.Fragment>
      ))}
      <Box position={[cx + leftW + 0.03, a1 + a2 / 2, cz + 0.26]} args={[0.12, a2 + 0.18, 0.12]} color={0x4b473d} />
      <Box position={[cx + w - 0.06, a1 + a2 / 2, rightFrontZ]} args={[0.12, a2 + 0.18, 0.1]} color={0x6b6558} />
      <Box position={[cx - 0.08, a1 + a2 / 2, cz + f / 2]} args={[0.14, a2 + 0.2, 0.1]} color={0xd7d0be} />
      <Box position={[cx + leftW - 0.06, a1 + a2 / 2, cz + f / 2]} args={[0.12, a2 + 0.2, 0.1]} color={0xd7d0be} />
      <Box position={[cx + w + 0.08, a1 + a2 / 2, cz + f / 2]} args={[0.14, a2 + 0.2, 0.1]} color={0xd7d0be} />

      {/* Ventanas Piso 1 */}
      <Window position={[cx + 1.93, 1.33, cz - 0.105]} args={[1.88, 1.42]} palette={palette} divisions={3} sill />
      <Box position={[cx + 0.62, 0.88, cz - 0.11]} args={[0.18, 1.74, 0.1]} color={0xece7dd} />
      <Box position={[cx + 3.23, 0.88, cz - 0.11]} args={[0.18, 1.74, 0.1]} color={0xece7dd} />
      <SlidingDoor position={[cx + 1.68, 1.08, cz + f + 0.08]} args={[1.78, 2.11]} palette={palette} />
      <SlidingDoor position={[cx + 4.72, 1.08, cz + f + 0.08]} args={[1.78, 2.11]} palette={palette} />

      {/* Ventanas Piso 2 */}
      <Window position={[cx + 4.9, a1 + 1.18, rightFrontZ - 0.03]} args={[1.12, 1.08]} palette={palette} divisions={2} />
      <SideWindow position={[cx - 0.09, a1 + 0.95, cz + 2.2]} palette={palette} />
      <Vent position={[cx + 5.9, a1 + 2.1, rightFrontZ - 0.05]} />

      {/* Puerta principal y portón (solo en Estado Actual) */}
      {isActual && (
        <group>
          <Door position={[cx + 5.12, 1.04, cz + porchDepth - 0.02]} />
          <Box position={[cx + 3.56, 1.4, cz - 0.09]} args={[0.08, 2.65, 0.08]} color={0x252525} />
          <Box position={[cx + 5.95, 1.4, cz + 0.12]} args={[0.08, 2.65, 0.08]} color={0x252525} />
        </group>
      )}
    </group>
  );
}

function SideWindow({ position, palette }: { position: [number, number, number]; palette: Palette }) {
  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      <Box position={[0, 0, 0.01]} args={[0.95, 1.05, 0.04]} color={palette.marco || 0x4a4a4a} />
      <Box position={[0, 0, 0.04]} args={[0.82, 0.92, 0.02]} color={palette.vidrio || 0x6a8aa8} />
      <Box position={[0, 0, 0.07]} args={[0.04, 0.92, 0.025]} color={palette.marco || 0x4a4a4a} />
    </group>
  );
}

function SlidingDoor({
  position,
  args,
  palette,
}: {
  position: [number, number, number];
  args: [number, number];
  palette: Palette;
}) {
  const [w, h] = args;
  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      <Box position={[0, 0, 0]} args={[w + 0.12, h + 0.12, 0.045]} color={palette.marco || 0x343434} />
      <Box position={[0, 0, 0.035]} args={[w, h, 0.025]} color={palette.vidrio || 0x6a8aa8} />
      <Box position={[0, 0, 0.065]} args={[0.045, h, 0.025]} color={palette.marco || 0x343434} />
      <Box position={[0, -h / 2 - 0.09, 0.03]} args={[w + 0.18, 0.12, 0.08]} color={0x82776a} />
    </group>
  );
}

function Vent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Box position={[0, 0, 0]} args={[0.22, 0.16, 0.025]} color={0x332f2a} />
      <Box position={[0, -0.07, 0.03]} args={[0.18, 0.025, 0.025]} color={0x151515} />
      <Box position={[0, 0, 0.03]} args={[0.18, 0.025, 0.025]} color={0x151515} />
      <Box position={[0, 0.07, 0.03]} args={[0.18, 0.025, 0.025]} color={0x151515} />
    </group>
  );
}

function Window({
  position,
  args,
  palette,
  divisions = 2,
  sill = false,
}: {
  position: [number, number, number];
  args: [number, number];
  palette: Palette;
  divisions?: number;
  sill?: boolean;
}) {
  const [w, h] = args;
  return (
    <group position={position}>
      {sill && (
        <>
          <Box position={[0, -h / 2 - 0.14, 0.005]} args={[w + 0.55, 0.18, 0.18]} color={0xb8ad9b} />
          <Box position={[0, h / 2 + 0.14, 0.005]} args={[w + 0.45, 0.16, 0.16]} color={0xb8ad9b} />
          <Box position={[-w / 2 - 0.17, 0, 0.005]} args={[0.16, h + 0.32, 0.16]} color={0xb8ad9b} />
          <Box position={[w / 2 + 0.17, 0, 0.005]} args={[0.16, h + 0.32, 0.16]} color={0xb8ad9b} />
        </>
      )}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[w + 0.1, h + 0.1, 0.04]} />
        <meshStandardMaterial color={palette.marco || 0x4a4a4a} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[w, h, 0.02]} />
        <meshStandardMaterial color={palette.vidrio || 0x6a8aa8} roughness={0.15} metalness={0.4} transparent opacity={0.85} />
      </mesh>
      {Array.from({ length: divisions - 1 }, (_, i) => -w / 2 + ((i + 1) * w) / divisions).map((xLine) => (
        <Box key={xLine} position={[xLine, 0, 0.055]} args={[0.045, h, 0.025]} color={palette.marco || 0x4a4a4a} />
      ))}
      <Box position={[0, 0, 0.055]} args={[w, 0.045, 0.025]} color={palette.marco || 0x4a4a4a} />
    </group>
  );
}

function Door({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Box position={[0, 0, 0]} args={[0.82, 2.05, 0.06]} color={0xd4cbb9} />
      <Box position={[0, 0.52, 0.04]} args={[0.58, 0.72, 0.035]} color={0xc6bba8} />
      <Box position={[0, -0.42, 0.04]} args={[0.58, 0.72, 0.035]} color={0xc6bba8} />
      <Box position={[0.31, 0, 0.07]} args={[0.04, 1.85, 0.025]} color={0xb8ad9b} />
      <mesh position={[0.26, 0.03, 0.09]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color={0x383838} roughness={0.35} metalness={0.5} />
      </mesh>
    </group>
  );
}
