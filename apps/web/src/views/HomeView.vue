<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import RetroGlobe from "@/components/effects/RetroGlobe.vue";
import RetroBadge from "@/components/retro/RetroBadge.vue";
import RetroButton from "@/components/retro/RetroButton.vue";
import RetroPanel from "@/components/retro/RetroPanel.vue";
import { getPortfolioContent } from "@/services/content";
import type { PortfolioPayload } from "@/types/content";
import { useSeo } from "@/composables/useSeo";

const { t, locale } = useI18n();
const content = ref<PortfolioPayload>();
const featured = computed(() => content.value?.projects.filter((project) => project.featured && project.published).slice(0, 3) ?? []);
const pathBase = computed(() => `/${locale.value}`);

onMounted(async () => {
  content.value = await getPortfolioContent();
});

useSeo(
  () => content.value?.settings.siteTitle ?? "Inicio",
  () => locale.value === "es"
    ? content.value?.settings.metaDescriptionEs ?? t("home.lead")
    : content.value?.settings.metaDescriptionEn ?? t("home.lead")
);
</script>

<template>
  <div class="page-grid">
    <section class="hero">
      <h1>
        {{ t("home.hello") }}<br />
        {{ t("home.name") }}<br />
        <span class="hero__role">{{ t("home.role") }}</span><br />
        <!-- {{ t("home.place") }} -->
      </h1>
      <p>{{ t("home.lead") }}</p>
      <!-- <p>{{ t("home.body") }}</p> -->
      <div class="hero-actions">
        <RouterLink :to="`${pathBase}/projects`"><RetroButton variant="primary">{{ t("common.viewProjects") }} →</RetroButton></RouterLink>
        <RouterLink class="retro-link" :to="`${pathBase}/about`">{{ t("common.aboutMe") }} →</RouterLink>
      </div>
    </section>

    <RetroPanel>
      <RetroGlobe />
      <p><strong>Sebastián Cortés<span class="blink">_</span></strong></p>
      <p>C:\&gt; etascript</p>
    </RetroPanel>
  </div>

  <RetroPanel :title="t('home.featured')" style="margin-top: 24px">
    <div class="project-grid">
      <article v-for="project in featured" :key="project.id" class="project-card">
        <img :src="project.images[0]?.imagePath" :alt="locale === 'es' ? project.images[0]?.altEs : project.images[0]?.altEn" />
        <h3>{{ project.title }}</h3>
        <p>{{ locale === "es" ? project.shortDescriptionEs : project.shortDescriptionEn }}</p>
        <div class="badge-list">
          <RetroBadge v-for="tech in project.technologies.slice(0, 3)" :key="tech">{{ tech }}</RetroBadge>
        </div>
        <RouterLink class="retro-link" :to="`${pathBase}/projects/${project.slug}`">{{ t("projects.view") }} →</RouterLink>
      </article>
    </div>
  </RetroPanel>
</template>
