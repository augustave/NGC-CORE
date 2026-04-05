import { useMemo } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Crosshair,
  Eye,
  FileText,
  Fingerprint,
  Layers,
  Radio,
  Search,
  Shield,
  Thermometer,
  Target,
  Zap,
} from 'lucide-react'
import type { SensorMode } from '../NGC'

export interface TacticalC2OverlayProps {
  active: boolean
  conjunction: boolean
  mitigated: boolean
  onMitigate: () => void
  currentTime: number
  onTimeChange: (time: number) => void
  isVerifying: boolean
  verificationHash: string | null
  onVerify: () => void
  onExportReport: () => void
  sensorMode: SensorMode
  onSensorModeChange: (mode: SensorMode) => void
  hoveredDebris: boolean
}

export const TacticalC2Overlay = ({
  active,
  conjunction,
  mitigated,
  onMitigate,
  currentTime,
  onTimeChange,
  isVerifying,
  verificationHash,
  onVerify,
  onExportReport,
  sensorMode,
  onSensorModeChange,
  hoveredDebris,
}: TacticalC2OverlayProps) => {
  const prefersReducedMotion = useReducedMotion()
  const sensorModes = [
    { id: 'OPTICAL' as const, icon: Eye },
    { id: 'SAR' as const, icon: Layers },
    { id: 'THERMAL' as const, icon: Thermometer },
  ]

  const altitude = useMemo(() => (7102.4 + Math.sin(currentTime * 0.01) * 5).toFixed(1), [currentTime])
  const velocity = useMemo(() => (7.52 - Math.cos(currentTime * 0.01) * 0.05).toFixed(2), [currentTime])

  const isNearingConjunction = conjunction && currentTime > 12_000 && currentTime < 15_000

  const tone = sensorMode === 'SAR' ? 'green' : sensorMode === 'THERMAL' ? 'amber' : 'blue'
  const accentColor =
    tone === 'green' ? 'text-c2-accent-green' : tone === 'amber' ? 'text-c2-accent-amber' : 'text-c2-accent-blue'
  const borderColor =
    tone === 'green' ? 'border-c2-accent-green/60' : tone === 'amber' ? 'border-c2-accent-amber/60' : 'border-c2-accent-blue/60'
  const surfaceBorder =
    tone === 'green' ? 'border-c2-accent-green/25' : tone === 'amber' ? 'border-c2-accent-amber/25' : 'border-c2-accent-blue/25'
  const statusText = conjunction ? 'CONJUNCTION WATCH' : mitigated ? 'MITIGATION APPLIED' : 'NOMINAL'

  return (
    <div className={`pointer-events-none relative z-[80] flex min-h-screen flex-col gap-4 overflow-y-auto p-4 sm:p-6 lg:absolute lg:inset-0 lg:min-h-0 lg:overflow-hidden lg:p-8 ${accentColor} transition-colors duration-300`}>
      <header className="pointer-events-auto flex flex-col gap-4 rounded-[28px] border border-white/10 bg-black/40 px-4 py-4 backdrop-blur-xl shadow-[0_16px_80px_rgba(0,0,0,0.35)] sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="text-[0.62rem] uppercase tracking-[0.28em] text-white/45 sm:text-[0.7rem] sm:tracking-[0.4em]">NGC Mission Dashboard</div>
            <div className={`rounded-full border px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.24em] ${surfaceBorder} bg-white/5 text-white/70 sm:px-3 sm:text-[0.65rem] sm:tracking-[0.35em]`}>
              Neptune-1
            </div>
          </div>
          <div className="max-w-xl text-[1.65rem] font-semibold leading-[1.02] tracking-[-0.03em] text-white sm:text-2xl">
            Orbital resilience and deconfliction
          </div>
          <div className="max-w-xl text-[0.92rem] text-white/55 sm:text-sm">
            Deterministic replay, sensor-band switching, and mitigation review in a single operator view.
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[430px]">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.3em] text-white/45">
              <span>System state</span>
              <Shield className="h-3.5 w-3.5" />
            </div>
            <div className={`mt-2 text-sm font-semibold uppercase tracking-[0.28em] ${conjunction ? 'text-c2-accent-red' : mitigated ? 'text-c2-accent-green' : 'text-c2-accent-green'}`}>
              {statusText}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.3em] text-white/45">
              <span>Integrity</span>
              <CheckCircle className="h-3.5 w-3.5" />
            </div>
            <div className="mt-2 text-sm font-semibold uppercase tracking-[0.22em] text-white">
              {verificationHash ?? (isVerifying ? 'Scanning...' : 'Pending')}
            </div>
          </div>
        </div>
      </header>

      <main className="pointer-events-none grid flex-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)_300px]">
        <section className="pointer-events-auto flex flex-col gap-4">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.28 }}
            className={`rounded-[28px] border ${borderColor} bg-black/45 p-4 backdrop-blur-xl shadow-[0_16px_60px_rgba(0,0,0,0.28)] sm:p-5`}
          >
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Activity className="h-4 w-4" />
              <span className="text-[0.9rem] font-semibold uppercase tracking-[0.22em] text-white sm:text-sm sm:tracking-[0.24em]">Sensor control</span>
            </div>

            <div className="mt-4 flex gap-2">
              {sensorModes.map((mode) => {
                const selected = sensorMode === mode.id

                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => onSensorModeChange(mode.id)}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-2xl border px-2.5 py-3 text-left text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:px-3 ${
                      selected ? `${surfaceBorder} bg-white/10` : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <mode.icon className="h-4 w-4" />
                    <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] sm:text-xs sm:tracking-[0.22em]">{mode.id}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/65">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-[0.6rem] uppercase tracking-[0.22em] text-white/45 sm:text-[0.65rem] sm:tracking-[0.28em]">Altitude</div>
                <div className="mt-1 text-[0.98rem] font-semibold text-white sm:text-base">{altitude} km</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-[0.6rem] uppercase tracking-[0.22em] text-white/45 sm:text-[0.65rem] sm:tracking-[0.28em]">Velocity</div>
                <div className="mt-1 text-[0.98rem] font-semibold text-white sm:text-base">{velocity} km/s</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-[0.6rem] uppercase tracking-[0.22em] text-white/45 sm:text-[0.65rem] sm:tracking-[0.28em]">Resolution</div>
                <div className="mt-1 text-[0.98rem] font-semibold text-white sm:text-base">{sensorMode === 'OPTICAL' ? '15 cm' : '30 cm'}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-[0.6rem] uppercase tracking-[0.22em] text-white/45 sm:text-[0.65rem] sm:tracking-[0.28em]">Time offset</div>
                <div className="mt-1 text-[0.98rem] font-semibold text-white sm:text-base">T+{currentTime}s</div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={onVerify}
                disabled={isVerifying}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-[0.85rem] font-semibold uppercase tracking-[0.16em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:text-sm sm:tracking-[0.22em] ${
                  isVerifying
                    ? 'border-white/10 bg-white/5 text-white/40'
                    : `${surfaceBorder} bg-white/5 text-white hover:bg-white/10`
                }`}
              >
                {isVerifying ? <Search className="h-4 w-4 animate-spin" /> : <Fingerprint className="h-4 w-4" />}
                {isVerifying ? 'Scanning integrity' : 'Verify integrity'}
              </button>

              <button
                type="button"
                onClick={onExportReport}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[0.85rem] font-semibold uppercase tracking-[0.16em] text-white/70 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:text-sm sm:tracking-[0.22em]"
              >
                <FileText className="h-4 w-4" />
                Export report
              </button>
            </div>
          </motion.div>

          <AnimatePresence>
            {hoveredDebris && (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="rounded-[24px] border border-red-500/30 bg-red-950/35 p-4 backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 text-red-300">
                  <Crosshair className="h-4 w-4" />
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] sm:text-xs sm:tracking-[0.24em]">Threat focus</span>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-white/65">
                  <div className="flex items-center justify-between">
                    <span>Pc</span>
                    <span className="font-semibold text-red-300">0.00314</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>d-miss</span>
                    <span className="font-semibold text-red-300">412.8 m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Envelope</span>
                    <span className="font-semibold text-red-300">±84.2 m</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="pointer-events-none flex flex-col justify-center gap-4">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-2 text-center">
            <AnimatePresence mode="wait">
              {conjunction ? (
                <motion.div
                  key="conjunction"
                  initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="pointer-events-auto relative z-[90] rounded-[28px] border border-red-500/30 bg-red-950/35 px-6 py-5 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-center gap-3 text-red-300">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] sm:text-xs sm:tracking-[0.3em]">Conjunction watch</span>
                  </div>
                  <div className="mt-3 text-[1.55rem] font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                    Alert window active
                  </div>
                  <div className="mt-2 text-[0.9rem] text-white/60 sm:text-sm">
                    Review the timeline, switch sensor bands, and initiate the mitigation sequence when ready.
                  </div>
                  <button
                    type="button"
                    onClick={onMitigate}
                    className="pointer-events-auto mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-red-500 px-5 py-3 text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 sm:text-sm sm:tracking-[0.22em]"
                  >
                    <Target className="h-4 w-4" />
                    Initiate mitigation
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="nominal"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="pointer-events-none rounded-[28px] border border-white/10 bg-black/25 px-6 py-5 backdrop-blur-xl"
                >
                    <div className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/45 sm:text-xs sm:tracking-[0.32em]">
                    Mission window
                  </div>
                  <div className="mt-3 text-[1.55rem] font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                    Clean orbit replay with live operator controls
                  </div>
                  <div className="mt-2 text-[0.9rem] text-white/60 sm:text-sm">
                    Use the scrubber to inspect state transitions and keep the visualization centered on decision-making.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid w-full grid-cols-2 gap-2 text-left sm:grid-cols-4 sm:gap-3">
              {[
                { label: 'Latency', value: '12 ms' },
                { label: 'Uplink', value: '4.2 GB/s' },
                { label: 'Deterministic', value: 'True' },
                { label: 'Mode', value: sensorMode },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-black/30 px-3 py-3 backdrop-blur-md sm:px-4">
                  <div className="text-[0.6rem] uppercase tracking-[0.22em] text-white/45 sm:text-[0.65rem] sm:tracking-[0.28em]">{item.label}</div>
                  <div className="mt-1 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-white sm:text-sm sm:tracking-[0.18em]">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pointer-events-auto flex flex-col gap-4">
          <div className="rounded-[28px] border border-white/10 bg-black/45 p-4 backdrop-blur-xl shadow-[0_16px_60px_rgba(0,0,0,0.28)] sm:p-5">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Clock className="h-4 w-4" />
              <span className="text-[0.9rem] font-semibold uppercase tracking-[0.22em] text-white sm:text-sm sm:tracking-[0.24em]">Timeline</span>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[0.92rem] text-white/75 sm:text-sm">
                <span>Replay phase</span>
                <span className="font-semibold text-white">{conjunction ? 'Threat window' : 'Mitigated orbit'}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[0.92rem] text-white/75 sm:text-sm">
                <span>Sensor band</span>
                <span className="font-semibold text-white">{sensorMode}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[0.92rem] text-white/75 sm:text-sm">
                <span>Integrity token</span>
                <span className="font-semibold text-white">{verificationHash ?? 'Pending'}</span>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[0.92rem] text-white/65 sm:text-sm">
              <div className="flex items-center gap-2 text-white/85">
                <Zap className="h-4 w-4 text-c2-accent-cyan" />
                Mission notes
              </div>
              <div className="mt-2 leading-relaxed">
                {conjunction
                  ? 'Conjunction watch active. Review the timeline and initiate mitigation when ready.'
                  : mitigated
                    ? '1.2 m/s delta-V applied. Orbit deconflicted. Verify section integrity and export report.'
                    : 'System nominal. No active conjunction threats detected in current window.'}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/45 p-4 backdrop-blur-xl shadow-[0_16px_60px_rgba(0,0,0,0.28)] sm:p-5">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Radio className="h-4 w-4" />
              <span className="text-[0.9rem] font-semibold uppercase tracking-[0.22em] text-white sm:text-sm sm:tracking-[0.24em]">Telemetry</span>
            </div>

            <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-[0.92rem] text-white/70 sm:text-sm">
              <div className="flex items-center gap-2 text-white/85">
                <Activity className="h-4 w-4" />
                Activity log
              </div>
              <div className="mt-3 space-y-2 text-white/60">
                <div>[SENSOR] {sensorMode} feed synchronized</div>
                <div>[T+{currentTime}s] Integrity check {isVerifying ? 'running' : verificationHash ? 'passed' : 'idle'}</div>
                <div>[T+{currentTime}s] Deterministic replay active</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="pointer-events-auto rounded-[28px] border border-white/10 bg-black/45 px-4 py-4 backdrop-blur-xl shadow-[0_16px_60px_rgba(0,0,0,0.28)] sm:px-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 text-[0.62rem] uppercase tracking-[0.18em] text-white/55 sm:flex-row sm:items-center sm:justify-between sm:text-[0.7rem] sm:tracking-[0.3em]">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              Temporal scrubber
            </div>
            <div className="hidden items-center gap-2 text-white/45 sm:flex">
              <Zap className="h-3.5 w-3.5 text-c2-accent-cyan" />
              Scrub to validate state transitions
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="20000"
            step="10"
            value={currentTime}
            onChange={(event) => onTimeChange(Number(event.target.value))}
            aria-label="Temporal scrubber"
            className="w-full accent-c2-accent-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/60">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.14em] text-white/70 sm:px-3 sm:text-sm sm:tracking-[0.2em]">
                T+{currentTime}s
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.14em] text-white/70 sm:px-3 sm:text-sm sm:tracking-[0.2em]">
                {conjunction ? 'Conjunction watch' : 'Mitigated orbit'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.14em] text-white/70 sm:px-3 sm:text-sm sm:tracking-[0.2em]">
                Latency 12 ms
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.14em] text-white/70 sm:px-3 sm:text-sm sm:tracking-[0.2em]">
                Uplink active
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
