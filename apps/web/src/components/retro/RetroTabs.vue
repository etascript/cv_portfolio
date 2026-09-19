<script setup lang="ts">
defineProps<{ tabs: { id: string; label: string }[]; active: string }>();
defineEmits<{ change: [id: string] }>();
</script>

<template>
  <div class="retro-tabs" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="retro-tab"
      :class="{ 'is-active': active === tab.id }"
      type="button"
      role="tab"
      :aria-selected="active === tab.id"
      @click="$emit('change', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
