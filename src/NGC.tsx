import { lazy, Suspense, useMemo, useState } from 'react'
import { TacticalC2Overlay } from './components/TacticalC2Overlay'
import { OrbitalPropagator, DEFAULT_LEO_STATE } from './engine/OrbitalResilience'
import { C2_THREE_COLORS } from './tokens/c2-design-system'

export type SensorMode = 'OPTICAL' | 'SAR' | 'THERMAL'
export type Vec3 = { x: number; y: number; z: number }

const SAFE_BURN_DELTA_V = 400
const CONJUNCTION_TIME = 13_500
const STAGE_SCALE = 1e-6
const ORBIT_SEGMENTS = 96
const ORBIT_STEP_SECONDS = 180

const OrbitalScene = lazy(() =>
  import('./components/OrbitalScene').then((module) => ({ default: module.OrbitalScene })),
)

const seededUnit = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

const seededRotation = (seed: number): [number, number, number] => {
  return [
    seededUnit(seed) * Math.PI * 2,
    seededUnit(seed + 1) * Math.PI * 2,
    seededUnit(seed + 2) * Math.PI * 2,
  ]
}

const fnv1a = (input: string) => {
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

const toVec3 = (state: { x: number; y: number; z: number }): Vec3 => ({
  x: state.x * STAGE_SCALE,
  y: state.y * STAGE_SCALE,
  z: state.z * STAGE_SCALE,
})

export const NGC = () => {
  const [active, setActive] = useState(false)
  const [conjunction, setConjunction] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationHash, setVerificationHash] = useState<string | null>(null)
  const [sensorMode, setSensorMode] = useState<SensorMode>('OPTICAL')
  const [mitigated, setMitigated] = useState(false)
  const [replayStarted, setReplayStarted] = useState(false)
  const [hoveredDebris, setHoveredDebris] = useState(false)

  const propagator = useMemo(() => new OrbitalPropagator(), [])

  const initialOrbitState = useMemo(
    () =>
      conjunction
        ? DEFAULT_LEO_STATE
        : { ...DEFAULT_LEO_STATE, vy: DEFAULT_LEO_STATE.vy + SAFE_BURN_DELTA_V },
    [conjunction],
  )

  const mitigationOrbitState = useMemo(
    () => ({ ...DEFAULT_LEO_STATE, vy: DEFAULT_LEO_STATE.vy + SAFE_BURN_DELTA_V }),
    [],
  )

  const satellitePosition = useMemo(() => {
    const state = propagator.getStateAt(initialOrbitState, currentTime)
    return toVec3(state)
  }, [currentTime, initialOrbitState, propagator])

  const threatOrbitPoints = useMemo(
    () => propagator.generateOrbitPoints(DEFAULT_LEO_STATE, ORBIT_SEGMENTS, ORBIT_STEP_SECONDS),
    [propagator],
  )

  const mitigationOrbitPoints = useMemo(
    () => propagator.generateOrbitPoints(mitigationOrbitState, ORBIT_SEGMENTS, ORBIT_STEP_SECONDS),
    [mitigationOrbitState, propagator],
  )

  const debrisPosition = useMemo(() => {
    const state = propagator.getStateAt(DEFAULT_LEO_STATE, CONJUNCTION_TIME)
    return toVec3(state)
  }, [propagator])

  const debrisRotation = useMemo(() => seededRotation(17), [])

  const orbitColor = useMemo(() => {
    if (sensorMode === 'SAR') return C2_THREE_COLORS.orbitSAR
    if (sensorMode === 'THERMAL') return C2_THREE_COLORS.orbitThermal
    return conjunction ? C2_THREE_COLORS.orbitOpticalConjunction : C2_THREE_COLORS.orbitOpticalSafe
  }, [conjunction, sensorMode])

  const sceneFallback = (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(88,166,255,0.18),rgba(5,8,20,0.95)_70%)]">
      <div className="rounded-[24px] border border-white/10 bg-black/35 px-5 py-4 text-center backdrop-blur-xl">
        <div className="text-xs uppercase tracking-[0.35em] text-white/45">3D scene loading</div>
        <div className="mt-2 text-sm text-white/70">Initializing orbital visualization</div>
      </div>
    </div>
  )

  const handleVerify = () => {
    setIsVerifying(true)
    setVerificationHash(null)

    window.setTimeout(() => {
      const snapshot = [
        sensorMode,
        conjunction ? 'CONJUNCTION' : 'CLEAR',
        currentTime.toFixed(0),
        satellitePosition.x.toFixed(4),
        satellitePosition.y.toFixed(4),
        satellitePosition.z.toFixed(4),
      ].join('|')
      const token = fnv1a(snapshot).toString(16).toUpperCase().padStart(8, '0')
      setVerificationHash(`NGC-AUDIT-${token}`)
      setIsVerifying(false)
    }, 900)
  }

  const handleMitigate = () => {
    setConjunction(false)
    setMitigated(true)
    setActive(true)
  }

  const handleExportReport = () => {
    const report = {
      mission: 'NGC Mission Dashboard',
      mode: sensorMode,
      conjunction_watch: conjunction,
      mitigation_applied: active,
      current_time_s: currentTime,
      orbit_state: {
        x_m: satellitePosition.x * 1e6,
        y_m: satellitePosition.y * 1e6,
        z_m: satellitePosition.z * 1e6,
      },
      verification_state: verificationHash ? 'VERIFIED' : isVerifying ? 'SCANNING' : 'UNVERIFIED',
      verification_hash: verificationHash ?? 'PENDING',
      simulation_disclosure: {
        deterministic_replay: true,
        conjunction_probability_model: 'display-only',
        maneuver_solution: 'display-only',
        covariance_model: 'simplified',
      },
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `NGC_MISSION_REPORT_${new Date().getTime()}.json`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="relative min-h-screen overflow-y-auto bg-[radial-gradient(circle_at_top,#17264d_0%,#09111f_42%,#03050b_100%)] text-white lg:overflow-hidden">
      <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:28px_28px]" />
      <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(88,166,255,0.22),transparent_72%)]" />

      <Suspense fallback={sceneFallback}>
        <OrbitalScene
          active={active || isVerifying}
          conjunction={conjunction}
          currentTime={currentTime}
          satellitePosition={satellitePosition}
          threatOrbitPoints={threatOrbitPoints}
          mitigationOrbitPoints={mitigationOrbitPoints}
          orbitColor={orbitColor}
          sensorMode={sensorMode}
          hoveredDebris={hoveredDebris}
          setHoveredDebris={setHoveredDebris}
          onOrbitalInteract={() => setActive((value) => !value)}
          debrisPosition={debrisPosition}
          debrisRotation={debrisRotation}
          dimOrb={conjunction || !replayStarted}
        />
      </Suspense>

      <TacticalC2Overlay
        active={active}
        conjunction={conjunction}
        mitigated={mitigated}
        replayStarted={replayStarted}
        onMitigate={handleMitigate}
        onBeginReplay={() => setReplayStarted(true)}
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
  )
}
