<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import RetroButton from "@/components/retro/RetroButton.vue";
import RetroInput from "@/components/retro/RetroInput.vue";
import RetroPanel from "@/components/retro/RetroPanel.vue";
import { apiFetch } from "@/services/api";

const router = useRouter();
const form = reactive({ email: "admin@sebastian-cortes.local", password: "" });
const error = ref("");

async function login() {
  error.value = "";
  try {
    await apiFetch("/auth/login", { method: "POST", body: JSON.stringify(form) });
    router.push("/admin");
  } catch {
    error.value = "Credenciales inválidas.";
  }
}
</script>

<template>
  <RetroPanel title="Login">
    <form class="form-stack" @submit.prevent="login">
      <RetroInput id="admin-email" v-model="form.email" label="Email" type="email" required />
      <RetroInput id="admin-password" v-model="form.password" label="Password" type="password" required />
      <RetroButton type="submit" variant="primary">Iniciar sesión</RetroButton>
      <p v-if="error" role="alert">{{ error }}</p>
    </form>
  </RetroPanel>
</template>
