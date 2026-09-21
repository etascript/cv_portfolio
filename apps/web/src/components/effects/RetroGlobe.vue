<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

type ThreeModule = typeof import("three");

let THREE: ThreeModule | undefined;
const container = ref<HTMLElement | null>(null);
const reducedMotion = ref(false);
let renderer: import("three").WebGLRenderer | undefined;
let scene: import("three").Scene | undefined;
let camera: import("three").PerspectiveCamera | undefined;
let globe: import("three").Group | undefined;
let frame = 0;
let resizeObserver: ResizeObserver | undefined;
let pointerX = 0;
let pointerY = 0;
let orbitRing: import("three").Group | undefined;

onMounted(async () => {
  reducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!container.value || reducedMotion.value) return;
  THREE = await import("three");

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.z = 4.2;

  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.value.appendChild(renderer.domElement);

  globe = createGlobe();
  scene.add(globe);
  scene.add(createStars());

  const light = new THREE.DirectionalLight(0xffffff, 1.6);
  light.position.set(2, 2, 4);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.65));

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container.value);
  container.value.addEventListener("pointermove", onPointerMove);
  resize();
  animate();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  resizeObserver?.disconnect();
  container.value?.removeEventListener("pointermove", onPointerMove);
  renderer?.dispose();
  scene?.traverse((object) => {
    const mesh = object as import("three").Mesh;
    mesh.geometry?.dispose?.();
    const material = mesh.material;
    if (Array.isArray(material)) material.forEach((item) => item.dispose());
    else material?.dispose?.();
  });
});

function createGlobe() {
  if (!THREE) throw new Error("Three.js has not been loaded");
  const T = THREE;
  const group = new T.Group();

  const surface = new T.Mesh(
    new T.IcosahedronGeometry(1.24, 5),
    new T.MeshLambertMaterial({
      color: 0x006bd6,
      flatShading: true,
      transparent: true,
      opacity: 0.95
    })
  );

  const deepWater = new T.Mesh(
    new T.IcosahedronGeometry(1.205, 2),
    new T.MeshLambertMaterial({
      color: 0x003b7a,
      flatShading: true,
      transparent: true,
      opacity: 0.76
    })
  );

  const wire = new T.Mesh(
    new T.IcosahedronGeometry(1.255, 4),
    new T.MeshBasicMaterial({
      color: 0x8fd7ff,
      wireframe: true,
      transparent: true,
      opacity: 0.36
    })
  );

  const glow = new T.Mesh(
    new T.IcosahedronGeometry(1.33, 3),
    new T.MeshBasicMaterial({
      color: 0x31a9ff,
      wireframe: true,
      transparent: true,
      opacity: 0.16
    })
  );

  const landMaterial = new T.MeshLambertMaterial({
    color: 0x00d084,
    flatShading: true,
    transparent: true,
    opacity: 0.96,
    side: T.DoubleSide
  });

  const shadowLand = new T.MeshLambertMaterial({
    color: 0x007c54,
    flatShading: true,
    transparent: true,
    opacity: 0.72,
    side: T.DoubleSide
  });

  const landPatches: Array<[number, number, number, number, number, import("three").MeshLambertMaterial]> = [
    [56, -105, 0.27, 0.18, -0.35, landMaterial],
    [39, -96, 0.34, 0.24, 0.15, landMaterial],
    [18, -91, 0.2, 0.12, 0.2, landMaterial],
    [-9, -62, 0.26, 0.38, -0.08, landMaterial],
    [-31, -64, 0.18, 0.26, 0.2, landMaterial],
    [72, -42, 0.16, 0.1, 0.15, landMaterial],
    [12, -78, 0.11, 0.08, 0.1, landMaterial],
    [48, 14, 0.18, 0.12, 0.1, shadowLand],
    [4, 20, 0.27, 0.36, -0.1, shadowLand],
    [24, 78, 0.32, 0.2, 0.2, shadowLand],
    [-25, 134, 0.18, 0.14, -0.1, shadowLand]
  ];

  landPatches.forEach(([lat, lon, width, height, rotation, material]) => {
    group.add(createLandPatch(lat, lon, width, height, rotation, material));
  });

  orbitRing = createOrbitRings();
  group.add(deepWater, surface, ...createMeridians(), wire, glow, orbitRing);
  group.rotation.set(-0.18, -0.72, -0.1);
  return group;
}

