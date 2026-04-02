import { useMemo } from 'react'
import type { SensorMode, Vec3 } from '../NGC'
import { C2_COLORS, C2_THREE_COLORS } from '../tokens/c2-design-system'

export interface OrbitalSceneProps {
  active: boolean
  conjunction: boolean
  currentTime: number
  satellitePosition: Vec3
  threatOrbitPoints: [number, number, number][]
  mitigationOrbitPoints: [number, number, number][]
  orbitColor: string
  sensorMode: SensorMode
  hoveredDebris: boolean
  setHoveredDebris: (hovered: boolean) => void
  onOrbitalInteract: () => void
  debrisPosition: Vec3
  debrisRotation: [number, number, number]
}

type Star = {
  cx: number
  cy: number
  r: number
  opacity: number
}

const viewBoxSize = 100
const center = 50
const orbitScale = 5.15

const toPoint = (vector: Vec3) => ({
  x: center + vector.x * orbitScale,
  y: center - vector.y * orbitScale,
})

const buildStars = (): Star[] => {
  const stars: Star[] = []
  for (let index = 0; index < 26; index += 1) {
    const seed = index + 7
    stars.push({
      cx: 8 + ((seed * 17) % 84),
      cy: 8 + ((seed * 29) % 72),
      r: 0.15 + ((seed * 13) % 3) * 0.1,
      opacity: 0.28 + ((seed * 11) % 5) * 0.09,
    })
  }
  return stars
}

const ResilienceOrb = ({
  active,
  sensorMode,
  onOrbitalInteract,
}: {
  active: boolean
  sensorMode: SensorMode
  onOrbitalInteract: () => void
}) => {
  const tone =
    sensorMode === 'SAR' ? 'var(--color-c2-accent-green)' : sensorMode === 'THERMAL' ? 'var(--color-c2-accent-amber)' : 'var(--color-c2-accent-blue)'

  return (
    <button
      type="button"
      onClick={onOrbitalInteract}
      aria-pressed={active}
      className="pointer-events-auto absolute left-1/2 top-1/2 z-50 flex aspect-square w-[min(34vw,23rem)] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-transparent p-0 outline-none transition-transform duration-300 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-white/70 touch-manipulation"
      aria-label="Toggle orbital core"
    >
      <span
        className="absolute inset-[8%] rounded-full blur-[2px]"
        style={{
          background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.55), rgba(255,255,255,0.08) 25%, rgba(0,0,0,0) 72%), radial-gradient(circle at center, ${tone}33, rgba(0,0,0,0.08) 55%, rgba(0,0,0,0.32) 100%)`,
          boxShadow: active ? `0 0 40px ${tone}55, inset 0 0 40px rgba(255,255,255,0.08)` : 'inset 0 0 24px rgba(255,255,255,0.08)',
        }}
      />
      <span
        className="absolute inset-[16%] rounded-full border"
        style={{
          borderColor: `${tone}66`,
          boxShadow: `0 0 20px ${tone}22`,
          background:
            'radial-gradient(circle at 38% 32%, rgba(255,255,255,0.35), rgba(255,255,255,0.06) 22%, rgba(11,16,27,0.92) 72%)',
        }}
      />
      <span
        className="absolute inset-[28%] rounded-full"
        style={{
          background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.4), rgba(255,255,255,0.05) 28%, ${tone}aa 70%, ${tone}44 100%)`,
          boxShadow: active ? `0 0 18px ${tone}99` : 'none',
        }}
      />
      <span className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[0.7rem] uppercase tracking-[0.24em] text-white/75 backdrop-blur-md">
        {sensorMode} core
      </span>
      <span
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.26em] backdrop-blur-md ${
          active ? 'border border-c2-accent-green/30 bg-c2-accent-green/15 text-c2-accent-green' : 'border border-white/10 bg-black/35 text-white/60'
        }`}
      >
        {active ? 'ACTIVE' : 'IDLE'}
      </span>
    </button>
  )
}

const orbitPath = (points: [number, number, number][]) =>
  points
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${center + x * orbitScale} ${center - y * orbitScale}`)
    .join(' ')

export const OrbitalScene = ({
  active,
  conjunction,
  currentTime,
  satellitePosition,
  threatOrbitPoints,
  mitigationOrbitPoints,
  orbitColor,
  sensorMode,
  hoveredDebris,
  setHoveredDebris,
  onOrbitalInteract,
  debrisPosition,
  debrisRotation,
}: OrbitalSceneProps) => {
  const stars = useMemo(() => buildStars(), [])
  const satellite = useMemo(() => toPoint(satellitePosition), [satellitePosition])
  const debris = useMemo(() => toPoint(debrisPosition), [debrisPosition])
  const pathD = useMemo(
    () => orbitPath(conjunction ? threatOrbitPoints : mitigationOrbitPoints),
    [conjunction, mitigationOrbitPoints, threatOrbitPoints],
  )

  const hazardTone = hoveredDebris ? C2_THREE_COLORS.orbitOpticalConjunction : C2_COLORS.accentBlue

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,166,255,0.16),rgba(3,5,11,0.08)_24%,rgba(3,5,11,0.92)_72%)]" />
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:radial-gradient(circle_at_center,black_36%,transparent_100%)]" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="orbitalGlow" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
            <stop offset="22%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="62%" stopColor="rgba(88,166,255,0.16)" />
            <stop offset="100%" stopColor="rgba(3,5,11,0)" />
          </radialGradient>
          <filter id="softBlur">
            <feGaussianBlur stdDeviation="0.7" />
          </filter>
        </defs>

        {stars.map((star) => (
          <circle key={`${star.cx}-${star.cy}`} cx={star.cx} cy={star.cy} r={star.r} fill="#f6fbff" opacity={star.opacity} />
        ))}

        <circle cx={center} cy={center} r={36} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.2" />
        <circle cx={center} cy={center} r={29} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.15" />

        <path
          d={pathD}
          fill="none"
          stroke={orbitColor}
          strokeWidth="0.6"
          strokeDasharray={conjunction ? '1.2 0.9' : 'none'}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={conjunction ? 0.95 : 0.82}
          filter="url(#softBlur)"
          style={{ strokeDashoffset: currentTime * 0.01 }}
        />

        <circle cx={satellite.x} cy={satellite.y} r="1.0" fill={orbitColor} />
        <circle cx={satellite.x} cy={satellite.y} r="2.0" fill={orbitColor} opacity="0.12" />
        <line x1={center} y1={center} x2={satellite.x} y2={satellite.y} stroke={orbitColor} strokeWidth="0.18" opacity="0.2" />

        {conjunction && (
          <g
            transform={`translate(${debris.x} ${debris.y}) rotate(${(debrisRotation[0] + debrisRotation[1]) * 45})`}
            onPointerEnter={() => setHoveredDebris(true)}
            onPointerLeave={() => setHoveredDebris(false)}
          >
            <circle r="1.15" fill="#808792" />
            <circle r="3.1" fill={hazardTone} opacity="0.12" />
            <circle
              r="3.1"
              fill="none"
              stroke={hazardTone}
              strokeWidth="0.18"
              opacity={hoveredDebris ? 0.72 : 0.28}
              strokeDasharray="0.5 0.35"
            />
          </g>
        )}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <ResilienceOrb active={active} sensorMode={sensorMode} onOrbitalInteract={onOrbitalInteract} />
      </div>

      <div className="pointer-events-none absolute left-6 top-6 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-white/55 backdrop-blur-md">
        deterministic replay
      </div>
    </div>
  )
}
