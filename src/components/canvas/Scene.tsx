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
        alpha: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <hemisphereLight args={["#ffffff", "#4c1d95", 1.1]} />
      <directionalLight position={[4, 6, 8]} intensity={1.6} />
      <directionalLight
        position={[-5, 2, -3]}
        intensity={0.5}
        color="#a78bfa"
      />
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
