import { lazy, Suspense } from 'react'

const NGC = lazy(() => import('./NGC').then((module) => ({ default: module.NGC })))

function LoadingShell() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#16254a_0%,#070b15_54%,#02040a_100%)] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-black/35 backdrop-blur-xl p-8 shadow-2xl shadow-black/40">
        <div className="text-xs uppercase tracking-[0.4em] text-c2-accent-cyan/70">NGC Mission Dashboard</div>
        <div className="mt-3 text-2xl font-semibold text-white">Loading orbital systems</div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-c2-accent-blue via-c2-accent-cyan to-c2-accent-green" />
        </div>
        <div className="mt-4 text-sm text-white/60">
          Preparing the visualization stack and telemetry controls.
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<LoadingShell />}>
      <NGC />
    </Suspense>
  )
}

export default App
