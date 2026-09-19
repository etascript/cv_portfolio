<script setup lang="ts">
defineProps<{ id: string; label: string; type?: string; modelValue: string | number; required?: boolean }>();
defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
  <label class="field" :for="id">
    <span>{{ label }}</span>
    <input
      :id="id"
      class="retro-input"
      :type="type ?? 'text'"
      :value="modelValue"
      :required="required"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>
