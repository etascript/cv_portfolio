<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

type ThreeModule = typeof import("three");

let THREE: ThreeModule | undefined;
const container = ref<HTMLElement | null>(null);
const reducedMotion = ref(false);
let renderer: import("three").WebGLRenderer | undefined;
let scene: import("three").Scene | undefined;
let camera: import("three").PerspectiveCamera | undefined;
let group: import("three").Group | undefined;
let frame = 0;
let resizeObserver: ResizeObserver | undefined;
let pointerX = 0;
let pointerY = 0;

onMounted(async () => {
  reducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!container.value || reducedMotion.value) return;

  THREE = await import("three");
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.z = 5.4;

  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.value.appendChild(renderer.domElement);

  group = createConstellation();
  scene.add(group);
  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const light = new THREE.DirectionalLight(0xffffff, 1.1);
  light.position.set(2, 3, 4);
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

function createConstellation() {
  if (!THREE) throw new Error("Three.js has not been loaded");
  const T = THREE;
  const root = new T.Group();
  const positions = [
    new T.Vector3(-1.15, 0.95, 0.15),
    new T.Vector3(0.2, 0.25, -0.12),
    new T.Vector3(1.05, -0.72, 0.2)
  ];
  const nodeMaterial = new T.MeshLambertMaterial({ color: 0x52f2a8, flatShading: true });
  const haloMaterial = new T.MeshBasicMaterial({ color: 0x245edb, wireframe: true, transparent: true, opacity: 0.48 });
  const lineMaterial = new T.LineBasicMaterial({ color: 0x4da3ff, transparent: true, opacity: 0.72 });

  positions.forEach((position, index) => {
    const node = new T.Mesh(new T.BoxGeometry(0.22, 0.22, 0.22), nodeMaterial);
    node.position.copy(position);
    node.rotation.set(index * 0.6, index * 0.4, 0.2);
    root.add(node);

    const halo = new T.Mesh(new T.IcosahedronGeometry(0.34 + index * 0.04, 1), haloMaterial);
    halo.position.copy(position);
    root.add(halo);
  });

  const line = new T.Line(new T.BufferGeometry().setFromPoints(positions), lineMaterial);
  root.add(line);

  for (let i = 0; i < 16; i += 1) {
    const pixel = new T.Mesh(
      new T.BoxGeometry(0.035, 0.035, 0.035),
      new T.MeshBasicMaterial({ color: i % 3 === 0 ? 0xd6a700 : 0xb9c3ca, transparent: true, opacity: 0.8 })
    );
    const angle = (i / 16) * Math.PI * 2;
    pixel.position.set(Math.cos(angle) * 1.75, Math.sin(angle * 1.4) * 1.05, Math.sin(angle) * 0.45);
    root.add(pixel);
  }

  return root;
}

function onPointerMove(event: PointerEvent) {
  if (!container.value) return;
  const rect = container.value.getBoundingClientRect();
  pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.34;
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
  if (!renderer || !scene || !camera || !group) return;
  group.rotation.y += 0.004;
  group.rotation.x += (pointerY - group.rotation.x) * 0.035;
  group.rotation.z += (pointerX - group.rotation.z) * 0.035;
  renderer.render(scene, camera);
  frame = requestAnimationFrame(animate);
}
</script>

<template>
  <div ref="container" class="about-three about-three--experience" aria-hidden="true">
    <div v-if="reducedMotion" class="about-three__fallback">
      <span></span><span></span><span></span>
    </div>
  </div>
</template>
