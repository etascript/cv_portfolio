<script setup lang="ts">
defineProps<{ to?: string; href?: string }>();
</script>

<template>
  <RouterLink v-if="to" class="retro-link" :to="to"><slot /></RouterLink>
  <a v-else class="retro-link" :href="href"><slot /></a>
</template>
