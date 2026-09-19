<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import RetroFolderTree from "@/components/retro/RetroFolderTree.vue";
import RetroPanel from "@/components/retro/RetroPanel.vue";
import RetroTabs from "@/components/retro/RetroTabs.vue";
import { getPortfolioContent } from "@/services/content";
import type { PortfolioPayload } from "@/types/content";
import { useSeo } from "@/composables/useSeo";

const { t, locale } = useI18n();
const content = ref<PortfolioPayload>();
const active = ref("summary");
const birthDate = new Date("1992-01-10T00:00:00");
const age = computed(() => {
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  const birthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (today < birthdayThisYear) years -= 1;
  return years;
});
const tabs = computed(() => [
  { id: "summary", label: t("about.tabs.summary") },
  { id: "experience", label: t("about.tabs.experience") },
  { id: "tools", label: t("about.tabs.tools") },
  { id: "interests", label: t("about.tabs.interests") }
]);
const groups = computed(() => content.value?.technologies.map((group) => ({ name: group.name, items: group.technologies })) ?? []);

onMounted(async () => {
  content.value = await getPortfolioContent();
});

useSeo(() => t("about.title"), () => t("about.summary"));
</script>

<template>
  <RetroPanel :title="t('about.title')">
    <p>{{ t("about.summary") }}</p>
    <RetroTabs :tabs="tabs" :active="active" @change="active = $event" />
    <section v-if="active === 'summary'">
      <template v-if="locale === 'es'">
        <p>
          Tengo {{ age }} años y para mí programar no es solo trabajo: es una forma de probar ideas,
          entender problemas y construir cosas que antes estaban dando vueltas solo como una posibilidad.
        </p>
        <p>
          Disfruto aprender y trabajar con tecnologías nuevas, especialmente cuando abren caminos más simples para crear.
          En mis desarrollos también integro IA para acelerar partes del proceso, explorar alternativas y materializar ideas mucho más rápido.
        </p>
        <p>
          Me gusta mantener un equilibrio entre lo práctico y lo experimental: hacer software que funcione bien,
          pero sin perder esa curiosidad que hace entretenido seguir aprendiendo.
        </p>
      </template>
      <template v-else>
        <p>
          I'm {{ age }} years old, and for me programming is not only work: it is a way to test ideas,
          understand problems and build things that were previously just a possibility.
        </p>
        <p>
          I enjoy learning and working with new technologies, especially when they open simpler ways to create.
          I also integrate AI into my development process to move faster, explore alternatives and turn ideas into working things sooner.
        </p>
        <p>
          I like keeping a balance between practical work and experimentation: building software that works well,
          without losing the curiosity that makes learning feel worthwhile.
        </p>
      </template>
    </section>
    <section v-else-if="active === 'experience'" class="timeline">
      <article v-for="item in content?.experiences" :key="item.id">
        <strong>{{ item.period }}</strong>
        <h3>{{ item.company }}</h3>
        <p>{{ locale === "es" ? item.roleEs : item.roleEn }}</p>
        <p>{{ locale === "es" ? item.descriptionEs : item.descriptionEn }}</p>
      </article>
    </section>
    <section v-else-if="active === 'tools'">
      <RetroFolderTree :groups="groups" />
    </section>
    <section v-else>
      <p>&gt; Desarrollar</p>
      <p>&gt; Aprender</p>
      <p>&gt; Crear herramientas útiles</p>
      <p>&gt; Experimentar con interfaces, juegos y sistemas web</p>
    </section>
  </RetroPanel>
</template>
