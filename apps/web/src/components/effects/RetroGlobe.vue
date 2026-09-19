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
    new T.IcosahedronGeometry(1.22, 3),
    new T.MeshLambertMaterial({
      color: 0x245edb,
      flatShading: true,
      transparent: true,
      opacity: 0.92
    })
  );
  const wire = new T.Mesh(
    new T.IcosahedronGeometry(1.235, 2),
    new T.MeshBasicMaterial({
      color: 0x52f2a8,
      wireframe: true,
      transparent: true,
      opacity: 0.42
    })
  );
  const landMaterial = new T.MeshLambertMaterial({ color: 0x00d084, flatShading: true });
  [
    [-0.44, 0.36, 0.96, 0.34],
    [0.42, 0.05, 1.02, 0.27],
    [0.08, -0.52, 1.01, 0.22],
    [-0.75, -0.18, 0.86, 0.18]
  ].forEach(([x, y, z, scale]) => {
    const land = new T.Mesh(new T.DodecahedronGeometry(scale, 0), landMaterial);
    land.position.set(x, y, z);
    land.lookAt(0, 0, 0);
    group.add(land);
  });
  group.add(surface, wire);
  return group;
}

function createStars() {
  if (!THREE) throw new Error("Three.js has not been loaded");
  const T = THREE;
  const group = new T.Group();
  const material = new T.MeshBasicMaterial({ color: 0xd6a700 });
  for (let i = 0; i < 18; i += 1) {
    const pixel = new T.Mesh(new T.BoxGeometry(0.035, 0.035, 0.035), material);
    const angle = (i / 18) * Math.PI * 2;
    pixel.position.set(Math.cos(angle) * 1.82, Math.sin(angle * 1.7) * 0.42, Math.sin(angle) * 1.82);
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
  globe.rotation.y += 0.006;
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
