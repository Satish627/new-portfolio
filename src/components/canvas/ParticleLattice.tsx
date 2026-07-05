"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useStore } from "@/store/useStore";
import portrait from "@/content/portrait.json";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform vec3 uPortraitOffset;
  uniform float uPScale;
  uniform float uPDim;
  attribute float aScale;
  attribute vec3 aRand;
  attribute vec3 aTarget;
  attribute float aShade;
  varying float vTwinkle;
  varying float vDepth;

  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.12 + aRand.x * 6.2832) * 0.6;
    p.y += cos(uTime * 0.10 + aRand.y * 6.2832) * 0.5;
    p.z += sin(uTime * 0.08 + aRand.z * 6.2832) * 0.6;

    float m = uMorph * step(0.001, aShade);
    vec3 tgt = vec3(aTarget.xy * uPScale, aTarget.z) + uPortraitOffset;
    tgt.x += sin(uTime * 0.6 + aRand.x * 25.0) * 0.02;
    tgt.y += cos(uTime * 0.55 + aRand.y * 25.0) * 0.02;
    p = mix(p, tgt, m);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = mix(aScale, 0.85, m) * 42.0 / -mv.z;

    float tw = 0.5 + 0.5 * sin(uTime * 1.5 + aRand.x * 40.0);
    vTwinkle = mix(tw, aShade * uPDim, m);
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

const portraitData = portrait.points as number[];

export default function ParticleLattice() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const reduced = useReducedMotion();

  const count = useMemo(() => {
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    return coarse ? 2500 : 7000;
  }, []);

  const { positions, scales, rands, targets, shades } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const rands = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const shades = new Float32Array(count);

    const pCount = portraitData.length / 4;
    const usable = Math.min(pCount, Math.floor(count * 0.8));

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
      scales[i] = 0.5 + Math.random();
      rands[i * 3] = Math.random();
      rands[i * 3 + 1] = Math.random();
      rands[i * 3 + 2] = Math.random();

      if (i < usable) {
        const j = Math.floor((i * pCount) / usable) * 4;
        targets[i * 3] = portraitData[j];
        targets[i * 3 + 1] = portraitData[j + 1];
        targets[i * 3 + 2] = portraitData[j + 2];
        shades[i] = portraitData[j + 3];
      }
    }
    return { positions, scales, rands, targets, shades };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uPortraitOffset: { value: new THREE.Vector3(2, 0.2, 5) },
      uPScale: { value: 1 },
      uPDim: { value: 1 },
      uColor: { value: new THREE.Color("#c4b5fd") },
    }),
    []
  );

  const anchor = useMemo(() => new THREE.Vector3(0, 0, 5), []);
  const PORTRAIT_HALF_W = 1.28;

  useFrame(({ clock, viewport, camera }, delta) => {
    if (!material.current) return;
    const u = material.current.uniforms;
    if (!reduced) u.uTime.value = clock.elapsedTime;
    const target = useStore.getState().focus.about;
    u.uMorph.value +=
      (target - u.uMorph.value) * Math.min(1, delta * 4.5);

    const v = viewport.getCurrentViewport(camera, anchor);
    const halfW = v.width / 2;
    const scale = halfW > 3.4 ? 1 : Math.max(0.6, halfW / 3.4);
    const x = Math.min(
      2,
      Math.max(0.1, halfW - PORTRAIT_HALF_W * scale - 0.35)
    );
    u.uPScale.value = scale;
    u.uPDim.value = halfW < 1.8 ? 0.45 : halfW < 2.6 ? 0.75 : 1;
    u.uPortraitOffset.value.set(x, 0.2, 5);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aRand" args={[rands, 3]} />
        <bufferAttribute attach="attributes-aTarget" args={[targets, 3]} />
        <bufferAttribute attach="attributes-aShade" args={[shades, 1]} />
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
