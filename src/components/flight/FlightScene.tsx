"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/immutability */
// three.js buffers are mutated in the frame loop by design (r3f pattern).

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { greatCirclePoint, latLonToVec3, SAO_PAULO, STOCKHOLM } from "@/lib/flight";
import { HOMES } from "@/lib/geo";
import { makeEarth } from "./earth";

const A = latLonToVec3(SAO_PAULO.lat, SAO_PAULO.lon);
const B = latLonToVec3(STOCKHOLM.lat, STOCKHOLM.lon);
const SEGMENTS = 240;
// normal of the route's great-circle plane, signed to point north so the camera sits above the route
const SIDE = (() => { const n = A.clone().cross(B).normalize(); return n.y < 0 ? n.negate() : n; })();

function Pin({ pos, color, size = 1 }: { pos: THREE.Vector3; color: string; size?: number }) {
  const ring = useRef<THREE.Mesh>(null!);
  const q = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize()), [pos]);
  useFrame(({ clock }) => {
    const s = 1 + ((clock.elapsedTime * 0.8) % 1) * 1.6;
    ring.current.scale.setScalar(s);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - (s - 1) / 1.6);
  });
  return (
    <group position={pos.clone().multiplyScalar(1.003)} quaternion={q} scale={size}>
      <mesh><sphereGeometry args={[0.018, 12, 12]} /><meshBasicMaterial color={color} /></mesh>
      <mesh ref={ring}><ringGeometry args={[0.022, 0.028, 32]} /><meshBasicMaterial color={color} transparent depthWrite={false} /></mesh>
    </group>
  );
}

/** Low-poly airliner, +Z forward. No external asset (no licensing risk). */
function Plane() {
  const m = <meshStandardMaterial color="#f2f2f2" metalness={0.5} roughness={0.35} emissive="#ff5a1f" emissiveIntensity={0.25} />;
  return (
    <group scale={0.5}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><capsuleGeometry args={[0.012, 0.07, 4, 10]} />{m}</mesh>
      <mesh position={[0, 0, -0.005]}><boxGeometry args={[0.095, 0.002, 0.025]} />{m}</mesh>
      <mesh position={[0, 0, -0.05]}><boxGeometry args={[0.04, 0.002, 0.014]} />{m}</mesh>
      <mesh position={[0, 0.012, -0.05]}><boxGeometry args={[0.002, 0.026, 0.016]} />{m}</mesh>
      <pointLight color="#ff5a1f" intensity={0.6} distance={0.5} />
    </group>
  );
}

const HOME_VECS = HOMES.map((h) => ({ ...h, v: latLonToVec3(h.lat, h.lon) }));

