<script setup lang="ts">
defineProps<{ groups: { name: string; items: string[] }[] }>();
</script>

<template>
  <div class="folder-tree" aria-label="Technology tree">
    <p>C:\&gt; tree skills /f</p>
    <ul>
      <li v-for="group in groups" :key="group.name">
        <span class="folder-tree__folder">▣ {{ group.name }}</span>
        <ul>
          <li v-for="item in group.items" :key="item">├── {{ item }}</li>
        </ul>
      </li>
    </ul>
  </div>
</template>
