import React, { useMemo } from 'react';
import * as THREE from 'three';
import { L, cx, cz } from '../../config/constants';
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

export function Roof({ palette, isActual }: { palette: Palette; isActual: boolean }) {
  const yBase = L.casa.alto1 + L.casa.alto2;
  const f = L.casa.fondo;
  
  // Coordenadas cumbrera principal
  const ridgeZ = cz + f * 0.45;
  const ridgeY = yBase + L.casa.techoMainAlt;
  const xL = cx - 0.2;
  const xR = cx + L.casa.ancho + 0.2;

  const roofColor = palette.techo;
  const trimColor = palette.marco || 0x4a4a4a;
  const sidingColor = palette.siding2;

  return (
    <group>
      {/* Faldón Frontal */}
      <Plano 
        color={roofColor}
        verts={[
          xL, yBase, cz - 0.2,
          xR, yBase, cz - 0.2,
          xR, ridgeY, ridgeZ,
          
          xL, yBase, cz - 0.2,
          xR, ridgeY, ridgeZ,
          xL, ridgeY, ridgeZ
        ]} 
      />

      {/* Faldón Posterior */}
      <Plano 
        color={roofColor}
        verts={[
          xL, ridgeY, ridgeZ,
          xR, ridgeY, ridgeZ,
          xR, yBase, cz + f + 0.2,

          xL, ridgeY, ridgeZ,
          xR, yBase, cz + f + 0.2,
          xL, yBase, cz + f + 0.2
        ]} 
      />

      {/* Gables frontales */}
      <GableFrontal 
        x0={cx + L.casa.gableFrenteIzq.x} 
        x1={cx + L.casa.gableFrenteIzq.x + L.casa.gableFrenteIzq.ancho} 
        zFace={cz} 
        fondo={L.casa.gableFrenteIzq.fondo} 
        alt={L.casa.gableFrenteIzq.alt} 
        yBase={yBase} 
        siding={sidingColor} 
        roof={roofColor} 
      />

      <GableFrontal 
        x0={cx + L.casa.gableFrenteDer.x} 
        x1={cx + L.casa.gableFrenteDer.x + L.casa.gableFrenteDer.ancho} 
        zFace={cz} 
        fondo={L.casa.gableFrenteDer.fondo} 
        alt={L.casa.gableFrenteDer.alt} 
        yBase={yBase} 
        siding={sidingColor} 
        roof={roofColor} 
      />
    </group>
  );
}

function GableFrontal({ x0, x1, zFace, fondo, alt, yBase, siding, roof }: any) {
  const xMid = (x0 + x1) / 2;
  const yTip = yBase + alt;
  const zRidge = zFace + fondo;

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
