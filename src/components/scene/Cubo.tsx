import React from 'react';
import * as THREE from 'three';
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

function ChamferedBlock({ x, width, height, depth, color, chamfer = 0, y = 0 }: {
  x: number;
  width: number;
  height: number;
  depth: number;
  color: number;
  chamfer?: number;
  y?: number;
}) {
  const geometry = React.useMemo(() => {
    const c = Math.min(chamfer, width * 0.45, depth * 0.45);
    const pts = [
      [x, 0],
      [x + width - c, 0],
      [x + width, c],
      [x + width, depth],
      [x, depth],
    ];
    const vertices: number[] = [];
    const faces: number[] = [];

    for (const yy of [y, y + height]) {
      pts.forEach(([px, pz]) => vertices.push(px, yy, pz));
    }

    // Bottom and top caps.
    faces.push(0, 1, 2, 0, 2, 3, 0, 3, 4);
    faces.push(5, 7, 6, 5, 8, 7, 5, 9, 8);

    // Side faces.
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      faces.push(i, j, j + pts.length, i, j + pts.length, i + pts.length);
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    g.setIndex(faces);
    g.computeVertexNormals();
    return g;
  }, [x, width, height, depth, chamfer, y]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

function ChamferFace({ x, width, chamfer, y, height, color, zOffset = 0 }: {
  x: number;
  width: number;
  chamfer: number;
  y: number;
  height: number;
  color: number;
  zOffset?: number;
}) {
  const cxFace = x + width - chamfer / 2;
  const zFace = chamfer / 2 + zOffset;
  const len = Math.hypot(chamfer, chamfer);
  return (
    <mesh position={[cxFace, y + height / 2, zFace]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
      <boxGeometry args={[len, height, 0.018]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

export function Cubo({ level, data, palette, isMed }: { level: number, data: Ampliacion, palette: Palette, isMed: boolean }) {
  const cuboW = data.ancho;
  const cuboX = (L.lote.frente - cuboW) / 2;
  const f = data.fondo; // 3.6
  const h = data.alto; // 2.7
  const chamfer = 1.15;
  const frontZ = -0.006;
  const trim = isMed ? palette.cuboBand : 0x3a3a3a;
  const gateColor = isMed ? 0x1c1714 : 0x171717;
  const doorColor = isMed ? 0x5f3d24 : 0x242424;
  const glassColor = palette.vidrio || 0x6f8fa4;
  const accent = isMed ? palette.zocalo : 0xb8b8b8;
  
  const yBase = level === 1 ? 0 : h;
  const color = (level === 2 && isMed) ? (palette.siding2 || palette.cubo) : palette.cubo;

  return (
    <group position={[0, yBase, 0]}>
      {/* Volumen principal con sacado/chaflán frontal según plano */}
      <ChamferedBlock x={cuboX} width={cuboW} height={h} depth={f} color={color} chamfer={chamfer} />

      {/* Cornisa / coronación: solo remates de borde, no una tapa negra completa */}
      <Box
        position={[cuboX + (cuboW - chamfer) / 2, h + (isMed ? 0.16 : 0.10), frontZ - 0.01]}
        args={[cuboW - chamfer, isMed ? 0.32 : 0.20, 0.08]}
        color={trim}
      />
      <ChamferFace
        x={cuboX}
        width={cuboW}
        chamfer={chamfer}
        y={h}
        height={isMed ? 0.32 : 0.20}
        color={trim}
        zOffset={-0.01}
      />
      <Box
        position={[cuboX + cuboW - 0.04, h + (isMed ? 0.16 : 0.10), chamfer + (f - chamfer) / 2]}
        args={[0.08, isMed ? 0.32 : 0.20, f - chamfer]}
        color={trim}
      />
      <Box
        position={[cuboX + cuboW / 2, h + (isMed ? 0.16 : 0.10), f - 0.04]}
        args={[cuboW, isMed ? 0.32 : 0.20, 0.08]}
        color={trim}
      />

      {/* Detalles Piso 1 */}
      {level === 1 && isMed && (
          <ChamferedBlock x={cuboX} width={cuboW} height={0.4} depth={f} color={palette.zocalo} chamfer={chamfer} />
      )}
      
      {level === 1 && !isMed && (
          <ChamferedBlock x={cuboX} width={cuboW} height={0.4} depth={f} color={0xa0a0a0} chamfer={chamfer} />
      )}

      {/* Fachada hacia la calle (z=0). Antes estos elementos estaban en la cara posterior. */}
      {level === 1 && (
        <group>
          {/* Paño frontal levemente retranqueado para evitar muro plano */}
          <Box position={[cuboX + cuboW / 2, h / 2, frontZ]} args={[cuboW - 0.28, h - 0.42, 0.012]} color={color} />

          {/* Pilastras verticales que ordenan portón, acceso y remates */}
          {[cuboX + 0.10, cuboX + 4.95, cuboX + 5.98].map((x) => (
            <Box key={`pilastra-${x}`} position={[x, h / 2, frontZ - 0.010]} args={[0.13, h + 0.05, 0.018]} color={trim} />
          ))}
          <ChamferFace x={cuboX} width={cuboW} chamfer={chamfer} y={0} height={h + 0.05} color={trim} zOffset={-0.010} />

          {/* Zócalo frontal continuo */}
          <Box position={[cuboX + (cuboW - chamfer) / 2, 0.30, frontZ - 0.014]} args={[cuboW - chamfer, 0.55, 0.018]} color={accent} />
          <ChamferFace x={cuboX} width={cuboW} chamfer={chamfer} y={0.025} height={0.55} color={accent} zOffset={-0.020} />

          {/* Portón vehicular ancho con lamas verticales */}
          <Box position={[cuboX + 2.48, 1.24, frontZ - 0.018]} args={[4.15, 2.26, 0.016]} color={gateColor} />
          {Array.from({ length: 18 }, (_, i) => {
            const x = cuboX + 0.48 + (i + 0.5) * (3.95 / 18);
            return <Box key={`lama-porton-${i}`} position={[x, 1.24, frontZ - 0.028]} args={[0.055, 2.08, 0.012]} color={isMed ? 0x2a211b : 0x2b2b2b} />;
          })}
          <Box position={[cuboX + 2.48, 2.40, frontZ - 0.028]} args={[4.25, 0.12, 0.014]} color={trim} />

          {/* Acceso peatonal con puerta y paño vidriado lateral */}
          <Box position={[cuboX + 5.47, 1.25, frontZ - 0.018]} args={[0.94, 2.24, 0.016]} color={doorColor} />
          <Box position={[cuboX + 6.25, 1.35, frontZ - 0.020]} args={[0.42, 1.74, 0.014]} color={trim} />
          <Box position={[cuboX + 6.25, 1.35, frontZ - 0.028]} args={[0.32, 1.58, 0.010]} color={glassColor} />
          <mesh position={[cuboX + 5.82, 1.18, frontZ - 0.034]} castShadow>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color={isMed ? 0xc38b54 : 0x0f0f0f} metalness={0.45} roughness={0.35} />
          </mesh>

          {/* Dintel plano del acceso, sin proyectarse fuera del frente */}
          <Box position={[cuboX + 5.88, 2.47, frontZ - 0.020]} args={[1.85, 0.14, 0.016]} color={trim} />

          {/* Apliques y placa de número */}
          {[cuboX + 4.78, cuboX + 6.78].map((x) => (
            <Box key={`aplique-${x}`} position={[x, 2.15, frontZ - 0.028]} args={[0.10, 0.34, 0.012]} color={isMed ? 0xffd8a0 : 0xf0f0e8} />
          ))}
          <Box position={[cuboX + 0.78, 1.88, frontZ - 0.026]} args={[0.46, 0.28, 0.012]} color={isMed ? 0xd8c6a8 : 0xeeeeee} />
        </group>
      )}

      {/* Ventanales frontales (Piso 2) */}
      {level === 2 && (
        <group>
          <Box position={[cuboX + cuboW / 2, h / 2, frontZ - 0.014]} args={[4.25, 1.78, 0.014]} color={trim} />
          <Box position={[cuboX + cuboW / 2, h / 2, frontZ - 0.026]} args={[4.05, 1.58, 0.010]} color={glassColor} />
          <Box position={[cuboX + cuboW / 2, h / 2, frontZ - 0.032]} args={[0.055, 1.68, 0.010]} color={trim} />
          <Box position={[cuboX + cuboW / 2 - 1.35, h / 2, frontZ - 0.032]} args={[0.045, 1.48, 0.010]} color={trim} />
          <Box position={[cuboX + cuboW / 2 + 1.35, h / 2, frontZ - 0.032]} args={[0.045, 1.48, 0.010]} color={trim} />
        </group>
      )}
    </group>
  );
}
