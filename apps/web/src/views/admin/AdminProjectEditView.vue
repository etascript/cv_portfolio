<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import RetroButton from "@/components/retro/RetroButton.vue";
import RetroInput from "@/components/retro/RetroInput.vue";
import RetroPanel from "@/components/retro/RetroPanel.vue";
import RetroTextarea from "@/components/retro/RetroTextarea.vue";
import { apiFetch } from "@/services/api";
import type { Project } from "@/types/content";

const route = useRoute();
const router = useRouter();
const saved = ref(false);
const uploadMessage = ref("");
const imageFile = ref<File | null>(null);
const form = reactive({
  slug: "",
  title: "",
  shortDescriptionEs: "",
  shortDescriptionEn: "",
  descriptionEs: "",
  descriptionEn: "",
  categoryId: "1",
  sortOrder: "10",
  featured: false,
  published: true,
  githubUrl: "",
  demoUrl: ""
});

onMounted(async () => {
  if (!route.params.id) return;
  const project = await apiFetch<Project>(`/admin/projects/${route.params.id}`);
  Object.assign(form, {
    ...project,
    categoryId: String(project.categoryId),
    sortOrder: String(project.sortOrder)
  });
});

async function save() {
  const payload = {
    ...form,
    categoryId: Number(form.categoryId),
    sortOrder: Number(form.sortOrder)
  };
  const id = route.params.id;
  await apiFetch(id ? `/admin/projects/${id}` : "/admin/projects", {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(payload)
  });
  saved.value = true;
  if (!id) router.push("/admin/projects");
}

async function remove() {
  if (!route.params.id) return;
  await apiFetch(`/admin/projects/${route.params.id}`, { method: "DELETE" });
  router.push("/admin/projects");
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  imageFile.value = input.files?.[0] ?? null;
}

async function uploadImage() {
  if (!route.params.id || !imageFile.value) return;
  const body = new FormData();
  body.append("file", imageFile.value);
  body.append("altEs", `Screenshot de ${form.title}`);
  body.append("altEn", `Screenshot for ${form.title}`);
  await apiFetch(`/admin/projects/${route.params.id}/images`, { method: "POST", body });
  uploadMessage.value = "Imagen subida.";
}
</script>

<template>
  <RetroPanel :title="route.params.id ? 'Edit Project' : 'New Project'">
    <form class="form-stack" @submit.prevent="save">
      <RetroInput id="title" v-model="form.title" label="Title" required />
      <RetroInput id="slug" v-model="form.slug" label="Slug" required />
      <RetroInput id="short-es" v-model="form.shortDescriptionEs" label="Short description ES" required />
      <RetroInput id="short-en" v-model="form.shortDescriptionEn" label="Short description EN" required />
      <RetroTextarea id="desc-es" v-model="form.descriptionEs" label="Description ES" />
      <RetroTextarea id="desc-en" v-model="form.descriptionEn" label="Description EN" />
      <RetroInput id="category" v-model="form.categoryId" label="Category ID" />
      <RetroInput id="sort" v-model="form.sortOrder" label="Sort order" />
      <RetroInput id="github" v-model="form.githubUrl" label="GitHub URL" />
      <RetroInput id="demo" v-model="form.demoUrl" label="Demo URL" />
      <label><input v-model="form.featured" type="checkbox" /> Featured</label>
      <label><input v-model="form.published" type="checkbox" /> Published</label>
      <div v-if="route.params.id" class="form-stack">
        <label class="field" for="project-image">
          <span>Screenshot / image</span>
          <input id="project-image" class="retro-input" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" @change="onFileChange" />
        </label>
        <RetroButton type="button" @click="uploadImage">Upload image</RetroButton>
        <p v-if="uploadMessage" role="status">{{ uploadMessage }}</p>
      </div>
      <RetroButton type="submit" variant="primary">Save</RetroButton>
      <RetroButton v-if="route.params.id" type="button" @click="remove">Delete</RetroButton>
      <p v-if="saved">Guardado.</p>
    </form>
  </RetroPanel>
</template>
