<script setup lang="ts">
defineProps<{
  title?: string;
  icon?: string;
  compact?: boolean;
}>();
</script>

<template>
  <section class="retro-window" :class="{ 'retro-window--compact': compact }">
    <div v-if="title" class="retro-titlebar">
      <span v-if="icon" aria-hidden="true" class="retro-titlebar__icon">{{ icon }}</span>
      <span>{{ title }}</span>
      <span class="retro-titlebar__controls" aria-hidden="true">
        <span></span><span></span><span></span>
      </span>
    </div>
    <div class="retro-window__body">
      <slot />
    </div>
  </section>
</template>
