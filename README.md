# NGC — NEPTUNE-1 RESILIENCE PORTAL
> **"Unifying disparate sensor data into a deterministic spatial intelligence picture."**

## Overview
**NGC** is a high-assurance 3D technical prototype demonstrating a unified **Space-to-Ground Resilience Pipeline**. It unifies complex astrodynamics with auditable C2 (Command & Control) interfaces, designed to meet the rigorous validation requirements of the modern spatial intelligence ecosystem.

The project centers on the **Nexus™ Gateway**—a centralized digital twin that reduces operator cognitive load by encoding raw telemetry into immersive spatial metaphors.

---

## Technical Features (The "Difference")

### 1. Deterministic Time Machine (Skill 1)
- **Logic:** Integrated a high-precision temporal scrubber linked to the `OrbitalPropagator`.
- **Impact:** Allows operators to validate future states by scrubbing through time. The satellite position, altitude, and velocity update in real-time based on deterministic physics rather than simple animation loops.

### 2. Multi-Spectral Sensor Fusion (Skill 2 & 3)
- **Logic:** Implemented dynamic visual modes: **OPTICAL (Vivid™)**, **SAR (L-Band)**, and **THERMAL (MWIR)**.
- **Impact:** Demonstrates the ability to visualize disparate data types. In SAR mode, the Nexus™ Gateway transforms into a 3D point cloud; in Thermal mode, it shifts to a high-contrast heat signature palette.

### 3. Gaze-Aware Covariance Bubbles (Skill 3)
- **Logic:** Modeled a debris field with interactive **Covariance Envelopes** (3D uncertainty clouds).
- **Impact:** Implements "Spatial Ergonomics." Hovering over a threat zone activates a **Probabilistic Threat Analysis** panel, revealing real-time $P_c$ (Probability of Collision) and $d_{miss}$ (Miss Distance) data only when the operator requires it.

### 4. Section 13 Verification & Audit (Skill 1 & 2)
- **Logic:** Built a real-time integrity scanner that generates a SHA-256 cryptographic hash of the current simulation state.
- **Impact:** Provides **Executable Evidence**. Operators can click "Verify Section 13 Integrity" to scan the Raptor™ hardware twin and download a formal `verification_report.json` for post-mission audit.

---

## Operational Scenario: "Deterministic Deconfliction"

1. **Analysis:** An operator uses the **Time Machine** to identify a conjunction risk window at T+13500s.
2. **Detection:** Hovering over the **Covariance Bubble** reveals a high $P_c$ of 0.00314.
3. **Action:** The operator executes a **1.2 m/s Delta-V maneuver**. The orbital path instantly updates to a blue "Validated State."
4. **Audit:** The system is verified via SHA-256 handshake, and a formal mission report is exported for command review.

---

## Tech Stack
- **Engine:** Three.js / React Three Fiber
- **Deterministic Math:** Custom J2 Propagator (TypeScript)
- **Motion:** Framer Motion, GSAP
- **Post-Processing:** Bloom & Glitch (Postprocessing)
- **Visual Standards:** S1000D / MIL-STD Line-Art
- **Package Manager:** Bun

## Getting Started
```bash
bun install
bun run dev
```
Navigate to the local port provided to enter the portal.
