<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import RetroBadge from "@/components/retro/RetroBadge.vue";
import RetroButton from "@/components/retro/RetroButton.vue";
import RetroPanel from "@/components/retro/RetroPanel.vue";
import { getProject } from "@/services/content";
import type { Project } from "@/types/content";
import { useSeo } from "@/composables/useSeo";

const route = useRoute();
const { t, locale } = useI18n();
const project = ref<Project>();
const pathBase = computed(() => `/${locale.value}`);
const body = computed(() => {
  if (!project.value) return undefined;
  return {
    description: locale.value === "es" ? project.value.descriptionEs : project.value.descriptionEn,
    problem: locale.value === "es" ? project.value.problemEs : project.value.problemEn,
    solution: locale.value === "es" ? project.value.solutionEs : project.value.solutionEn,
    notes: locale.value === "es" ? project.value.technicalNotesEs : project.value.technicalNotesEn,
    lessons: locale.value === "es" ? project.value.lessonsLearnedEs : project.value.lessonsLearnedEn
  };
});

onMounted(async () => {
  project.value = await getProject(String(route.params.slug));
});

useSeo(
  () => project.value?.title ?? "Proyecto",
  () => body.value?.description ?? "Case study de Sebastián Cortés",
  {
    type: () => "article",
    image: () => project.value?.images[0]?.imagePath,
    jsonLd: () => project.value
      ? {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.value.title,
          description: body.value?.description,
          url: window.location.href,
          image: project.value.images[0]?.imagePath ? `${window.location.origin}${project.value.images[0].imagePath}` : undefined,
          creator: {
            "@type": "Person",
            name: "Sebastián Cortés"
          },
          programmingLanguage: project.value.technologies,
          codeRepository: project.value.githubUrl || undefined
        }
      : undefined
  }
);
</script>

<template>
  <RouterLink class="retro-link" :to="`${pathBase}/projects`">← {{ t("common.backProjects") }}</RouterLink>
  <RetroPanel v-if="project" class="case-study" :title="`${project.title}_`" style="margin-top: 12px">
    <img class="project-hero-image" :src="project.images[0]?.imagePath" :alt="locale === 'es' ? project.images[0]?.altEs : project.images[0]?.altEn" />
    <h3>Descripción</h3>
    <p>{{ body?.description }}</p>
    <h3>El problema / idea</h3>
    <p>{{ body?.problem }}</p>
    <h3>Cómo funciona</h3>
    <p>{{ body?.solution }}</p>
    <h3>Tecnologías</h3>
    <div class="badge-list">
      <RetroBadge v-for="tech in project.technologies" :key="tech">{{ tech }}</RetroBadge>
    </div>
    <h3>Decisiones técnicas</h3>
    <p>{{ body?.notes }}</p>
    <h3>Qué aprendí</h3>
    <p>{{ body?.lessons }}</p>
    <div class="hero-actions">
      <a v-if="project.githubUrl" :href="project.githubUrl"><RetroButton>{{ t("common.github") }}</RetroButton></a>
      <a v-if="project.demoUrl" :href="project.demoUrl"><RetroButton variant="primary">{{ t("common.demo") }}</RetroButton></a>
    </div>
  </RetroPanel>
  <RetroPanel v-else title="404_">
    <p>Proyecto no encontrado.</p>
  </RetroPanel>
</template>
