import React, { useMemo } from 'react';
import * as THREE from 'three';
import { L } from '../../config/constants';

export function Fence() {
  const altReja = 2.0;
  const n = Math.floor(L.lote.frente / 0.16);

  const instancedMeshRef = React.useRef<THREE.InstancedMesh>(null);

  React.useEffect(() => {
    if (instancedMeshRef.current) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < n; i++) {
        const x = (i + 0.5) * (L.lote.frente / n);
        dummy.position.set(x, (altReja + 0.12) / 2, 0.05);
        dummy.rotation.z = (i % 3 - 1) * 0.025;
        dummy.updateMatrix();
        instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
      }
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [n, altReja]);

  return (
    <group>
      {/* Travesaños */}
      <mesh position={[L.lote.frente / 2, 0.28, 0.05]}>
        <boxGeometry args={[L.lote.frente, 0.06, 0.04]} />
        <meshStandardMaterial color={0x222222} roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[L.lote.frente / 2, altReja - 0.32, 0.05]}>
        <boxGeometry args={[L.lote.frente, 0.06, 0.04]} />
        <meshStandardMaterial color={0x222222} roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Barrotes Instanced */}
      <instancedMesh ref={instancedMeshRef} args={[undefined, undefined, n]} castShadow>
        <boxGeometry args={[0.035, altReja + 0.12, 0.035]} />
        <meshStandardMaterial color={0x222222} roughness={0.5} metalness={0.4} />
      </instancedMesh>

      {/* Portón y chapa */}
      <mesh position={[L.lote.frente / 2, altReja / 2, 0.035]}>
        <boxGeometry args={[0.9, altReja, 0.07]} />
        <meshStandardMaterial color={0x151515} roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[L.lote.frente / 2 + 0.28, 1.05, -0.02]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={0x0a0a0a} roughness={0.4} metalness={0.5} />
      </mesh>
    </group>
  );
}
