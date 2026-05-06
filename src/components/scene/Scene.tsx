import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { SCENARIOS } from '../../config/scenarios';
import { PAL } from '../../config/palettes';
import { L, cx, cz } from '../../config/constants';

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
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  const center = new THREE.Vector3(L.lote.frente / 2, 0, L.lote.fondoIzq / 2);

  useEffect(() => {
    if (!controlsRef.current) return;
    
    // Simple camera transitions
    let pos = [0,0,0];
    switch(view) {
      case 'front': pos = [center.x, 2, -10]; break;
      case 'iso': pos = [15, 12, 20]; break;
      case 'top': pos = [center.x, 25, center.z]; break;
      case 'back': pos = [center.x, 2, 25]; break;
    }
    
    camera.position.set(pos[0], pos[1], pos[2]);
    controlsRef.current.target.copy(center);
    controlsRef.current.update();
  }, [view]);

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
