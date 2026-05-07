import React from 'react';
import * as THREE from 'three';
import { L } from '../../config/constants';

export function Fence() {
  const altReja = 2.05;
  const n = Math.floor(L.lote.frente / 0.24);

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
      {/* Muretes bajos laterales */}
      <mesh position={[1.05, 0.55, 0.08]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 1.1, 0.18]} />
        <meshStandardMaterial color={0xb9b9b3} roughness={0.9} />
      </mesh>
      <mesh position={[L.lote.frente - 1.05, 0.55, 0.08]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 1.1, 0.18]} />
        <meshStandardMaterial color={0xb9b9b3} roughness={0.9} />
      </mesh>

      {/* Travesaños metálicos */}
      <mesh position={[L.lote.frente / 2, 0.32, -0.02]}>
        <boxGeometry args={[L.lote.frente, 0.055, 0.045]} />
        <meshStandardMaterial color={0x222222} roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[L.lote.frente / 2, altReja - 0.34, -0.02]}>
        <boxGeometry args={[L.lote.frente, 0.055, 0.045]} />
        <meshStandardMaterial color={0x222222} roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Barrotes Instanced */}
      <instancedMesh ref={instancedMeshRef} args={[undefined, undefined, n]} castShadow>
        <boxGeometry args={[0.035, altReja + 0.12, 0.035]} />
        <meshStandardMaterial color={0x222222} roughness={0.5} metalness={0.4} />
      </instancedMesh>

      {/* Marco del portón peatonal central */}
      <mesh position={[L.lote.frente / 2, altReja / 2, -0.045]} castShadow>
        <boxGeometry args={[1.05, altReja, 0.055]} />
        <meshStandardMaterial color={0x151515} roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[L.lote.frente / 2, altReja / 2, -0.075]}>
        <boxGeometry args={[0.86, altReja - 0.18, 0.065]} />
        <meshStandardMaterial color={0x111111} roughness={0.45} metalness={0.45} transparent opacity={0.18} />
      </mesh>
      <mesh position={[L.lote.frente / 2 + 0.34, 1.02, -0.1]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={0x0a0a0a} roughness={0.4} metalness={0.5} />
      </mesh>
    </group>
  );
}
