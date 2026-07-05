"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import ParticleLattice from "./ParticleLattice";
import CameraRig from "./CameraRig";
import Being from "./Being";
import DevRoom from "./DevRoom";
import FloatingObjects from "./FloatingObjects";
import { useStore } from "@/store/useStore";

export default function Scene() {
  const [dpr, setDpr] = useState(1.5);
  const setQuality = useStore((s) => s.setQuality);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 14], fov: 40 }}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#050a12");
      }}
    >
      <PerformanceMonitor
        onIncline={() => {
          setDpr(Math.min(2, window.devicePixelRatio));
          setQuality("high");
        }}
        onDecline={() => {
          setDpr(1);
          setQuality("low");
        }}
      >
        <CameraRig />
        <ParticleLattice />
        <DevRoom />
        <FloatingObjects />
        <Suspense fallback={null}>
          <Being />
        </Suspense>
      </PerformanceMonitor>
    </Canvas>
  );
}
