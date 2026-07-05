"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/store/useStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const screenVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const screenFragment = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;

  float hash(float n) {
    return fract(sin(n * 43.7) * 937.31);
  }

  void main() {
    float rows = 13.0;
    float row = floor(vUv.y * rows);
    float inRow = step(0.25, fract(vUv.y * rows)) * (1.0 - step(0.75, fract(vUv.y * rows)));

    float indent = hash(row + 7.0) < 0.35 ? 0.14 : 0.06;
    float len = 0.2 + hash(row) * 0.55;

    float cycle = mod(uTime * 2.2 - (rows - row) * 0.9, rows * 1.6);
    float typed = clamp(cycle, 0.0, 1.0);
    float width = indent + (len - indent) * typed;

    float line = step(indent, vUv.x) * step(vUv.x, width) * inRow;

    float cursorRow = step(abs(cycle - 1.0), 0.5);
    float cursor = step(abs(vUv.x - width - 0.015), 0.01) * inRow * cursorRow
      * step(0.5, fract(uTime * 2.0));

    float scan = 0.92 + 0.08 * sin(vUv.y * 260.0 + uTime * 3.0);
    float glow = 0.06;
    float v = (line * 0.75 + cursor + glow) * scan;
    vec3 color = vec3(0.72, 0.55, 0.98) * v;
    gl_FragColor = vec4(color, uOpacity * (0.25 + v));
  }
`;

interface EdgeBox {
  size: [number, number, number];
  pos: [number, number, number];
}

const BOXES: EdgeBox[] = [
  { size: [3.4, 0.1, 1.5], pos: [0, 0, 0] },
  { size: [0.08, 1.3, 0.08], pos: [-1.6, -0.7, 0.62] },
  { size: [0.08, 1.3, 0.08], pos: [1.6, -0.7, 0.62] },
  { size: [0.08, 1.3, 0.08], pos: [-1.6, -0.7, -0.62] },
  { size: [0.08, 1.3, 0.08], pos: [1.6, -0.7, -0.62] },
  { size: [0.5, 0.06, 0.3], pos: [0, 0.08, -0.2] },
  { size: [0.07, 0.5, 0.07], pos: [0, 0.35, -0.2] },
  { size: [1.9, 1.15, 0.07], pos: [0, 1.2, -0.2] },
  { size: [1.05, 0.05, 0.38], pos: [0, 0.11, 0.45] },
];

export default function DevRoom() {
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  const edgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#a78bfa"),
        transparent: true,
        opacity: 0.55,
      }),
    []
  );

  const faceMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#191036"),
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      }),
    []
  );

  const screenUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
    }),
    []
  );

  const boxes = useMemo(
    () =>
      BOXES.map((b) => ({
        ...b,
        geometry: new THREE.BoxGeometry(...b.size),
        edges: new THREE.EdgesGeometry(new THREE.BoxGeometry(...b.size)),
      })),
    []
  );

  const mug = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(0.09, 0.09, 0.18, 10);
    return { geometry, edges: new THREE.EdgesGeometry(geometry) };
  }, []);

  useFrame(({ clock }) => {
    const focus = useStore.getState().focus.projects;
    if (!reduced) screenUniforms.uTime.value = clock.elapsedTime;
    screenUniforms.uOpacity.value = focus;
    edgeMaterial.opacity = 0.5 * focus;
    faceMaterial.opacity = 0.3 * focus;
    if (group.current) {
      group.current.visible = focus > 0.02;
      if (!reduced) {
        group.current.rotation.y =
          -0.44 + Math.sin(clock.elapsedTime * 0.15) * 0.04;
      }
    }
  });

  return (
    <group
      ref={group}
      position={[3.4, -1.55, 1.0]}
      rotation={[0, -0.44, 0]}
      scale={0.85}
    >
      {boxes.map((b, i) => (
        <group key={i} position={b.pos}>
          <mesh geometry={b.geometry} material={faceMaterial} />
          <lineSegments geometry={b.edges} material={edgeMaterial} />
        </group>
      ))}
      <group position={[-1.1, 0.2, 0.3]}>
        <mesh geometry={mug.geometry} material={faceMaterial} />
        <lineSegments geometry={mug.edges} material={edgeMaterial} />
      </group>
      <mesh position={[0, 1.2, -0.16]}>
        <planeGeometry args={[1.78, 1.03]} />
        <shaderMaterial
          vertexShader={screenVertex}
          fragmentShader={screenFragment}
          uniforms={screenUniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
