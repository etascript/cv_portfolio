<script setup lang="ts">
import RetroBrowserFrame from "@/components/retro/RetroBrowserFrame.vue";
</script>

<template>
  <div class="admin-layout">
    <RetroBrowserFrame title="Control Panel" url="http://sebastian_cortes.cv/admin">
      <aside class="sidebar">
        <RouterLink class="brand" to="/admin">Seba Cortés<span class="blink">_</span></RouterLink>
        <ul class="nav-list">
          <li><RouterLink class="nav-link" to="/admin">General</RouterLink></li>
          <li><RouterLink class="nav-link" to="/admin/projects">Projects</RouterLink></li>
          <li><RouterLink class="nav-link" to="/admin/login">Login</RouterLink></li>
        </ul>
      </aside>
      <main class="page">
        <RouterView />
      </main>
    </RetroBrowserFrame>
  </div>
</template>