function createLandPatch(
  lat: number,
  lon: number,
  width: number,
  height: number,
  rotation: number,
  material: import("three").MeshLambertMaterial
) {
  if (!THREE) throw new Error("Three.js has not been loaded");
  const T = THREE;
  const mesh = new T.Mesh(new T.CircleGeometry(1, 9), material);
  const position = latLonToVector(lat, lon, 1.275);
  mesh.position.copy(position);
  mesh.scale.set(width, height, 1);
  mesh.lookAt(position.clone().multiplyScalar(2));
  mesh.rotateZ(rotation);
  return mesh;
}

function latLonToVector(lat: number, lon: number, radius: number) {
  if (!THREE) throw new Error("Three.js has not been loaded");
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function createMeridians() {
  if (!THREE) throw new Error("Three.js has not been loaded");
  const T = THREE;
  const material = new T.LineBasicMaterial({ color: 0x52f2a8, transparent: true, opacity: 0.16 });
  const lines: import("three").LineLoop[] = [];

  for (let i = 0; i < 8; i += 1) {
    const points: import("three").Vector3[] = [];
    for (let step = 0; step < 96; step += 1) {
      const angle = (step / 96) * Math.PI * 2;
      points.push(new T.Vector3(Math.cos(angle) * 1.268, Math.sin(angle) * 1.268, 0));
    }
    const line = new T.LineLoop(new T.BufferGeometry().setFromPoints(points), material);
    line.rotation.y = (i / 8) * Math.PI;
    lines.push(line);
  }

  return lines;
}

function createOrbitRings() {
  if (!THREE) throw new Error("Three.js has not been loaded");
  const T = THREE;
  const group = new T.Group();
  const material = new T.LineBasicMaterial({ color: 0x4da3ff, transparent: true, opacity: 0.72 });

  [-0.58, 0.12, 0.66].forEach((tilt, index) => {
    const points: import("three").Vector3[] = [];
    for (let i = 0; i < 140; i += 1) {
      const angle = (i / 140) * Math.PI * 2;
      points.push(new T.Vector3(Math.cos(angle) * 1.95, Math.sin(angle) * 0.42, Math.sin(angle) * 0.22));
    }
    const ring = new T.LineLoop(new T.BufferGeometry().setFromPoints(points), material);
    ring.rotation.set(tilt, 0.42 + index * 0.28, -0.18);
    group.add(ring);

    const satellite = new T.Mesh(
      new T.BoxGeometry(0.055, 0.055, 0.055),
      new T.MeshBasicMaterial({ color: 0xa8efff })
    );
    satellite.position.copy(points[(index * 38 + 12) % points.length]);
    ring.add(satellite);
  });

  return group;
}

function createStars() {
  if (!THREE) throw new Error("Three.js has not been loaded");
  const T = THREE;
  const group = new T.Group();
  const blue = new T.MeshBasicMaterial({ color: 0x72cfff });
  const amber = new T.MeshBasicMaterial({ color: 0xd6a700 });
  for (let i = 0; i < 46; i += 1) {
    const pixel = new T.Mesh(new T.BoxGeometry(0.018 + (i % 3) * 0.012, 0.018 + (i % 3) * 0.012, 0.018), i % 7 === 0 ? amber : blue);
    const angle = (i / 46) * Math.PI * 2;
    const radius = 1.8 + (i % 5) * 0.34;
    pixel.position.set(Math.cos(angle * 1.9) * radius, Math.sin(angle * 2.7) * 1.05, Math.sin(angle) * radius);
    group.add(pixel);
  }
  return group;
}

function onPointerMove(event: PointerEvent) {
  if (!container.value) return;
  const rect = container.value.getBoundingClientRect();
  pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.24;
  pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.24;
}

function resize() {
  if (!container.value || !renderer || !camera) return;
  const { width, height } = container.value.getBoundingClientRect();
  renderer.setSize(Math.max(1, width), Math.max(1, height), false);
  camera.aspect = Math.max(1, width) / Math.max(1, height);
  camera.updateProjectionMatrix();
}

function animate() {
  if (!renderer || !scene || !camera || !globe) return;
  globe.rotation.y += 0.0032;
  if (orbitRing) orbitRing.rotation.z += 0.0045;
  globe.rotation.x += (pointerY - globe.rotation.x) * 0.035;
  globe.rotation.z += (pointerX - globe.rotation.z) * 0.035;
  renderer.render(scene, camera);
  frame = requestAnimationFrame(animate);
}
</script>

<template>
  <div ref="container" class="retro-globe" aria-hidden="true">
    <img v-if="reducedMotion" src="/assets/branding/sebastian-cortes-logo.svg" alt="" />
  </div>
</template>
