"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useStore } from "@/store/useStore";

const POSES = [
  { pos: new THREE.Vector3(0, 0, 14), look: new THREE.Vector3(0, 0, 0) },
  { pos: new THREE.Vector3(-1.6, -0.4, 12.6), look: new THREE.Vector3(1.2, 0, 1.5) },
  { pos: new THREE.Vector3(1.4, -0.9, 12.2), look: new THREE.Vector3(-0.6, 0.2, 0) },
  { pos: new THREE.Vector3(-1.0, 0.9, 11.2), look: new THREE.Vector3(0.4, 0.9, 0) },
  { pos: new THREE.Vector3(0, -0.1, 10.4), look: new THREE.Vector3(0, -0.1, 2) },
];

const targetPos = new THREE.Vector3();
const targetLook = new THREE.Vector3();

export default function CameraRig() {
  const pointer = useRef({ x: 0, y: 0 });
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));
  const reduced = useReducedMotion();

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ camera }) => {
    if (reduced) return;

    const progress = useStore.getState().progress;
    const scaled = progress * (POSES.length - 1);
    const seg = Math.min(POSES.length - 2, Math.floor(scaled));
    let t = scaled - seg;
    t = t * t * (3 - 2 * t);

    targetPos.lerpVectors(POSES[seg].pos, POSES[seg + 1].pos, t);
    targetLook.lerpVectors(POSES[seg].look, POSES[seg + 1].look, t);

    targetPos.x += pointer.current.x * 1.1;
    targetPos.y += -pointer.current.y * 0.7;

    camera.position.lerp(targetPos, 0.05);
    currentLook.current.lerp(targetLook, 0.05);
    camera.lookAt(currentLook.current);
  });

  return null;
}
