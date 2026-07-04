"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function CanvasRoot() {
  return (
    <div className="canvas-root" aria-hidden="true">
      <Scene />
    </div>
  );
}