/** The three players' domestic legs converging on São Paulo. Context only, not tied to fundraising progress. */
function Feeders({ reduced }: { reduced: boolean }) {
  const dots = useRef<THREE.Mesh[]>([]);
  const curves = useMemo(() => HOME_VECS.map((h) =>
    new THREE.CatmullRomCurve3(Array.from({ length: 60 }, (_, i) => greatCirclePoint(h.v, A, i / 59, 1, 0.05)))), []);
  const tubes = useMemo(() => curves.map((c) => new THREE.TubeGeometry(c, 60, 0.0022, 5, false)), [curves]);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ clock }) => {
    curves.forEach((c, i) => {
      const t = reduced ? 0.6 : (clock.elapsedTime * 0.12 + i / 3) % 1;
      c.getPointAt(t, tmp);
      dots.current[i]?.position.copy(tmp);
    });
  });
  return (
    <>
      {tubes.map((g, i) => (
        <mesh key={i} geometry={g}><meshBasicMaterial color="#ffd2a1" transparent opacity={0.7} depthWrite={false} /></mesh>
      ))}
      {curves.map((_, i) => (
        <mesh key={i} ref={(m) => { if (m) dots.current[i] = m; }}>
          <sphereGeometry args={[0.009, 10, 10]} /><meshBasicMaterial color="#fff3e0" toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

/** Soft blue limb glow (Fresnel) instead of a flat halo. */
const ATMOS_VERT = "varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }";
const ATMOS_OUT = "varying vec3 vN; void main(){ float i = pow(0.78 - dot(vN, vec3(0.,0.,1.)), 3.0); gl_FragColor = vec4(1.0,0.42,0.12,1.0) * i * 0.8; }";

function Sun() {
  const light = useRef<THREE.DirectionalLight>(null!);
  const { camera } = useThree();
  const r = useMemo(() => new THREE.Vector3(), []);
  const u = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    // keep the sun up-left of the camera so the visible hemisphere is always lit
    r.set(1, 0, 0).applyQuaternion(camera.quaternion);
    u.set(0, 1, 0).applyQuaternion(camera.quaternion);
    light.current.position.copy(camera.position).addScaledVector(r, -2.2).addScaledVector(u, 2.0);
  });
  return <directionalLight ref={light} intensity={2.3} color="#fff4e6" />;
}

function Route({ progress, reduced, onArrive }: { progress: number; reduced: boolean; onArrive: (a: boolean) => void }) {
  const plane = useRef<THREE.Group>(null!);
  const shown = useRef(0);
  const arrived = useRef(false);
  const trail = useRef<THREE.Mesh>(null!);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(
    Array.from({ length: SEGMENTS + 1 }, (_, i) => greatCirclePoint(A, B, i / SEGMENTS, 1, 0.14)), false), []);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, SEGMENTS, 0.004, 6, false), [curve]);
  const idxPerSeg = 6 * 6;
  const pos = useMemo(() => new THREE.Vector3(), []);
  const nxt = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    // displayed value eases toward target and can never exceed it
    shown.current = reduced ? progress : THREE.MathUtils.damp(shown.current, progress, 2.2, dt);
    if (Math.abs(shown.current - progress) < 1e-4) shown.current = progress;
    const t = shown.current;
    curve.getPointAt(t, pos);
    plane.current.position.copy(pos);
    curve.getPointAt(Math.min(1, t + 0.002), nxt);
    if (t >= 0.999) {
      curve.getPointAt(0.998, nxt);
      nxt.lerpVectors(pos, nxt, -1);
    }
    plane.current.up.copy(pos).normalize();
    plane.current.lookAt(nxt);
    tube.setDrawRange(0, Math.max(0, Math.floor(t * SEGMENTS)) * idxPerSeg);
    trail.current.visible = t > 0.002;
    const arr = progress >= 1 && t >= 1;
    if (arr !== arrived.current) { arrived.current = arr; onArrive(arr); }
  });

  return (
    <>
      <mesh geometry={tube}><meshBasicMaterial color="#ffffff" transparent opacity={0.08} /></mesh>
      <mesh ref={trail} geometry={tube}>
        <meshBasicMaterial color="#ff6a1f" toneMapped={false} blending={THREE.AdditiveBlending} transparent depthWrite={false} />
      </mesh>
      <group ref={plane}><Plane /></group>
    </>
  );
}

