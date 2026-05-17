import { Canvas } from '@react-three/fiber';
import { Scene } from './components/scene/Scene';
import { Overlay } from './components/ui/Overlay';
import './index.css'; // Let's make sure we have basic styles

function App() {
  return (
    <div className="app-container">
      <Overlay />
      <Canvas className="scene-canvas" shadows camera={{ position: [15, 12, 20], fov: 40 }}>
        <Scene />
      </Canvas>
    </div>
  );
}

export default App;
