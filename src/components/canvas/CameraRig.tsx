"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function CameraRig() {
  const target = useRef({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ camera }) => {
    if (reduced) return;
    camera.position.x += (target.current.x * 1.2 - camera.position.x) * 0.03;
    camera.position.y += (-target.current.y * 0.8 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });

  return null;
}