function Celebration({ on, reduced }: { on: boolean; reduced: boolean }) {
  const N = reduced ? 0 : 140;
  const ref = useRef<THREE.Points>(null!);
  const { geo, vel } = useMemo(() => {
    const p = new Float32Array(N * 3), c = new Float32Array(N * 3), v = new Float32Array(N * 3);
    const pal = ["#009c3b", "#ffdf00", "#006aa7", "#fecc00"].map((x) => new THREE.Color(x));
    const n = B.clone().normalize();
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < N; i++) {
      pal[i % 4].toArray(c, i * 3);
      const d = new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize().add(n).multiplyScalar(0.12 + rnd() * 0.12);
      d.toArray(v, i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    g.setAttribute("color", new THREE.BufferAttribute(c, 3));
    return { geo: g, vel: v };
  }, [N]);
  const t0 = useRef(0);
  useFrame((_, dt) => {
    if (!on || !ref.current) { t0.current = 0; return; }
    t0.current += dt;
    const a = geo.attributes.position as THREE.BufferAttribute;
    const k = (t0.current % 3) / 3;
    const base = greatCirclePoint(A, B, 1, 1.0, 0);
    for (let i = 0; i < N; i++) a.setXYZ(i, base.x + vel[i * 3] * k * 2.2, base.y + vel[i * 3 + 1] * k * 2.2, base.z + vel[i * 3 + 2] * k * 2.2);
    a.needsUpdate = true;
    (ref.current.material as THREE.PointsMaterial).opacity = 1 - k;
  });
  if (!N) return null;
  return <points ref={ref} geometry={geo} visible={on}><pointsMaterial size={0.012} vertexColors transparent depthWrite={false} /></points>;
}

export type SceneApi = { zoom: (factor: number) => void; recenter: () => void };

function Rig({ progress, reduced, user, api, onUser }: {
  progress: number; reduced: boolean; user: { current: boolean };
  api: { current: SceneApi | null }; onUser: (v: boolean) => void;
}) {
  const { camera, size } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const dist = useRef(9);
  const wide = size.width / size.height;
  useEffect(() => {
    const d = { v: dist.current };
    const end = wide < 0.8 ? 5.0 : 3.7;
    if (reduced) dist.current = end;
    else gsap.to(d, { v: end, duration: 2.6, ease: "power3.out", onUpdate: () => { dist.current = d.v; } });
  }, [reduced, wide]);
  useEffect(() => {
    // shift framing up so the route clears the bottom HUD
    camera.setViewOffset(size.width, size.height, 0, size.height * 0.05, size.width, size.height);
    return () => camera.clearViewOffset();
  }, [camera, size]);
  useEffect(() => {
    api.current = {
      zoom: (f) => { user.current = true; onUser(true); camera.position.setLength(THREE.MathUtils.clamp(camera.position.length() * f, 1.6, 7)); },
      recenter: () => { user.current = false; onUser(false); },
    };
  }, [api, camera, onUser, user]);
  useFrame((_, dt) => {
    if (user.current) return; // the visitor took over: stop following the plane until they recenter
    // look at point between route midpoint and plane so the whole story stays framed
    const mid = greatCirclePoint(A, B, 0.5, 1, 0.1);
    const plane = greatCirclePoint(A, B, progress, 1, 0.14);
    target.copy(mid).lerp(A, 0.4).lerp(plane, 0.2).normalize();
    // tilt the view toward the side of the route plane so the flight arc reads as an arc, not a straight line
    target.addScaledVector(SIDE, 0.18).normalize();
    const goal = target.clone().multiplyScalar(dist.current);
    camera.position.lerp(goal, reduced ? 1 : 1 - Math.exp(-dt * 1.8));
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function FlightScene({ progress, reduced, lowPower, onArrive, api, onUser, interactive, wheelZoom }: {
  progress: number; reduced: boolean; lowPower: boolean; onArrive: (a: boolean) => void;
  api: { current: SceneApi | null }; onUser: (v: boolean) => void; interactive: boolean; wheelZoom: boolean;
}) {
  const user = useRef(false);
  const earth = useMemo(() => makeEarth(lowPower), [lowPower]);
  const arrived = progress >= 1;
  return (
    <Canvas
      dpr={lowPower ? [1, 1.25] : [1, 2]}
      camera={{ fov: 42, position: [0, 0, 9], near: 0.1, far: 50 }}
      gl={{ antialias: !lowPower, powerPreference: "high-performance" }}
      aria-hidden
    >
      <color attach="background" args={["#03050b"]} />
      <ambientLight intensity={0.9} />
      <Sun />
      <Stars radius={30} depth={20} count={lowPower ? 700 : 2200} factor={3} fade speed={reduced ? 0 : 0.6} />
      <mesh>
        <sphereGeometry args={[1, lowPower ? 64 : 128, lowPower ? 64 : 128]} />
        <meshPhongMaterial map={earth.color} specular="#101a2a" shininess={8} />
      </mesh>
      <mesh scale={1.1}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial vertexShader={ATMOS_VERT} fragmentShader={ATMOS_OUT} side={THREE.BackSide} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {HOME_VECS.map((h) => <Pin key={h.nick} pos={h.v} color="#ffcf9e" size={0.7} />)}
      <Feeders reduced={reduced} />
      <Pin pos={A} color="#ffd24a" size={1.1} />
      <Pin pos={B} color={arrived ? "#ffd400" : "#4aa8ff"} />
      <Route progress={progress} reduced={reduced} onArrive={onArrive} />
      <Celebration on={arrived} reduced={reduced} />
      <Rig progress={progress} reduced={reduced} user={user} api={api} onUser={onUser} />
      <OrbitControls
        enabled={interactive}
        enablePan={false}
        enableZoom={interactive && wheelZoom}
        enableDamping={!reduced}
        dampingFactor={0.08}
        rotateSpeed={0.55}
        zoomSpeed={0.6}
        minDistance={1.6}
        maxDistance={7}
        onStart={() => { user.current = true; onUser(true); }}
      />
    </Canvas>
  );
}
