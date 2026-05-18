import { L, cx } from '../../config/constants';

function Box({ position, args, color, opacity = 1, rotation = [0, 0, 0] }: {
  position: [number, number, number];
  args: [number, number, number];
  color: number;
  opacity?: number;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.55} metalness={0.35} transparent={opacity < 1} opacity={opacity} />
    </mesh>
  );
}

function Pickets({ x0, x1, z = 0.02, height = 2.18, spacing = 0.18 }: { x0: number; x1: number; z?: number; height?: number; spacing?: number }) {
  const width = Math.max(0, x1 - x0);
  const count = Math.max(1, Math.floor(width / spacing));

  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const x = x0 + ((i + 0.5) * width) / count;
        return <Box key={`${x0}-${i}`} position={[x, height / 2 + 0.08, z]} args={[0.045, height, 0.045]} color={0x0b0b0b} />;
      })}
    </group>
  );
}

function Rail({ x0, x1, y, z = 0.02 }: { x0: number; x1: number; y: number; z?: number }) {
  return <Box position={[(x0 + x1) / 2, y, z]} args={[x1 - x0, 0.06, 0.05]} color={0x0b0b0b} />;
}

function DiagonalRail({ y }: { y: number }) {
  const cut = L.lote.chaflanDer;
  const len = Math.hypot(cut.frente, cut.fondo);
  return (
    <Box
      position={[L.lote.frente - cut.frente / 2, y, cut.fondo / 2]}
      args={[len, 0.055, 0.045]}
      rotation={[0, -Math.atan2(cut.fondo, cut.frente), 0]}
      color={0x111111}
    />
  );
}

function DiagonalPickets({ height = 2.18, spacing = 0.18 }: { height?: number; spacing?: number }) {
  const cut = L.lote.chaflanDer;
  const len = Math.hypot(cut.frente, cut.fondo);
  const count = Math.max(1, Math.floor(len / spacing));
  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const t = (i + 0.5) / count;
        return (
          <Box
            key={`diag-${i}`}
            position={[L.lote.frente - cut.frente + cut.frente * t, height / 2 + 0.08, cut.fondo * t]}
            args={[0.035, height, 0.035]}
            color={0x111111}
          />
        );
      })}
    </group>
  );
}

function SlidingCarGate({ x0, x1 }: { x0: number; x1: number }) {
  return (
    <group>
      <Rail x0={x0} x1={x1} y={0.34} z={-0.04} />
      <Rail x0={x0} x1={x1} y={1.62} z={-0.04} />
      <Pickets x0={x0 + 0.08} x1={x1 - 0.08} z={-0.04} height={2.05} spacing={0.18} />
      <Box position={[x0, 1.1, -0.04]} args={[0.09, 2.15, 0.07]} color={0x0b0b0b} />
      <Box position={[x1, 1.1, -0.04]} args={[0.09, 2.15, 0.07]} color={0x0b0b0b} />
      <Box position={[(x0 + x1) / 2, 0.08, -0.08]} args={[x1 - x0 + 0.22, 0.05, 0.08]} color={0x0b0b0b} />
    </group>
  );
}

function PedestrianGate({ center, width }: { center: number; width: number }) {
  const x0 = center - width / 2;
  const x1 = center + width / 2;

  return (
    <group>
      <Rail x0={x0} x1={x1} y={0.34} z={-0.035} />
      <Rail x0={x0} x1={x1} y={1.58} z={-0.035} />
      <Pickets x0={x0 + 0.08} x1={x1 - 0.08} z={-0.035} height={2.02} spacing={0.17} />
      <Box position={[x0, 1.08, -0.035]} args={[0.08, 2.12, 0.06]} color={0x0b0b0b} />
      <Box position={[x1, 1.08, -0.035]} args={[0.08, 2.12, 0.06]} color={0x0b0b0b} />
      <mesh position={[x1 - 0.18, 0.96, -0.09]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={0x050505} roughness={0.35} metalness={0.5} />
      </mesh>
    </group>
  );
}

type FenceProps = {
  hideVisualLeftSide?: boolean;
};

export function Fence({ hideVisualLeftSide = false }: FenceProps) {
  const carGateX0 = 0.18;
  const carGateX1 = Math.max(carGateX0 + 2.35, cx - 0.12);
  const pedestrianWidth = 0.95;
  const pedestrianCenter = L.lote.frente / 2;
  const pedestrianX0 = pedestrianCenter - pedestrianWidth / 2;
  const pedestrianX1 = pedestrianCenter + pedestrianWidth / 2;
  const frontEndX = L.lote.frente - L.lote.chaflanDer.frente;

  return (
    <group>
      <Box position={[frontEndX / 2, 0.34, 0.08]} args={[frontEndX, 0.68, 0.18]} color={0xb9b9b3} opacity={0.9} />
      <Box
        position={[L.lote.frente - L.lote.chaflanDer.frente / 2, 0.34, L.lote.chaflanDer.fondo / 2]}
        args={[Math.hypot(L.lote.chaflanDer.frente, L.lote.chaflanDer.fondo), 0.68, 0.18]}
        rotation={[0, -Math.atan2(L.lote.chaflanDer.fondo, L.lote.chaflanDer.frente), 0]}
        color={0xb9b9b3}
        opacity={0.9}
      />

      <Rail x0={0.05} x1={carGateX0} y={0.34} />
      <Rail x0={carGateX1} x1={pedestrianX0} y={0.34} />
      <Rail x0={0.05} x1={carGateX0} y={1.76} />
      <Rail x0={carGateX1} x1={pedestrianX0} y={1.76} />

      <Pickets x0={0.05} x1={carGateX0} />
      <Pickets x0={carGateX1} x1={pedestrianX0} />

      {!hideVisualLeftSide && (
        <>
          <Rail x0={pedestrianX1} x1={frontEndX - 0.05} y={0.34} />
          <Rail x0={pedestrianX1} x1={frontEndX - 0.05} y={1.76} />
          <DiagonalRail y={0.34} />
          <DiagonalRail y={1.76} />
          <Pickets x0={pedestrianX1} x1={frontEndX - 0.05} />
          <DiagonalPickets />
        </>
      )}

      <SlidingCarGate x0={carGateX0} x1={carGateX1} />
      <PedestrianGate center={pedestrianCenter} width={pedestrianWidth} />
    </group>
  );
}
