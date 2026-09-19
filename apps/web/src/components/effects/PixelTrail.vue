<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";

let enabled = false;
let last = 0;

onMounted(() => {
  enabled = window.matchMedia("(min-width: 768px)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!enabled) return;
  window.addEventListener("pointermove", spawnPixel, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("pointermove", spawnPixel);
});

function spawnPixel(event: PointerEvent) {
  const now = performance.now();
  if (now - last < 34) return;
  last = now;
  const pixel = document.createElement("span");
  pixel.className = "pixel-trail";
  pixel.style.left = `${event.clientX}px`;
  pixel.style.top = `${event.clientY}px`;
  document.body.appendChild(pixel);
  window.setTimeout(() => pixel.remove(), 520);
}
</script>

<template>
  <span aria-hidden="true"></span>
</template>
