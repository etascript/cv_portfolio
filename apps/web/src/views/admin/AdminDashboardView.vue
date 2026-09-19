<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import RetroButton from "@/components/retro/RetroButton.vue";
import RetroInput from "@/components/retro/RetroInput.vue";
import RetroPanel from "@/components/retro/RetroPanel.vue";
import RetroTabs from "@/components/retro/RetroTabs.vue";
import RetroTextarea from "@/components/retro/RetroTextarea.vue";
import { apiFetch } from "@/services/api";
import { fallbackContent } from "@/services/content";

interface EditableExperience {
  period: string;
  company: string;
  roleEs: string;
  roleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  sortOrder: number;
}

interface EditableTechnologyGroup {
  name: string;
  sortOrder: number;
  technologiesText: string;
}

const active = ref("general");
const tabs = [
  { id: "general", label: "General" },
  { id: "experience", label: "Experience" },
  { id: "technologies", label: "Technologies" },
  { id: "translations", label: "Translations" },
  { id: "seo", label: "SEO" }
];
const saved = ref("");
const settings = reactive({
  ...fallbackContent.settings,
  siteTitle: "Sebastián Cortés",
  metaDescriptionEs: "CV virtual y portfolio de Sebastián Cortés.",
  metaDescriptionEn: "Sebastián Cortés' virtual CV and portfolio."
});
const experiences = ref<EditableExperience[]>([]);
const technologyGroups = ref<EditableTechnologyGroup[]>([]);
const translationsJson = ref("[]");

onMounted(async () => {
  try {
    const payload = await apiFetch<any>("/admin/content-management");
    Object.assign(settings, payload.settings);
    experiences.value = payload.experiences.map(toEditableExperience);
    technologyGroups.value = payload.technologies.map(toEditableTechnologyGroup);
    translationsJson.value = JSON.stringify(payload.translations, null, 2);
  } catch {
    experiences.value = fallbackContent.experiences.map(toEditableExperience);
    technologyGroups.value = fallbackContent.technologies.map(toEditableTechnologyGroup);
  }
});

function toEditableExperience(item: any): EditableExperience {
  return {
    period: item.period ?? "",
    company: item.company ?? "",
    roleEs: item.roleEs ?? "",
    roleEn: item.roleEn ?? "",
    descriptionEs: item.descriptionEs ?? "",
    descriptionEn: item.descriptionEn ?? "",
    sortOrder: Number(item.sortOrder ?? 0)
  };
}

function toEditableTechnologyGroup(item: any): EditableTechnologyGroup {
  return {
    name: item.name ?? "",
    sortOrder: Number(item.sortOrder ?? 0),
    technologiesText: (item.technologies ?? []).join("\n")
  };
}

function addExperience() {
  experiences.value.push({ period: "", company: "", roleEs: "", roleEn: "", descriptionEs: "", descriptionEn: "", sortOrder: experiences.value.length + 1 });
}

function removeExperience(index: number) {
  experiences.value.splice(index, 1);
}

function addTechnologyGroup() {
  technologyGroups.value.push({ name: "", sortOrder: technologyGroups.value.length + 1, technologiesText: "" });
}

function removeTechnologyGroup(index: number) {
  technologyGroups.value.splice(index, 1);
}

async function saveSettings() {
  await apiFetch("/admin/settings", { method: "PUT", body: JSON.stringify(settings) });
  saved.value = "General guardado.";
}

async function saveExperiences() {
  await apiFetch("/admin/experiences", { method: "PUT", body: JSON.stringify(experiences.value) });
  saved.value = "Experience guardado.";
}

async function saveTechnologies() {
  const payload = technologyGroups.value.map((group) => ({
    name: group.name,
    sortOrder: Number(group.sortOrder),
    technologies: group.technologiesText.split("\n").map((item) => item.trim()).filter(Boolean)
  }));
  await apiFetch("/admin/technologies", { method: "PUT", body: JSON.stringify(payload) });
  saved.value = "Technologies guardado.";
}

async function saveTranslations() {
  await apiFetch("/admin/translations", { method: "PUT", body: translationsJson.value });
  saved.value = "Translations guardado.";
}
</script>

