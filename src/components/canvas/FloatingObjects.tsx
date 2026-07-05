"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Floater {
  geometry: THREE.BufferGeometry;
  pos: [number, number, number];
  speed: number;
  amp: number;
}

export default function FloatingObjects() {
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#a78bfa"),
        wireframe: true,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
    []
  );

  const floaters = useMemo<Floater[]>(
    () => [
      {
        geometry: new THREE.IcosahedronGeometry(0.55, 0),
        pos: [-4.2, 1.8, 2],
        speed: 0.25,
        amp: 0.3,
      },
      {
        geometry: new THREE.TorusGeometry(0.5, 0.16, 8, 20),
        pos: [4.4, 2.4, -1.5],
        speed: 0.18,
        amp: 0.4,
      },
      {
        geometry: new THREE.OctahedronGeometry(0.5, 0),
        pos: [-4.8, -2.2, -2.5],
        speed: 0.3,
        amp: 0.35,
      },
      {
        geometry: new THREE.TorusKnotGeometry(0.35, 0.11, 48, 8),
        pos: [5.6, -2.8, 0.5],
        speed: 0.22,
        amp: 0.3,
      },
      {
        geometry: new THREE.DodecahedronGeometry(0.4, 0),
        pos: [-3.2, 3, -4.5],
        speed: 0.15,
        amp: 0.45,
      },
    ],
    []
  );

  useFrame(({ clock }) => {
    if (reduced || !group.current) return;
    const t = clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const f = floaters[i];
      child.rotation.x = t * f.speed;
      child.rotation.y = t * f.speed * 1.4;
      child.position.y = f.pos[1] + Math.sin(t * f.speed * 2 + i * 2.1) * f.amp;
    });
  });

  return (
    <group ref={group}>
      {floaters.map((f, i) => (
        <mesh key={i} geometry={f.geometry} material={material} position={f.pos} />
      ))}
    </group>
  );
}
