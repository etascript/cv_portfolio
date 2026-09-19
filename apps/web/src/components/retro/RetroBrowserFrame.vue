<script setup lang="ts">
import RetroStatusBar from "./RetroStatusBar.vue";
defineProps<{ title: string; url: string }>();
</script>

<template>
  <div class="browser-frame">
    <div class="retro-titlebar browser-frame__title">
      <span>sebastian_cortes.cv - {{ title }}</span>
      <span class="retro-titlebar__controls" aria-hidden="true"><span></span><span></span><span></span></span>
    </div>
    <div class="browser-frame__menu" aria-label="Browser menu">
      <span>Atrás</span><span>Edición</span><span>Ver</span><span>Favoritos</span><span>Herramientas</span><span>Ayuda</span>
    </div>
    <div class="browser-frame__address">
      <span>Dirección</span>
      <div>{{ url }}</div>
      <button type="button">Ir</button>
    </div>
    <div class="browser-frame__body">
      <slot />
    </div>
    <RetroStatusBar />
  </div>
</template>
