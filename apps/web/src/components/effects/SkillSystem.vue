<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

type ThreeModule = typeof import("three");

let THREE: ThreeModule | undefined;
const container = ref<HTMLElement | null>(null);
const reducedMotion = ref(false);
let renderer: import("three").WebGLRenderer | undefined;
let scene: import("three").Scene | undefined;
let camera: import("three").PerspectiveCamera | undefined;
let system: import("three").Group | undefined;
let frame = 0;
let resizeObserver: ResizeObserver | undefined;
let pointerX = 0;
let pointerY = 0;

onMounted(async () => {
  reducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!container.value || reducedMotion.value) return;

  THREE = await import("three");
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.z = 5.2;

  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.value.appendChild(renderer.domElement);

  system = createSkillSystem();
  scene.add(system);
  scene.add(new THREE.AmbientLight(0xffffff, 0.82));
  const light = new THREE.DirectionalLight(0xffffff, 1.25);
  light.position.set(1.5, 2.5, 4);
  scene.add(light);

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

function createSkillSystem() {
  if (!THREE) throw new Error("Three.js has not been loaded");
  const T = THREE;
  const root = new T.Group();
  const coreMaterial = new T.MeshLambertMaterial({ color: 0x52f2a8, flatShading: true });
  const nodeMaterial = new T.MeshLambertMaterial({ color: 0x245edb, flatShading: true });
  const warmMaterial = new T.MeshLambertMaterial({ color: 0xd6a700, flatShading: true });
  const lineMaterial = new T.LineBasicMaterial({ color: 0x4da3ff, transparent: true, opacity: 0.52 });

  const core = new T.Mesh(new T.BoxGeometry(0.34, 0.34, 0.34), coreMaterial);
  root.add(core);

  const points: import("three").Vector3[] = [];
  for (let i = 0; i < 10; i += 1) {
    const angle = (i / 10) * Math.PI * 2;
    const radius = i % 2 === 0 ? 1.25 : 1.75;
    const point = new T.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.62, Math.sin(angle) * 0.32);
    points.push(point);

    const node = new T.Mesh(new T.BoxGeometry(0.14, 0.14, 0.14), i % 3 === 0 ? warmMaterial : nodeMaterial);
    node.position.copy(point);
    node.rotation.set(i * 0.2, i * 0.5, i * 0.12);
    root.add(node);

    const line = new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(0, 0, 0), point]), lineMaterial);
    root.add(line);
  }

  const ring = new T.LineLoop(new T.BufferGeometry().setFromPoints(points), lineMaterial);
  root.add(ring);
  return root;
}

function onPointerMove(event: PointerEvent) {
  if (!container.value) return;
  const rect = container.value.getBoundingClientRect();
  pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.28;
  pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.22;
}

function resize() {
  if (!container.value || !renderer || !camera) return;
  const { width, height } = container.value.getBoundingClientRect();
  renderer.setSize(Math.max(1, width), Math.max(1, height), false);
  camera.aspect = Math.max(1, width) / Math.max(1, height);
  camera.updateProjectionMatrix();
}

function animate() {
  if (!renderer || !scene || !camera || !system) return;
  system.rotation.y += 0.005;
  system.rotation.x += (pointerY - system.rotation.x) * 0.035;
  system.rotation.z += (pointerX - system.rotation.z) * 0.035;
  renderer.render(scene, camera);
  frame = requestAnimationFrame(animate);
}
</script>

<template>
  <div ref="container" class="about-three about-three--skills" aria-hidden="true">
    <div v-if="reducedMotion" class="about-three__fallback">
      <span></span><span></span><span></span><span></span>
    </div>
  </div>
</template>
