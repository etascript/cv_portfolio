<script setup lang="ts">
import { onMounted, ref } from "vue";
import RetroButton from "@/components/retro/RetroButton.vue";
import RetroPanel from "@/components/retro/RetroPanel.vue";
import { apiFetch } from "@/services/api";
import { fallbackContent } from "@/services/content";
import type { Project } from "@/types/content";

const projects = ref<Project[]>([]);

onMounted(async () => {
  try {
    projects.value = await apiFetch<Project[]>("/admin/projects");
  } catch {
    projects.value = fallbackContent.projects;
  }
});
</script>

<template>
  <RetroPanel title="Projects">
    <RouterLink to="/admin/projects/new"><RetroButton variant="primary">New Project</RetroButton></RouterLink>
    <table class="admin-table" style="margin-top: 12px">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Status</th>
          <th>Sort</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in projects" :key="project.id">
          <td>{{ project.title }}</td>
          <td>{{ project.categorySlug }}</td>
          <td>{{ project.published ? "Published" : "Draft" }} {{ project.featured ? "/ Featured" : "" }}</td>
          <td>{{ project.sortOrder }}</td>
          <td><RouterLink class="retro-link" :to="`/admin/projects/${project.id}/edit`">Edit</RouterLink></td>
        </tr>
      </tbody>
    </table>
  </RetroPanel>
</template>
