<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import RetroBrowserFrame from "@/components/retro/RetroBrowserFrame.vue";
import RetroButton from "@/components/retro/RetroButton.vue";
import RetroDialog from "@/components/retro/RetroDialog.vue";
import { useThemeStore } from "@/stores/theme";

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const theme = useThemeStore();
const menuOpen = ref(false);
const aboutOpen = ref(false);

const currentLocale = computed(() => (route.params.locale === "en" ? "en" : "es"));
const pageTitle = computed(() => {
  const name = String(route.name ?? "home");
  if (name.includes("project")) return t("nav.projects");
  if (name === "about") return t("nav.about");
  if (name === "contact") return t("nav.contact");
  return t("nav.home");
});
const frameUrl = computed(() => `http://sebastian_cortes.cv${route.fullPath}`);

const nav = computed(() => [
  { to: `/${currentLocale.value}/`, label: t("nav.home"), icon: "⌂" },
  { to: `/${currentLocale.value}/about`, label: t("nav.about"), icon: "♙" },
  { to: `/${currentLocale.value}/projects`, label: t("nav.projects"), icon: "▣" },
  { to: `/${currentLocale.value}/contact`, label: t("nav.contact"), icon: "✉" }
]);

function switchLocale(next: "es" | "en") {
  const path = route.fullPath.replace(/^\/(es|en)/, `/${next}`);
  locale.value = next;
  router.push(path);
}
</script>

<template>
  <div class="app-shell">
    <header class="mobile-header">
      <button class="brand" type="button" @dblclick="aboutOpen = true">
        <img class="brand__mark" src="/assets/branding/sebastian-cortes-logo.svg" alt="" />
        Seba Cortés<span class="blink">_</span>
      </button>
      <RetroButton aria-label="Abrir menú" @click="menuOpen = true">☰</RetroButton>
    </header>

    <nav class="mobile-menu" :hidden="!menuOpen" aria-label="Mobile menu">
      <RetroButton aria-label="Cerrar menú" @click="menuOpen = false">x</RetroButton>
      <RouterLink v-for="item in nav" :key="item.to" :to="item.to" class="nav-link" @click="menuOpen = false">
        <span aria-hidden="true">{{ item.icon }}</span> {{ item.label }}
      </RouterLink>
      <hr class="retro-divider" />
      <a class="retro-link" href="https://github.com/sebastiancortes">GitHub</a>
      <a class="retro-link" href="https://linkedin.com/in/sebastiancortes">LinkedIn</a>
      <RetroButton @click="switchLocale(currentLocale === 'es' ? 'en' : 'es')">ES | EN</RetroButton>
      <RetroButton @click="theme.toggle()">{{ theme.mode === "dark" ? "☀" : "☾" }}</RetroButton>
    </nav>

    <RetroBrowserFrame :title="pageTitle" :url="frameUrl">
      <aside class="sidebar">
        <button class="brand" type="button" title="Doble click" @dblclick="aboutOpen = true">
          <img class="brand__mark" src="/assets/branding/sebastian-cortes-logo.svg" alt="" />
          Seba Cortés<span class="blink">_</span>
        </button>
        <ul class="nav-list" aria-label="Main navigation">
          <li v-for="item in nav" :key="item.to">
            <RouterLink class="nav-link" :to="item.to"><span aria-hidden="true">{{ item.icon }}</span>{{ item.label }}</RouterLink>
          </li>
        </ul>
        <div class="side-note">
          <strong>{{ currentLocale === "es" ? "Santiago, CL" : "Santiago, CL" }}</strong><br />
          <button class="filter-button" type="button" @click="switchLocale(currentLocale === 'es' ? 'en' : 'es')">ES | EN</button>
          <button class="filter-button" type="button" @click="theme.toggle()">{{ theme.mode === "dark" ? "Light" : "Dark" }}</button>
        </div>
      </aside>
      <main class="page" tabindex="-1">
        <RouterView />
      </main>
    </RetroBrowserFrame>

    <RetroDialog title="aboutme.txt - Bloc de notas" :open="aboutOpen" @close="aboutOpen = false">
      <pre>
&gt; Desarrollar
&gt; Aprender
&gt; Crear
&gt; Compartir
&gt; Repetir

Fin.

:)</pre>
    </RetroDialog>
  </div>
</template>
