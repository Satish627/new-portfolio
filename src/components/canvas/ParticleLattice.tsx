"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const vertexShader = /* glsl */ `
  uniform float uTime;
  attribute float aScale;
  attribute vec3 aRand;
  varying float vTwinkle;
  varying float vDepth;

  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.12 + aRand.x * 6.2832) * 0.6;
    p.y += cos(uTime * 0.10 + aRand.y * 6.2832) * 0.5;
    p.z += sin(uTime * 0.08 + aRand.z * 6.2832) * 0.6;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * 42.0 / -mv.z;

    vTwinkle = 0.5 + 0.5 * sin(uTime * 1.5 + aRand.x * 40.0);
    vDepth = smoothstep(30.0, 10.0, -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vTwinkle;
  varying float vDepth;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.1, d) * (0.2 + 0.55 * vTwinkle) * vDepth;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

export default function ParticleLattice() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const reduced = useReducedMotion();

  const count = useMemo(() => {
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    return coarse ? 2500 : 7000;
  }, []);

  const { positions, scales, rands } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const rands = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
      scales[i] = 0.5 + Math.random();
      rands[i * 3] = Math.random();
      rands[i * 3 + 1] = Math.random();
      rands[i * 3 + 2] = Math.random();
    }
    return { positions, scales, rands };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#34d399") },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (reduced || !material.current) return;
    material.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aRand" args={[rands, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
