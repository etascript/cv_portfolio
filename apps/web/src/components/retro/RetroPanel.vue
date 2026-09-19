<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<template>
  <section class="retro-panel">
    <h2 v-if="title" class="retro-panel__title">{{ title }}</h2>
    <slot />
  </section>
</template>
