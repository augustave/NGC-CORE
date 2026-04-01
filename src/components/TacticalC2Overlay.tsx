import { motion, AnimatePresence } from 'framer-motion';
import { Target, Shield, Activity, Radio, AlertTriangle, Cpu, Clock, Zap, CheckCircle, Fingerprint, Search, Eye, Layers, Thermometer, Crosshair, FileText } from 'lucide-react';
import { useMemo } from 'react';

export const TacticalC2Overlay = ({ 
  active, 
  conjunction, 
  onMitigate, 
  currentTime, 
  onTimeChange,
  isVerifying,
  verificationHash,
  onVerify,
  onExportReport,
  sensorMode,
  onSensorModeChange,
  hoveredDebris
}: any) => {
  
  const altitude = useMemo(() => (7102.4 + Math.sin(currentTime * 0.01) * 5).toFixed(1), [currentTime]);
  const velocity = useMemo(() => (7.52 - Math.cos(currentTime * 0.01) * 0.05).toFixed(2), [currentTime]);

  const isNearingConjunction = conjunction && currentTime > 12000 && currentTime < 15000;

  const accentColor = useMemo(() => {
    if (sensorMode === 'SAR')     return 'text-c2-accent-green';
    if (sensorMode === 'THERMAL') return 'text-c2-accent-amber';
    return 'text-c2-accent-blue';
  }, [sensorMode]);

  const borderColor = useMemo(() => {
    if (sensorMode === 'SAR')     return 'border-c2-accent-green';
    if (sensorMode === 'THERMAL') return 'border-c2-accent-amber';
    return 'border-c2-accent-blue';
  }, [sensorMode]);

  return (
    <div className={`absolute inset-0 pointer-events-none ${accentColor} font-mono select-none p-8 flex flex-col justify-between overflow-hidden transition-colors duration-500`}>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold tracking-tighter text-white">NGC CORE</div>
          <div className="text-xs opacity-60 uppercase tracking-widest">Neptune-1 Resilience Portal // T-Machine v.1.2.0</div>
        </div>
        
        <div className="flex gap-4 items-center">
          <AnimatePresence>
            {verificationHash && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-2 bg-c2-accent-green/10 border border-c2-accent-green/50 px-3 py-1 rounded-sm`}
              >
                <CheckCircle className="w-3 h-3 text-c2-accent-green" />
                <span className="text-[1.5rem] text-c2-accent-green font-bold tracking-widest uppercase">NGC-VERIFIED [S13]</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col items-end">
            <div className="text-xs opacity-60 uppercase">System Status</div>
            <div className={`font-bold ${isNearingConjunction ? 'text-c2-accent-amber' : 'text-c2-accent-green'}`}>
              {isNearingConjunction ? 'CAUTION' : 'NOMINAL'}
            </div>
          </div>
          <div className={`w-10 h-10 border rounded-full flex items-center justify-center transition-colors ${isNearingConjunction ? 'border-c2-accent-amber bg-c2-accent-amber/10' : borderColor}`}>
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main UI */}
      <div className="flex flex-1 items-center justify-between pointer-events-auto">
        {/* Left Panel: Telemetry & Sensor Toggle */}
        <div className="flex flex-col gap-4">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`bg-black/40 backdrop-blur-md border-l-2 ${borderColor} p-6 flex flex-col gap-4 max-w-xs transition-colors duration-500`}
          >
            <div className="flex items-center justify-between border-b border-blue-500/30 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-widest text-white">Sensor Fusion</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-2">
               <div className="text-[1.5rem] opacity-60 uppercase mb-1 font-bold text-white/80">Spectral Band Selection</div>
               <div className="flex gap-2">
                  {[
                    { id: 'OPTICAL', icon: Eye },
                    { id: 'SAR', icon: Layers },
                    { id: 'THERMAL', icon: Thermometer }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => onSensorModeChange(mode.id)}
                      className={`flex-1 py-2 flex flex-col items-center gap-1 border transition-all ${
                        sensorMode === mode.id 
                          ? `${borderColor} bg-white/10 text-white` 
                          : 'border-white/10 text-white/40 hover:border-white/30'
                      }`}
                    >
                      <mode.icon className="w-4 h-4" />
                      <span className="text-[1.25rem] font-bold">{mode.id}</span>
                    </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[1.5rem] border-t border-white/10 pt-4">
              <div>ALTITUDE<br/><span className="text-sm text-white">{altitude} KM</span></div>
              <div>VELOCITY<br/><span className="text-sm text-white">{velocity} KM/S</span></div>
              <div>RESOLUTION<br/><span className="text-sm text-white">{sensorMode === 'OPTICAL' ? '15CM' : '30CM'}</span></div>
              <div>T-OFFSET<br/><span className="text-sm text-white">+{currentTime}s</span></div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button 
                onClick={onVerify}
                disabled={isVerifying}
                className={`py-2 px-4 border text-[1.5rem] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
                  isVerifying ? 'border-white/20 text-white/40' : `${borderColor} hover:bg-white/10 text-white`
                }`}
              >
                {isVerifying ? <Search className="w-3 h-3 animate-spin" /> : <Fingerprint className="w-3 h-3" />}
                {isVerifying ? 'Scanning Engine Integrity...' : 'Verify Section 13 Integrity'}
              </button>

              <button 
                onClick={onExportReport}
                className={`py-2 px-4 border border-white/10 hover:border-white/30 text-[1.5rem] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all text-white/60 hover:text-white`}
              >
                <FileText className="w-3 h-3" />
                Download Mission Report
              </button>
            </div>
          </motion.div>

          {/* Gaze-Aware Covariance Panel (Idea 4) */}
          <AnimatePresence>
            {hoveredDebris && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-red-950/40 backdrop-blur-md border-l-2 border-red-500 p-4 flex flex-col gap-2 max-w-xs"
              >
                <div className="flex items-center gap-2 text-red-400">
                   <Crosshair className="w-4 h-4" />
                   <span className="text-[1.5rem] font-bold uppercase tracking-widest">Probabilistic Threat Analysis</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-[1.25rem]">
                   <div className="flex justify-between">
                      <span className="opacity-60">Pc (PROBABILITY)</span>
                      <span className="text-red-400 font-bold">0.00314</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="opacity-60">d-MISS (NOMINAL)</span>
                      <span className="text-red-400 font-bold">412.8 M</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="opacity-60">COVARIANCE (1-SIGMA)</span>
                      <span className="text-red-400 font-bold">±84.2 M</span>
                   </div>
                </div>
                <div className="h-1 w-full bg-red-900/30 mt-1">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: '85%' }}
                     className="h-full bg-red-500"
                   />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center: Interaction Prompts */}
        <AnimatePresence>
          {conjunction && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className={`bg-red-500/20 border border-red-500 p-4 flex items-center gap-4 text-red-500 ${isNearingConjunction ? 'animate-ping' : 'animate-pulse'}`}>
                <AlertTriangle className="w-8 h-8" />
                <div>
                  <div className="font-bold uppercase">Conjunction Risk: High</div>
                  <div className="text-xs">PROBABILITY: 0.0031 // DETERMINISTIC MATCH</div>
                </div>
              </div>
              <button 
                onClick={onMitigate}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 transition-colors flex items-center gap-2 group"
              >
                <Target className="w-5 h-5 group-hover:scale-125 transition-transform" />
                INITIATE 1.2 M/S DELTA-V
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Panel: Raptor™ Module (Skill 2) */}
        <motion.div 
          animate={{ x: active ? 0 : 400, opacity: active ? 1 : 0 }}
          className={`bg-black/40 backdrop-blur-md border-r-2 ${borderColor} p-6 flex flex-col gap-4 max-w-sm transition-colors duration-500`}
        >
          <div className="flex items-center gap-2 border-b border-blue-500/30 pb-2">
            <Cpu className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-widest text-white">Raptor™ Module v4</span>
          </div>
          
          <div className="relative aspect-square border border-white/10 flex items-center justify-center p-4 overflow-hidden">
            <AnimatePresence>
              {isVerifying && (
                <motion.div 
                  initial={{ top: '-100%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 w-full h-1 bg-white/50 shadow-[0_0_10px_#fff] z-10"
                />
              )}
            </AnimatePresence>

            <svg viewBox="0 0 100 100" className={`w-full h-full ${accentColor} transition-colors duration-500`}>
               <rect x="30" y="30" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
               <line x1="15" y1="15" x2="30" y2="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 1" />
               <line x1="85" y1="15" x2="70" y2="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 1" />
               <text x="5" y="10" fontSize="4" fill="currentColor">L-BAND ANTENNA [REF-001]</text>
               <text x="65" y="10" fontSize="4" fill="currentColor">RESILIENCE ENGINE</text>
            </svg>
            <div className={`absolute top-2 right-2 text-[1.25rem] ${borderColor.replace('border-', 'bg-')} text-black px-1 font-bold italic transition-colors duration-500`}>REMEDIATION ACTIVE</div>
          </div>

          <div className="text-[1.5rem] space-y-2 opacity-80 text-white">
            <p className={`border-l ${borderColor} pl-2 font-bold uppercase transition-colors duration-500`}>Section 13 Remediation Logs</p>
            <div className="max-h-24 overflow-hidden mask-fade-bottom">
              <p>[SENSOR: {sensorMode}] FEED SYNCED</p>
              <p>[T+{currentTime}s] INTEGRITY CHECK: PASSED</p>
              <p>[T+{currentTime}s] DETERMINISTIC REPLAY ACTIVE</p>
              {verificationHash && <p className="text-c2-accent-green font-bold uppercase">[T+{currentTime}s] AUDIT LOG: SIGNED</p>}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer: The Time Machine Scrubber */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 pointer-events-auto">
          <div className="flex justify-between text-[1.5rem] tracking-widest uppercase text-white">
             <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Deterministic Time Machine
             </div>
             <div className="flex items-center gap-2 opacity-60">
                <Zap className="w-3 h-3 text-yellow-400" />
                SCRUB TO VALIDATE TEMPORAL STATES
             </div>
          </div>
          <input 
            type="range" 
            min="0" 
            max="20000" 
            step="10" 
            value={currentTime} 
            onChange={(e) => onTimeChange(parseInt(e.target.value))}
            className={`w-full h-1 bg-white/10 appearance-none cursor-pointer rounded-full accent-white`}
          />
        </div>
        
        <div className="flex justify-between items-end">
          <div className="flex gap-8 text-[1.5rem] tracking-widest uppercase text-white/60">
            <div className="flex items-center gap-2">
               <Radio className="w-3 h-3" />
               UPLINK: ACTIVE [4.2 GB/S]
            </div>
            <div>LATENCY: 12ms // DETERMINISTIC: TRUE</div>
          </div>
          <div className="text-[1.5rem] opacity-40 italic font-serif text-white">
            "The new frontier of spatial intelligence."
          </div>
        </div>
      </div>
    </div>
  );
};
