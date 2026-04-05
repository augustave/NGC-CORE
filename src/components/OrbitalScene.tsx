import { useMemo, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
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
  dimOrb: boolean
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
  const prefersReducedMotion = useReducedMotion()
  const [activationPulse, setActivationPulse] = useState(0)
  const toneHex = sensorMode === 'SAR' ? C2_COLORS.accentGreen : sensorMode === 'THERMAL' ? C2_COLORS.accentAmber : C2_COLORS.accentBlue

  const handleClick = () => {
    if (!active) {
      setActivationPulse((value) => value + 1)
    }
    onOrbitalInteract()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      className={`pointer-events-auto absolute left-1/2 top-1/2 z-[70] flex aspect-square w-[min(34vw,23rem)] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-transparent p-0 outline-none transition-[transform,filter,box-shadow,border-color] duration-500 touch-manipulation ${
        active ? 'scale-[1.05] border-white/20' : 'hover:scale-[1.01]'
      }`}
      aria-label="Toggle orbital core"
    >
      {active && !prefersReducedMotion && (
        <span
          key={activationPulse}
          className="absolute inset-[2%] rounded-full border border-transparent"
          style={{
            boxShadow: `0 0 0.9rem ${toneHex}66, 0 0 3rem ${toneHex}22, inset 0 0 2.2rem rgba(255,255,255,0.12)`,
            animation: 'orbitalBurst 850ms ease-out forwards',
          }}
        />
      )}
      <span
        className="absolute inset-[1%] rounded-full opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 36%, rgba(0,0,0,0) 72%)`,
          opacity: active ? 1 : 0.35,
          boxShadow: active ? `0 0 4.5rem ${toneHex}22, inset 0 0 3rem ${toneHex}20` : 'inset 0 0 1.2rem rgba(255,255,255,0.05)',
          animation: active && !prefersReducedMotion ? 'orbitalHalo 4.2s ease-in-out infinite' : undefined,
        }}
      />
      <span
        className="absolute inset-[5%] rounded-full border border-white/5"
        style={{
          background: active
            ? `conic-gradient(from 180deg, ${toneHex}00 0deg, ${toneHex}44 50deg, rgba(255,255,255,0.88) 90deg, ${toneHex}88 150deg, ${toneHex}11 220deg, rgba(255,255,255,0.1) 300deg, ${toneHex}00 360deg)`
            : 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
          opacity: active ? 1 : 0.7,
          mixBlendMode: active ? 'screen' : 'normal',
          filter: active ? 'saturate(1.2)' : 'none',
          animation: active && !prefersReducedMotion ? 'orbitalSweep 8s linear infinite' : undefined,
        }}
      />
      <span
        className="absolute inset-[8%] rounded-full blur-[2px]"
        style={{
          background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.66), rgba(255,255,255,0.1) 25%, rgba(0,0,0,0) 72%), radial-gradient(circle at center, ${toneHex}${active ? '55' : '33'}, rgba(0,0,0,0.08) 58%, rgba(0,0,0,0.35) 100%)`,
          boxShadow: active ? `0 0 52px ${toneHex}66, inset 0 0 44px rgba(255,255,255,0.12)` : 'inset 0 0 24px rgba(255,255,255,0.08)',
          transform: active ? 'scale(1.03)' : 'scale(1)',
          transition: 'transform 450ms ease, box-shadow 450ms ease, background 450ms ease',
        }}
      />
      <span
        className="absolute inset-[16%] rounded-full border"
        style={{
          borderColor: active ? `${toneHex}aa` : `${toneHex}66`,
          boxShadow: active ? `0 0 34px ${toneHex}44, inset 0 0 20px rgba(255,255,255,0.06)` : `0 0 20px ${toneHex}22`,
          background:
            'radial-gradient(circle at 38% 32%, rgba(255,255,255,0.38), rgba(255,255,255,0.06) 22%, rgba(11,16,27,0.92) 72%)',
          transform: active ? 'scale(1.02)' : 'scale(1)',
          transition: 'transform 450ms ease, box-shadow 450ms ease, border-color 450ms ease',
        }}
      />
      <span
        className="absolute inset-[28%] rounded-full"
        style={{
          background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.48), rgba(255,255,255,0.08) 28%, ${toneHex}${active ? 'cc' : 'aa'} 70%, ${toneHex}${active ? '66' : '44'} 100%)`,
          boxShadow: active ? `0 0 28px ${toneHex}aa, inset 0 0 18px rgba(255,255,255,0.08)` : 'none',
          transform: active ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 450ms ease, box-shadow 450ms ease, background 450ms ease',
        }}
      />
      {active && !prefersReducedMotion && (
        <span
          className="absolute inset-[22%] rounded-full border border-white/20"
          style={{
            animation: 'orbitalRing 2.4s ease-in-out infinite',
            boxShadow: `0 0 22px ${toneHex}33`,
          }}
        />
      )}
      <span className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[0.7rem] uppercase tracking-[0.24em] text-white/75 backdrop-blur-md sm:block">
        {sensorMode} core
      </span>
      <span
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.26em] backdrop-blur-md ${
          active ? 'border border-c2-accent-green/40 bg-c2-accent-green/20 text-c2-accent-green' : 'border border-white/10 bg-black/35 text-white/60'
        }`}
      >
        {active ? 'ENGAGED' : 'STANDBY'}
      </span>
      <span
        className={`absolute top-7 left-1/2 hidden -translate-x-1/2 rounded-full border px-3 py-1 text-[0.6rem] uppercase tracking-[0.28em] backdrop-blur-md transition-all duration-300 sm:block ${
          active ? 'border-c2-accent-green/30 bg-c2-accent-green/15 text-c2-accent-green' : 'border-white/10 bg-black/30 text-white/45'
        }`}
      >
        {active ? 'ORBITAL CORE ENGAGED' : 'Core idle'}
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
  dimOrb,
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
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.85} />
            <stop offset="22%" stopColor="#ffffff" stopOpacity={0.35} />
            <stop offset="62%" stopColor="#58a6ff" stopOpacity={0.16} />
            <stop offset="100%" stopColor="#03050b" stopOpacity={0} />
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
          strokeDasharray={conjunction ? '1.2 0.9' : undefined}
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

      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${dimOrb ? 'pointer-events-none opacity-40' : ''}`}>
        <ResilienceOrb active={active} sensorMode={sensorMode} onOrbitalInteract={onOrbitalInteract} />
      </div>

      <div className="pointer-events-none absolute left-6 top-6 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-white/55 backdrop-blur-md">
        deterministic replay
      </div>
    </div>
  )
}