<template>
  <RetroPanel title="SEBA CORTES CONTROL PANEL">
    <p>Panel administrativo para contenido, proyectos, tecnologias, traducciones y SEO.</p>
    <RetroTabs :tabs="tabs" :active="active" @change="active = $event" />

    <form v-if="active === 'general'" class="form-stack" @submit.prevent="saveSettings">
      <RetroInput id="github" v-model="settings.githubUrl" label="GitHub URL" />
      <RetroInput id="linkedin" v-model="settings.linkedinUrl" label="LinkedIn URL" />
      <RetroInput id="email" v-model="settings.email" label="Email" />
      <RetroInput id="location-es" v-model="settings.locationEs" label="Location ES" />
      <RetroInput id="location-en" v-model="settings.locationEn" label="Location EN" />
      <RetroButton type="submit" variant="primary">Save General</RetroButton>
    </form>

    <form v-else-if="active === 'experience'" class="form-stack" @submit.prevent="saveExperiences">
      <RetroPanel v-for="(item, index) in experiences" :key="index" :title="`Experience ${index + 1}`">
        <div class="form-stack">
          <RetroInput :id="`period-${index}`" v-model="item.period" label="Period" />
          <RetroInput :id="`company-${index}`" v-model="item.company" label="Company" />
          <RetroInput :id="`role-es-${index}`" v-model="item.roleEs" label="Role ES" />
          <RetroInput :id="`role-en-${index}`" v-model="item.roleEn" label="Role EN" />
          <RetroTextarea :id="`description-es-${index}`" v-model="item.descriptionEs" label="Description ES" />
          <RetroTextarea :id="`description-en-${index}`" v-model="item.descriptionEn" label="Description EN" />
          <RetroInput :id="`sort-experience-${index}`" v-model="item.sortOrder" label="Sort order" type="number" />
          <RetroButton type="button" @click="removeExperience(index)">Remove</RetroButton>
        </div>
      </RetroPanel>
      <RetroButton type="button" @click="addExperience">Add experience</RetroButton>
      <RetroButton type="submit" variant="primary">Save Experience</RetroButton>
    </form>

    <form v-else-if="active === 'technologies'" class="form-stack" @submit.prevent="saveTechnologies">
      <RetroPanel v-for="(group, index) in technologyGroups" :key="index" :title="`Group ${index + 1}`">
        <div class="form-stack">
          <RetroInput :id="`tech-name-${index}`" v-model="group.name" label="Group name" />
          <RetroInput :id="`tech-sort-${index}`" v-model="group.sortOrder" label="Sort order" type="number" />
          <RetroTextarea :id="`tech-items-${index}`" v-model="group.technologiesText" label="Technologies, one per line" />
          <RetroButton type="button" @click="removeTechnologyGroup(index)">Remove</RetroButton>
        </div>
      </RetroPanel>
      <RetroButton type="button" @click="addTechnologyGroup">Add group</RetroButton>
      <RetroButton type="submit" variant="primary">Save Technologies</RetroButton>
    </form>

    <form v-else-if="active === 'translations'" class="form-stack" @submit.prevent="saveTranslations">
      <RetroTextarea id="translations-json" v-model="translationsJson" label="Translations JSON" :rows="14" />
      <RetroButton type="submit" variant="primary">Save Translations</RetroButton>
    </form>

    <form v-else class="form-stack" @submit.prevent="saveSettings">
      <RetroInput id="site-title" v-model="settings.siteTitle" label="Site title" />
      <RetroInput id="meta-es" v-model="settings.metaDescriptionEs" label="Meta description ES" />
      <RetroInput id="meta-en" v-model="settings.metaDescriptionEn" label="Meta description EN" />
      <RetroButton type="submit" variant="primary">Save SEO</RetroButton>
    </form>

    <p v-if="saved" role="status">{{ saved }}</p>
    <RetroPanel title="Projects" style="margin-top: 16px">
      <p>CRUD de proyectos con orden, publicacion y destacados.</p>
      <RouterLink class="retro-link" to="/admin/projects">Abrir Projects -></RouterLink>
    </RetroPanel>
  </RetroPanel>
</template>
