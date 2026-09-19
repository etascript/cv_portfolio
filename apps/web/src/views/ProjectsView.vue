<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import RetroBadge from "@/components/retro/RetroBadge.vue";
import RetroPanel from "@/components/retro/RetroPanel.vue";
import { getPortfolioContent } from "@/services/content";
import type { PortfolioPayload } from "@/types/content";
import { useSeo } from "@/composables/useSeo";

const { t, locale } = useI18n();
const content = ref<PortfolioPayload>();
const filter = ref("all");
const pathBase = computed(() => `/${locale.value}`);
const filters = computed(() => [
  { slug: "all", label: t("projects.all") },
  ...(content.value?.categories.map((category) => ({ slug: category.slug, label: locale.value === "es" ? category.labelEs : category.labelEn })) ?? [])
]);
const projects = computed(() => {
  const published = content.value?.projects.filter((project) => project.published) ?? [];
  return filter.value === "all" ? published : published.filter((project) => project.categorySlug === filter.value);
});

onMounted(async () => {
  content.value = await getPortfolioContent();
});

useSeo(() => t("projects.title"), () => "Proyectos web, herramientas, juegos y experimentos de Sebastián Cortés");
</script>

<template>
  <RetroPanel :title="t('projects.title')">
    <div class="filters" aria-label="Project filters">
      <button
        v-for="item in filters"
        :key="item.slug"
        class="filter-button"
        :class="{ 'is-active': filter === item.slug }"
        type="button"
        @click="filter = item.slug"
      >
        [ {{ item.label }} ]
      </button>
    </div>
    <div class="project-grid">
      <article v-for="project in projects" :key="project.id" class="project-card">
        <img :src="project.images[0]?.imagePath" :alt="locale === 'es' ? project.images[0]?.altEs : project.images[0]?.altEn" />
        <h3>{{ project.title }}</h3>
        <p>{{ locale === "es" ? project.shortDescriptionEs : project.shortDescriptionEn }}</p>
        <div class="badge-list">
          <RetroBadge v-for="tech in project.technologies" :key="tech">{{ tech }}</RetroBadge>
        </div>
        <RouterLink class="retro-link" :to="`${pathBase}/projects/${project.slug}`">{{ t("projects.view") }} →</RouterLink>
      </article>
    </div>
  </RetroPanel>
</template>
