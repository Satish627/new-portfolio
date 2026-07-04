"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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

const lookEuler = new THREE.Euler();
const lookQuat = new THREE.Quaternion();

export default function Being() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions, names } = useAnimations(animations, group);
  const reduced = useReducedMotion();
  const { viewport, camera } = useThree();

  const pointer = useRef({ x: 0, y: 0 });
  const look = useRef({ yaw: 0, pitch: 0 });
  const headBone = useRef<THREE.Bone | null>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uColor: { value: new THREE.Color("#34d399") },
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uFadeLo: { value: -1.8 },
          uFadeHi: { value: -0.8 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.SkinnedMesh).isSkinnedMesh) {
        if (/joints/i.test(obj.name)) {
          obj.visible = false;
          return;
        }
        (obj as THREE.SkinnedMesh).material = material;
        obj.frustumCulled = false;
      }
      if ((obj as THREE.Bone).isBone && /head$/i.test(obj.name)) {
        headBone.current = obj as THREE.Bone;
      }
    });
  }, [scene, material]);

  useEffect(() => {
    const idleName = names.find((n) => /idle/i.test(n)) ?? names[0];
    const action = idleName ? actions[idleName] : null;
    if (!action) return;
    action.reset().fadeIn(0.6).play();
    if (reduced) action.paused = true;
    return () => {
      action.fadeOut(0.3);
    };
  }, [actions, names, reduced]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const opacityCap = useRef(0.85);

  useFrame((_, delta) => {
    material.uniforms.uTime.value += delta;
    const o = material.uniforms.uOpacity;
    o.value += (opacityCap.current - o.value) * Math.min(1, delta * 1.2);
    if (reduced || !headBone.current) return;
    look.current.yaw += (pointer.current.x * 0.55 - look.current.yaw) * 0.04;
    look.current.pitch +=
      (pointer.current.y * 0.3 - look.current.pitch) * 0.04;
    lookQuat.setFromEuler(
      lookEuler.set(look.current.pitch, look.current.yaw, 0)
    );
    headBone.current.quaternion.multiply(lookQuat);
  });

  const anchor = useMemo(() => new THREE.Vector3(0, 0, 4), []);
  const v = viewport.getCurrentViewport(camera, anchor);
  const narrow = v.width < 5;
  const scale = narrow ? 1.35 : 1.9;
  const x = narrow
    ? Math.max(0.7, v.width / 2 - 0.9)
    : Math.max(0.4, Math.min(2.6, v.width / 2 - 1.3));
  const y = narrow ? -2.1 : -1.8;
  opacityCap.current = narrow ? 0.5 : 0.85;
  material.uniforms.uFadeLo.value = y;
  material.uniforms.uFadeHi.value = y + 0.55 * scale;

  return (
    <group
      ref={group}
      position={[x, y, 4]}
      scale={scale}
      rotation={[0, -0.35, 0]}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
