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
const capabilities = computed(() => locale.value === "es"
  ? [
      { icon: "</>", title: "Desarrollo Web", body: "Laravel, Vue, PHP, MySQL y más." },
      { icon: "⚙", title: "Automatización", body: "Optimizo procesos y construyo herramientas." },
      { icon: "▣", title: "Videojuegos", body: "Proyectos personales y prototipos." },
      { icon: "▤", title: "Aprendizaje", body: "Tecnología, música, VR y lo que se cruce en el camino." }
    ]
  : [
      { icon: "</>", title: "Web Development", body: "Laravel, Vue, PHP, MySQL and more." },
      { icon: "⚙", title: "Automation", body: "I optimize processes and build tools." },
      { icon: "▣", title: "Games", body: "Personal projects and prototypes." },
      { icon: "▤", title: "Learning", body: "Technology, music, VR and whatever crosses the path." }
    ]);

onMounted(async () => {
  content.value = await getPortfolioContent();
});

useSeo(
  () => content.value?.settings.siteTitle ?? "Inicio",
  () => locale.value === "es"
    ? content.value?.settings.metaDescriptionEs ?? t("home.lead")
    : content.value?.settings.metaDescriptionEn ?? t("home.lead"),
  {
    type: () => "profile",
    image: () => "/assets/branding/sebastian-cortes-portrait.png",
    jsonLd: () => [
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Sebastián Cortés",
        alternateName: "Seba Cortés",
        jobTitle: locale.value === "es" ? "Ingeniero en software y desarrollador full stack" : "Software engineer and full-stack developer",
        url: window.location.origin,
        image: `${window.location.origin}/assets/branding/sebastian-cortes-portrait.png`,
        email: content.value?.settings.email ? `mailto:${content.value.settings.email}` : undefined,
        sameAs: [content.value?.settings.githubUrl, content.value?.settings.linkedinUrl].filter(Boolean)
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Sebastián Cortés",
        url: window.location.origin,
        inLanguage: ["es-CL", "en"]
      }
    ]
  }
);
</script>

<template>
  <section class="home-hero" aria-labelledby="home-title">
    <div class="home-section-label">01. HOLA</div>
    <div class="home-hero__main">
      <h1 id="home-title">
        Sebastián Cortés
        <span>{{ t("home.name") }}</span>
        <strong>{{ t("home.role") }}</strong>
      </h1>
      <p>{{ t("home.lead") }}</p>
      <div class="hero-actions">
        <RouterLink :to="`${pathBase}/projects`">
          <RetroButton variant="primary">{{ t("common.viewProjects") }} →</RetroButton>
        </RouterLink>
        <RouterLink class="retro-link" :to="`${pathBase}/about`">{{ t("common.aboutMe") }} →</RouterLink>
      </div>
    </div>
    <aside class="home-identity" aria-label="Sebastián Cortés">
      <div class="home-section-label">// 02. SEBA.EXE</div>
      <RetroGlobe />
      <p><strong>Sebastián Cortés</strong></p>
      <p>C:\&gt; etascript<span class="blink">_</span></p>
    </aside>
  </section>

  <RetroPanel class="home-capabilities">
    <div class="home-section-label">03. {{ locale === "es" ? "QUÉ HAGO" : "WHAT I DO" }}</div>
    <div class="home-capabilities__grid">
      <article v-for="item in capabilities" :key="item.title">
        <span aria-hidden="true">{{ item.icon }}</span>
        <h2>{{ item.title }}</h2>
        <p>{{ item.body }}</p>
      </article>
    </div>
  </RetroPanel>

  <RetroPanel class="home-featured" :title="`04. ${locale === 'es' ? 'Proyectos destacados' : 'Featured projects'}`">
    <div class="project-grid">
      <article v-for="project in featured" :key="project.id" class="project-card">
        <div class="project-shot">
          <img :src="project.images[0]?.imagePath" :alt="locale === 'es' ? project.images[0]?.altEs : project.images[0]?.altEn" />
        </div>
        <h3>{{ project.title }}</h3>
        <p>{{ locale === "es" ? project.shortDescriptionEs : project.shortDescriptionEn }}</p>
        <div class="badge-list">
          <RetroBadge v-for="tech in project.technologies.slice(0, 3)" :key="tech">{{ tech }}</RetroBadge>
        </div>
        <RouterLink class="retro-link" :to="`${pathBase}/projects/${project.slug}`">{{ t("projects.view") }} →</RouterLink>
      </article>
    </div>
    <p class="home-featured__all">
      <RouterLink class="retro-link" :to="`${pathBase}/projects`">{{ locale === "es" ? "Ver todos los proyectos" : "View all projects" }} →</RouterLink>
    </p>
  </RetroPanel>
</template>
