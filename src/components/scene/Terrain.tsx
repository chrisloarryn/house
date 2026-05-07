import React, { useMemo } from 'react';
import * as THREE from 'three';
import { L, cz } from '../../config/constants';
import { useStore } from '../../store/useStore';

export function Terrain() {
  const shape = useMemo(() => {
    const cut = L.lote.chaflanDer;
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(L.lote.frente - cut.frente, 0);
    s.lineTo(L.lote.frente, cut.fondo);
    s.lineTo(L.lote.frente, L.lote.fondoDer);
    s.lineTo(0, L.lote.fondoIzq);
    s.lineTo(0, 0);
    return s;
  }, []);

  const scenario = useStore(state => state.scenario);
  const perimPts = useMemo(() => {
    const cut = L.lote.chaflanDer;

    return [
      new THREE.Vector3(0, 0.06, 0),
      new THREE.Vector3(L.lote.frente - cut.frente, 0.06, 0),
      new THREE.Vector3(L.lote.frente, 0.06, cut.fondo),
      new THREE.Vector3(L.lote.frente, 0.06, L.lote.fondoDer),
      new THREE.Vector3(0, 0.06, L.lote.fondoIzq),
      new THREE.Vector3(0, 0.06, 0),
    ];
  }, []);

  return (
    <group>
      {/* Pasto/Base */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <shapeGeometry args={[shape]} />
          <meshStandardMaterial color={scenario === 'actual' ? 0x9b9b9b : 0x7a8a52} roughness={1} />
        </mesh>

      {/* Tierra antejardin */}
      <mesh position={[L.lote.frente / 2, 0.012, cz / 2 + 0.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[L.lote.frente - 0.3, cz - 0.25]} />
        <meshStandardMaterial color={0x6c5134} roughness={1} />
      </mesh>

      {/* Huella estacionamiento */}
      <mesh position={[L.lote.frente / 2, 0.015, cz / 2 + 0.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[L.lote.frente - 0.3, cz - 0.25]} />
        <meshStandardMaterial color={0xa0a0a0} roughness={0.8} />
      </mesh>

      {/* Linea edificación */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 0.02, cz, L.lote.frente, 0.02, cz]), 3]}
          />
        </bufferGeometry>
        <lineDashedMaterial color={0xcc0000} dashSize={0.2} gapSize={0.2} />
      </line>

      {/* Linea amarilla perimetro */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(perimPts.flatMap(p => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={0xffd84a} />
      </line>
    </group>
  );
}
