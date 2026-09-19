<script setup lang="ts">
defineProps<{ left?: string; right?: string }>();
</script>

<template>
  <footer class="retro-statusbar">
    <span>{{ left ?? "Listo" }}</span>
    <span>{{ right ?? "Internet" }}</span>
  </footer>
</template>
