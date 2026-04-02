import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { C2_THREE_COLORS } from '../tokens/c2-design-system';

export const ResilienceOrb = ({ active = false, mode = 'OPTICAL', onInteract = () => {} }: any) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);
  const pointsRef = useRef<THREE.Points>(null!);

  // Create a procedural "grain" texture
  const grainTexture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const idata = ctx.createImageData(size, size);
    for (let i = 0; i < idata.data.length; i += 4) {
      const val = Math.random() * 255;
      idata.data[i] = val;
      idata.data[i+1] = val;
      idata.data[i+2] = val;
      idata.data[i+3] = 255;
    }
    ctx.putImageData(idata, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  // Mode Transition Effects — color maps to sensor band (see MOTION_NARRATIVE.colorTransition)
  useEffect(() => {
    if (materialRef.current) {
      const targetColor =
        mode === 'SAR'     ? C2_THREE_COLORS.orbSAR :
        mode === 'THERMAL' ? C2_THREE_COLORS.orbThermal : C2_THREE_COLORS.orbOptical;
      
      gsap.to(materialRef.current.color, {
        r: new THREE.Color(targetColor).r,
        g: new THREE.Color(targetColor).g,
        b: new THREE.Color(targetColor).b,
        duration: 0.5
      });
    }
  }, [mode]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // MOTION_NARRATIVE.rotation: orbital angular momentum
    if (meshRef.current) meshRef.current.rotation.y = t * 0.1;
    if (pointsRef.current) pointsRef.current.rotation.y = t * 0.15;

    if (materialRef.current) {
      // MOTION_NARRATIVE.distortionAmount + distortionSpeed: uncertainty envelope growth
      materialRef.current.distort = THREE.MathUtils.lerp(
        materialRef.current.distort,
        active ? 0.4 : 0.2,
        0.05
      );
      materialRef.current.speed = THREE.MathUtils.lerp(
        materialRef.current.speed,
        active ? 3 : 1,
        0.05
      );
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group onClick={onInteract}>
        {/* Main Mesh (Optical/Thermal) */}
        <Sphere
          ref={meshRef}
          args={[1.2, 128, 128]}
          visible={mode !== 'SAR'}
        >
          <MeshDistortMaterial
            ref={materialRef}
            color={C2_THREE_COLORS.orbOptical}
            emissive={mode === 'THERMAL' ? C2_THREE_COLORS.orbThermal : C2_THREE_COLORS.orbOptical}
            emissiveIntensity={active ? 3 : 1.5} /* MOTION_NARRATIVE.emissiveIntensity */
            distort={0.2}
            speed={1}
            roughness={mode === 'THERMAL' ? 0.1 : 0.4}
            metalness={0.9}
            bumpMap={grainTexture}
            bumpScale={mode === 'SAR' ? 0.2 : 0.05}
          />
        </Sphere>

        {/* SAR Point Cloud Mesh */}
        {mode === 'SAR' && (
          <Points ref={pointsRef}>
            <sphereGeometry args={[1.2, 48, 48]} />
            <PointMaterial
              transparent
              color={C2_THREE_COLORS.orbSAR}
              size={0.02}
              sizeAttenuation={true}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </Points>
        )}
      </group>
    </Float>
  );
};
