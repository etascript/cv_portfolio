<script setup lang="ts">
defineProps<{ id: string; label: string; modelValue: string; rows?: number; required?: boolean }>();
defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
  <label class="field" :for="id">
    <span>{{ label }}</span>
    <textarea
      :id="id"
      class="retro-input retro-textarea"
      :rows="rows ?? 6"
      :value="modelValue"
      :required="required"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>
  </label>
</template>
