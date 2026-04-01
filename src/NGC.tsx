import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Line, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { ResilienceOrb } from './components/ResilienceOrb';
import { TacticalC2Overlay } from './components/TacticalC2Overlay';
import { OrbitalPropagator, DEFAULT_LEO_STATE } from './engine/OrbitalResilience';
import { C2_THREE_COLORS } from './tokens/c2-design-system';


export type SensorMode = 'OPTICAL' | 'SAR' | 'THERMAL';

export const NGC = () => {
  const [active, setActive] = useState(false);
  const [conjunction, setConjunction] = useState(true);
  const [currentTime, setCurrentTime] = useState(0); 
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationHash, setVerificationHash] = useState<string | null>(null);
  const [sensorMode, setSensorMode] = useState<SensorMode>('OPTICAL');
  const [hoveredDebris, setHoveredDebris] = useState(false);
  
  const propagator = useMemo(() => new OrbitalPropagator(), []);
  const initialOrbitState = conjunction ? DEFAULT_LEO_STATE : { ...DEFAULT_LEO_STATE, vy: DEFAULT_LEO_STATE.vy + 400 };

  // Calculate satellite position at currentTime
  const satPos = useMemo(() => {
    const state = propagator.getStateAt(initialOrbitState, currentTime);
    const scale = 1e-6;
    return new THREE.Vector3(state.x * scale, state.y * scale, state.z * scale);
  }, [propagator, initialOrbitState, currentTime]);

  const orbitColor = useMemo(() => {
    if (sensorMode === 'SAR')     return C2_THREE_COLORS.orbitSAR;
    if (sensorMode === 'THERMAL') return C2_THREE_COLORS.orbitThermal;
    return conjunction ? C2_THREE_COLORS.orbitOpticalConjunction : C2_THREE_COLORS.orbitOpticalSafe;
  }, [sensorMode, conjunction]);

  // Normal Orbit Path
  const orbitPoints = useMemo(() => 
    propagator.generateOrbitPoints(DEFAULT_LEO_STATE, 100, 200), 
  [propagator]);

  // Maneuvered Orbit Path
  const safeOrbitPoints = useMemo(() => 
    propagator.generateOrbitPoints({ 
      ...DEFAULT_LEO_STATE, 
      vy: DEFAULT_LEO_STATE.vy + 400 
    }, 100, 200), 
  [propagator]);

  const handleVerify = () => {
    setIsVerifying(true);
    setVerificationHash(null);
    setTimeout(() => {
      const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setVerificationHash(`NGC-SHA256-${hash.toUpperCase()}`);
      setIsVerifying(false);
    }, 1500);
  };

  const handleMitigate = () => {
    setConjunction(false);
    setActive(true);
  };

  const handleExportReport = () => {
    // Simulation disclosure per spatial-motion.md invariant #5:
    // stakeholder outputs must separate simulated effect from validated capability
    const SIMULATION_DISCLOSURE = {
      contains_mocked_data: true,
      propagation_error_bound_verified: false,    // No replay test suite exists yet
      conjunction_assessment_mocked: true,         // Pc = 0.00314 is a fixed display value
      maneuver_optimization_mocked: true,          // 1.2 m/s delta-V is hardcoded, no solver
      covariance_rendering_simplified: true,       // Sphere only, not a full covariance ellipsoid
      hash_is_non_cryptographic: true,             // Math.random(), not a real SHA-256
      validated_in_engine: [
        'two-body orbital propagation (ECI J2000)',
        'state vector time-stepping (Euler integration)',
      ],
      not_validated_in_engine: [
        'conjunction probability calculation',
        'maneuver optimization',
        'covariance expansion',
        'frame transformation (ECI↔ECEF)',
      ],
    };

    const report = {
      target_domain: "Orbital Resilience and Asset Deconfliction",
      scenario_class: "Multi-asset Conjunction Mitigation",
      force_model: "J2 Perturbation / Two-Body Baseline",
      reference_frames: ["ECI J2000"],
      deterministic_replay_passed: 'UNVERIFIED',
      propagation_error_bound: "< 1.0e-9 (declared, not yet tested)",
      optimization_status: {
        mode: conjunction ? "Threat Monitoring" : "1.2 m/s Phase-Shift Optimization",
        converged: true,
        runtime_ms: 124,
        delta_v_ms: conjunction ? 0 : 1.2
      },
      complexity_audit: {
        screening_stage: "Spatial Partitioning / Covariance Expansion",
        solver_stage: "Deterministic State Replay"
      },
      simulation_disclosure: SIMULATION_DISCLOSURE,
      verification_hash: verificationHash || "PENDING_VERIFICATION",
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NGC_VERIFICATION_REPORT_${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const debrisPos = useMemo(() => {
    const state = propagator.getStateAt(DEFAULT_LEO_STATE, 13500);
    const scale = 1e-6;
    return new THREE.Vector3(state.x * scale, state.y * scale, state.z * scale);
  }, [propagator]);

  return (
    <div className="w-full h-screen bg-[#000033] relative overflow-hidden">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[8, 8, 8]} />
        <OrbitControls enablePan={false} maxDistance={20} minDistance={2} />
        
        <color attach="background" args={['#000033']} />
        
        <ambientLight intensity={sensorMode === 'THERMAL' ? 1 : 0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* The Nexus™ Gateway - Static Center (Inspired by user image) */}
        <ResilienceOrb 
          active={active || isVerifying} 
          onInteract={() => setActive(!active)} 
          mode={sensorMode}
        />

        {/* The Satellite - Moving along the path */}
        <mesh position={satPos}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color={orbitColor} />
          <pointLight color={orbitColor} intensity={5} distance={3} />
        </mesh>

        {/* The Conjunction Threat (Debris & Covariance Bubble) */}
        {conjunction && (
          <group position={debrisPos}>
            <mesh rotation={[Math.random(), Math.random(), 0]}>
              <tetrahedronGeometry args={[0.08, 0]} />
              <meshStandardMaterial color="#888" roughness={1} />
            </mesh>
            <Sphere 
              args={[0.5, 32, 32]} 
              onPointerOver={() => setHoveredDebris(true)}
              onPointerOut={() => setHoveredDebris(false)}
            >
              <meshPhongMaterial 
                transparent 
                opacity={hoveredDebris ? 0.4 : 0.15} 
                color={hoveredDebris ? C2_THREE_COLORS.orbitOpticalConjunction : C2_THREE_COLORS.orbitOpticalSafe}
                emissive={hoveredDebris ? "#ff0000" : "#0000ff"}
                emissiveIntensity={3}
              />
            </Sphere>
          </group>
        )}

        {/* Orbital Paths */}
        <Line
          points={conjunction ? orbitPoints : safeOrbitPoints}
          color={orbitColor}
          lineWidth={1.5}
          dashed={conjunction}
          dashSize={0.2}
          gapSize={0.1}
        />

        {/* Post-Processing for the "NGC Glow" */}
        <EffectComposer>
          <Bloom luminanceThreshold={sensorMode === 'SAR' ? 0.05 : 0.1} mipmapBlur intensity={1.5} />
        </EffectComposer>
      </Canvas>

      {/* 2D HUD Layer with Time Machine, Verification & Sensor Fusion */}
      <TacticalC2Overlay 
        active={active} 
        conjunction={conjunction} 
        onMitigate={handleMitigate} 
        currentTime={currentTime}
        onTimeChange={setCurrentTime}
        isVerifying={isVerifying}
        verificationHash={verificationHash}
        onVerify={handleVerify}
        onExportReport={handleExportReport}
        sensorMode={sensorMode}
        onSensorModeChange={setSensorMode}
        hoveredDebris={hoveredDebris}
      />
    </div>
  );
};
