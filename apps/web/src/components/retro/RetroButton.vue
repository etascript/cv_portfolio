<script setup lang="ts">
withDefaults(defineProps<{ type?: "button" | "submit"; variant?: "default" | "primary" | "ghost" }>(), {
  type: "button",
  variant: "default"
});
</script>

<template>
  <button class="retro-button" :class="`retro-button--${variant}`" :type="type">
    <slot />
  </button>
</template>
