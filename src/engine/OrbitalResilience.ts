/**
 * Orbital Resilience Engine
 * Provides deterministic state propagation and conjunction mitigation logic.
 */

export interface StateVector {
  x: number;   // [meters, ECI J2000]
  y: number;   // [meters, ECI J2000]
  z: number;   // [meters, ECI J2000]
  vx: number;  // [meters/second, ECI J2000]
  vy: number;  // [meters/second, ECI J2000]
  vz: number;  // [meters/second, ECI J2000]
  timestamp: number; // [seconds from epoch]
  frame: 'ECI';      // coordinate frame — all vectors must be in ECI J2000
  epoch: 'J2000';    // reference epoch
}

export class OrbitalPropagator {
  private readonly mu = 3.986004418e14; // G * M

  /**
   * Simple two-body propagation using Euler integration (for prototype speed)
   */
  propagate(state: StateVector, dt: number): StateVector {
    const r = Math.sqrt(state.x ** 2 + state.y ** 2 + state.z ** 2);
    const acc = -this.mu / r ** 3;

    const ax = acc * state.x;
    const ay = acc * state.y;
    const az = acc * state.z;

    return {
      x: state.x + state.vx * dt,
      y: state.y + state.vy * dt,
      z: state.z + state.vz * dt,
      vx: state.vx + ax * dt,
      vy: state.vy + ay * dt,
      vz: state.vz + az * dt,
      timestamp: state.timestamp + dt,
      frame: 'ECI',
      epoch: 'J2000',
    };
  }

  getStateAt(initialState: StateVector, targetTime: number, step: number = 10): StateVector {
    let current = { ...initialState };
    let elapsed = 0;
    while (elapsed < targetTime) {
      const dt = Math.min(step, targetTime - elapsed);
      current = this.propagate(current, dt);
      elapsed += dt;
    }
    return current;
  }

  generateOrbitPoints(initialState: StateVector, segments: number, step: number): [number, number, number][] {
    let current = { ...initialState };
    const points: [number, number, number][] = [];
    
    // Convert to relative scale for visualization (1 unit = 1000km approx)
    const scale = 1e-6;

    for (let i = 0; i < segments; i++) {
      points.push([current.x * scale, current.y * scale, current.z * scale]);
      current = this.propagate(current, step);
    }
    return points;
  }
}

export const DEFAULT_LEO_STATE: StateVector = {
  x: 7000000, // [m] ~629km altitude (7000km from Earth center)
  y: 0,       // [m]
  z: 0,       // [m]
  vx: 0,      // [m/s]
  vy: 7500,   // [m/s] ~7.5km/s circular velocity
  vz: 3000,   // [m/s] inclination component
  timestamp: 0,
  frame: 'ECI',
  epoch: 'J2000',
};
