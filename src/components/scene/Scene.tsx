import React, { useRef, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { SCENARIOS } from '../../config/scenarios';
import { PAL } from '../../config/palettes';
import { L } from '../../config/constants';

import { Terrain } from './Terrain';
import { Perimeter } from './Perimeter';
import { Neighbors } from './Neighbors';
import { ExistingHouse } from './ExistingHouse';
import { Roof } from './Roof';
import { Cubo } from './Cubo';
import { Ampliaciones } from './Ampliaciones';
import { Fence } from './Fence';

export function Scene() {
  const { scenario, toggles, view } = useStore();
  const activeScenario = SCENARIOS[scenario];
  const palette = PAL[activeScenario.paleta];
  const controlsRef = useRef<React.ElementRef<typeof OrbitControls>>(null);
  const { camera } = useThree();

  const center = useMemo(() => new THREE.Vector3(L.lote.frente / 2, 0, L.lote.fondoIzq / 2), []);

  useEffect(() => {
    if (!controlsRef.current) return;
    
    let pos: [number, number, number] = [0, 0, 0];
    const target = center.clone();
    switch(view) {
      case 'front':
        pos = [center.x, 3.1, -8.5];
        target.set(center.x, 3.05, L.antejardinMin + 0.35);
        break;
      case 'side':
        pos = [-3.5, 2.15, L.antejardinMin + 1.1];
        target.set(L.lote.frente / 2, 3.7, L.antejardinMin + 2.8);
        break;
      case 'iso':
        pos = [15, 12, 20];
        break;
      case 'top':
        pos = [center.x, 25, center.z];
        break;
      case 'back':
        pos = [center.x, 2.6, 25];
        target.set(center.x, 2.3, L.antejardinMin + L.casa.fondo);
        break;
    }
    
    camera.position.set(pos[0], pos[1], pos[2]);
    controlsRef.current.target.copy(target);
    controlsRef.current.update();
  }, [camera.position, center, view]);

  return (
    <>
      <color attach="background" args={['#c8d8e8']} />
      <fog attach="fog" args={['#c8d8e8', 60, 140]} />
      
      <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[20, 30, 20]} 
        intensity={1.2} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-20, 20, -20]} intensity={0.5} />

      <OrbitControls ref={controlsRef} makeDefault />

      <group position={[0, 0, 0]}>
        {toggles.terrain && <Terrain />}
        {toggles.perimeter && <Perimeter />}
        {toggles.neighbors && <Neighbors palette={palette} />}
        
        {toggles.existing && <ExistingHouse palette={palette} isActual={scenario === 'actual'} />}
        {toggles.roof && <Roof palette={palette} isActual={scenario === 'actual'} />}
        
        {toggles.cube1 && activeScenario.cubo && (
          <Cubo level={1} data={activeScenario.cubo} palette={palette} isMed={activeScenario.paleta === 'med'} />
        )}
        {toggles.cube2 && activeScenario.cubo && activeScenario.cubo.pisos === 2 && (
          <Cubo level={2} data={activeScenario.cubo} palette={palette} isMed={activeScenario.paleta === 'med'} />
        )}

        <Ampliaciones 
          scenario={activeScenario} 
          palette={palette} 
          toggles={toggles} 
        />
        
        {toggles.fence && activeScenario.fence && <Fence />}
      </group>
    </>
  );
}
