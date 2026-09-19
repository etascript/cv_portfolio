<script setup lang="ts">
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import RetroButton from "@/components/retro/RetroButton.vue";
import RetroInput from "@/components/retro/RetroInput.vue";
import RetroPanel from "@/components/retro/RetroPanel.vue";
import RetroTextarea from "@/components/retro/RetroTextarea.vue";
import { apiFetch } from "@/services/api";
import { useSeo } from "@/composables/useSeo";

const { t } = useI18n();
const form = reactive({ name: "", email: "", message: "" });
const sent = ref(false);
const error = ref("");

async function submit() {
  error.value = "";
  try {
    await apiFetch("/contact", { method: "POST", body: JSON.stringify(form) });
    sent.value = true;
    form.name = "";
    form.email = "";
    form.message = "";
  } catch {
    error.value = "No se pudo enviar ahora. Puedes escribir directamente por email.";
  }
}

useSeo(() => t("contact.title"), () => t("contact.intro"));
</script>

<template>
  <RetroPanel :title="t('contact.title')">
    <p>{{ t("contact.intro") }}</p>
    <div class="contact-grid">
      <form class="form-stack" @submit.prevent="submit">
        <RetroInput id="name" v-model="form.name" :label="t('contact.name')" required />
        <RetroInput id="email" v-model="form.email" :label="t('contact.email')" type="email" required />
        <RetroTextarea id="message" v-model="form.message" :label="t('contact.message')" required />
        <RetroButton type="submit" variant="primary">{{ t("contact.send") }}</RetroButton>
        <p v-if="sent" role="status">Mensaje registrado.</p>
        <p v-if="error" role="alert">{{ error }}</p>
      </form>
      <RetroPanel :title="t('contact.other')">
        <p><strong>GitHub</strong><br /><a href="https://github.com/sebastiancortes">github.com/sebastiancortes</a></p>
        <p><strong>LinkedIn</strong><br /><a href="https://linkedin.com/in/sebastiancortes777">linkedin.com/in/sebastiancortes</a></p>
        <p><strong>Email</strong><br /><a href="mailto:sebastiancortes.2202@gmail.com">sebastiancortes.2202@gmail.com</a></p>
        <p><strong>{{ t("contact.location") }}</strong><br />San Antonio, Chile</p>
      </RetroPanel>
    </div>
  </RetroPanel>
</template>
