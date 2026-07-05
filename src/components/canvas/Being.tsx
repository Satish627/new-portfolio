"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useStore, type SectionId } from "@/store/useStore";

const MODEL_URL = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/models/being.glb`;

const vertexShader = /* glsl */ `
  #include <common>
  #include <skinning_pars_vertex>

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;

  void main() {
    #include <beginnormal_vertex>
    #include <skinbase_vertex>
    #include <skinnormal_vertex>
    #include <begin_vertex>
    #include <skinning_vertex>

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vNormal = normalize(normalMatrix * objectNormal);
    vViewDir = normalize(-mvPosition.xyz);
    vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uFadeLo;
  uniform float uFadeHi;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;

  void main() {
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewDir))), 2.0);
    float scan = 0.5 + 0.5 * sin(vWorldPos.y * 60.0 - uTime * 1.5);
    float ground = smoothstep(uFadeLo, uFadeHi, vWorldPos.y);
    float alpha = (fresnel * 0.85 + 0.05) * (0.65 + 0.35 * scan) * ground * uOpacity;
    if (alpha < 0.004) discard;
    vec3 color = uColor * (0.35 + fresnel * 1.5);
    gl_FragColor = vec4(color, alpha);
  }
`;

interface ActPose {
  pos: [number, number, number];
  ry: number;
  height: number;
  clip: string;
  track: boolean;
  dim: number;
  book: boolean;
}

const ACTS: Record<SectionId, ActPose> = {
  hero: {
    pos: [2.6, -1.9, 4],
    ry: -0.3,
    height: 2.9,
    clip: "Idle",
    track: true,
    dim: 1,
    book: false,
  },
  work: {
    pos: [3.0, -1.75, 1.8],
    ry: 2.7,
    height: 1.9,
    clip: "Sitting",
    track: false,
    dim: 0.85,
    book: false,
  },
  about: {
    pos: [-3.2, -1.9, 2.5],
    ry: 0.55,
    height: 2.4,
    clip: "Idle",
    track: false,
    dim: 0.5,
    book: false,
  },
  experience: {
    pos: [3.1, -1.7, 0.6],
    ry: -0.35,
    height: 2.1,
    clip: "Sitting",
    track: false,
    dim: 0.9,
    book: true,
  },
  contact: {
    pos: [2.4, -1.9, 5],
    ry: -0.25,
    height: 2.9,
    clip: "Wave",
    track: true,
    dim: 1,
    book: false,
  },
};

const lookEuler = new THREE.Euler();
const lookQuat = new THREE.Quaternion();

export default function Being() {
  const group = useRef<THREE.Group>(null);
  const book = useRef<THREE.Mesh>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);
  const reduced = useReducedMotion();

  const pointer = useRef({ x: 0, y: 0 });
  const look = useRef({ yaw: 0, pitch: 0 });
  const headBone = useRef<THREE.Object3D | null>(null);
  const active = useRef<SectionId>("hero");
  const applied = useRef<SectionId | null>(null);
  const currentClip = useRef<string | null>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uColor: { value: new THREE.Color("#67e8f9") },
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uFadeLo: { value: -1.9 },
          uFadeHi: { value: -0.9 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const bookMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#67e8f9"),
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  );

  const modelHeight = useRef(1);

  useLayoutEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        (obj as THREE.Mesh).material = material;
        obj.frustumCulled = false;
      }
      if (/^head/i.test(obj.name) && !headBone.current) {
        headBone.current = obj;
      }
    });
    scene.updateMatrixWorld(true);
    const bbox = new THREE.Box3().setFromObject(scene);
    modelHeight.current = Math.max(0.001, bbox.max.y - bbox.min.y);
    (window as unknown as { __beingDebug?: object }).__beingDebug = {
      min: bbox.min.toArray(),
      max: bbox.max.toArray(),
      height: modelHeight.current,
    };
  }, [scene, material]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const lastHalfW = useRef(4);

  const applyAct = (id: SectionId) => {
    const act = ACTS[id];
    const g = group.current;
    if (!g) return;
    const halfW = lastHalfW.current;
    const narrow = halfW < 2.6;
    const height = narrow ? act.height * 0.8 : act.height;
    const margin = height * 0.36;
    const x =
      act.pos[0] >= 0
        ? Math.max(0.4, Math.min(act.pos[0], halfW - margin))
        : Math.min(-0.4, Math.max(act.pos[0], -(halfW - margin)));
    const scale = height / modelHeight.current;
    g.position.set(x, act.pos[1], act.pos[2]);
    g.rotation.set(0, act.ry, 0);
    g.scale.setScalar(scale);
    material.uniforms.uFadeLo.value = act.pos[1];
    material.uniforms.uFadeHi.value = act.pos[1] + 0.35 * height;

    const next = actions[act.clip] ?? actions["Idle"];
    if (next && act.clip !== currentClip.current) {
      const prev = currentClip.current
        ? actions[currentClip.current]
        : null;
      next.reset();
      if (prev && prev !== next) {
        next.crossFadeFrom(prev, 0.35, false);
      }
      next.play();
      if (reduced) next.paused = true;
      currentClip.current = act.clip;
    }
    if (book.current) book.current.visible = act.book;
    applied.current = id;
  };

  useEffect(() => {
    applyAct("hero");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions]);

  const anchor = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ viewport, camera }, delta) => {
    material.uniforms.uTime.value += delta;

    const focus = useStore.getState().focus;
    let best: SectionId = "hero";
    let bestVal = 0;
    (Object.keys(focus) as SectionId[]).forEach((id) => {
      if (focus[id] > bestVal) {
        bestVal = focus[id];
        best = id;
      }
    });
    active.current = best;

    const o = material.uniforms.uOpacity;
    const act = ACTS[best];
    anchor.set(0, 0, act.pos[2]);
    const halfW = viewport.getCurrentViewport(camera, anchor).width / 2;
    const resized = Math.abs(halfW - lastHalfW.current) > 0.25;
    lastHalfW.current = halfW;
    if (resized && applied.current) applyAct(applied.current);
    const needsMove = applied.current !== best;

    // While a move is pending, drive opacity to 0, then teleport & fade in.
    const targetOpacity = needsMove ? 0 : bestVal * act.dim * 0.9;
    o.value += (targetOpacity - o.value) * Math.min(1, delta * 5);
    if (needsMove && o.value < 0.04) applyAct(best);
    bookMaterial.opacity = o.value * 0.7;

    if (reduced) return;
    if (ACTS[applied.current ?? "hero"].track && headBone.current) {
      look.current.yaw +=
        (pointer.current.x * 0.55 - look.current.yaw) * 0.04;
      look.current.pitch +=
        (pointer.current.y * 0.3 - look.current.pitch) * 0.04;
      lookQuat.setFromEuler(
        lookEuler.set(look.current.pitch, look.current.yaw, 0)
      );
      headBone.current.quaternion.multiply(lookQuat);
    }
  });

  return (
    <group ref={group} position={[2.6, -1.9, 4]}>
      <primitive object={scene} />
      <mesh
        ref={book}
        visible={false}
        position={[0, 1.15, 0.95]}
        rotation={[-0.6, 0, 0]}
        material={bookMaterial}
      >
        <planeGeometry args={[0.85, 0.55]} />
      </mesh>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
