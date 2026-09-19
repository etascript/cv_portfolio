<script setup lang="ts">
defineProps<{ title: string; open: boolean }>();
defineEmits<{ close: [] }>();
</script>

<template>
  <div v-if="open" class="dialog-backdrop" role="presentation" @click.self="$emit('close')">
    <div class="retro-window retro-dialog" role="dialog" aria-modal="true" :aria-label="title">
      <div class="retro-titlebar">
        <span>{{ title }}</span>
        <button class="titlebar-button" type="button" aria-label="Cerrar" @click="$emit('close')">x</button>
      </div>
      <div class="retro-window__body">
        <slot />
      </div>
    </div>
  </div>
</template>
