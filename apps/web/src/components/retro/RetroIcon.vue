<script setup lang="ts">
defineProps<{ name: string; label?: string }>();
</script>

<template>
  <span class="retro-icon" :aria-label="label" :title="label">
    <img :src="`/assets/icons/${name}.svg`" alt="" aria-hidden="true" />
  </span>
</template>
