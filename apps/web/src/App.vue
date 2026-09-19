<script setup lang="ts">
import { onMounted } from "vue";
import PixelTrail from "@/components/effects/PixelTrail.vue";
import { useThemeStore } from "@/stores/theme";
import { useKonami } from "@/composables/useKonami";

const theme = useThemeStore();
const { enabled: consoleOpen } = useKonami();

onMounted(() => theme.init());
</script>

<template>
  <RouterView />
  <PixelTrail />
  <aside v-if="consoleOpen" class="secret-console" aria-live="polite">
    <strong>C:\></strong> idea_to_interface_
  </aside>
</template>
