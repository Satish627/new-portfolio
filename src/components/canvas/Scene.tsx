"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import ParticleLattice from "./ParticleLattice";
import CameraRig from "./CameraRig";
import Being from "./Being";

export default function Scene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 14], fov: 40 }}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#050d0a");
      }}
    >
      <CameraRig />
      <ParticleLattice />
      <Suspense fallback={null}>
        <Being />
      </Suspense>
    </Canvas>
  );
}
