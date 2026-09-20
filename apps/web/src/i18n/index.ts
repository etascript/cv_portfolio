import { createI18n } from "vue-i18n";

export const messages = {
  es: {
    nav: { home: "Inicio", about: "Sobre mí", projects: "Proyectos", contact: "Contacto" },
    common: {
      viewProjects: "Ver proyectos",
      aboutMe: "Sobre mí",
      viewAll: "Ver todos",
      backProjects: "Volver a proyectos",
      github: "GitHub",
      demo: "Demo",
      loading: "Cargando",
      statusReady: "Listo",
      internet: "Internet"
    },
    home: {
      hello: "Sebastián Cortés",
      name: "Ingeniero en software",
      role: "desarrollador full stack",
      place: "y videojuegos casuales.",
      lead: "Creo aplicaciones web, automatizo procesos y casualmente desarrollo videojuegos.",
      body: "Me gusta moverme entre código, producto e IA aplicada: ordenar el problema, construir una primera versión y mejorarla con criterio.",
      featured: "// Proyectos destacados"
    },
    about: {
      title: "Sobre mí",
      summary: "Me llamo Sebastián. Soy de San Antonio, Chile, y me apasiona programar.",
      tabs: { summary: "Resumen", experience: "Experiencia", tools: "Herramientas", interests: "Intereses" },
      note: "Código mantenible, pantallas claras y espacio para experimentar."
    },
    projects: {
      title: "Proyectos",
      all: "Todos",
      web: "Web",
      tools: "Herramientas",
      games: "Juegos",
      experiments: "Experimentos",
      view: "Ver proyecto"
    },
    contact: {
      title: "Contacto",
      intro: "¿Tienes una idea, un proyecto o simplemente quieres conversar? Hablemos.",
      name: "Nombre",
      email: "Correo",
      message: "Mensaje",
      send: "Enviar",
      other: "Otros medios",
      location: "Ubicación"
    },
    admin: {
      title: "SEBA CORTES CONTROL PANEL",
      login: "Iniciar sesión",
      projects: "Projects",
      newProject: "New Project"
    }
  },
  en: {
    nav: { home: "Home", about: "About", projects: "Projects", contact: "Contact" },
    common: {
      viewProjects: "View projects",
      aboutMe: "About me",
      viewAll: "View all",
      backProjects: "Back to projects",
      github: "GitHub",
      demo: "Demo",
      loading: "Loading",
      statusReady: "Ready",
      internet: "Internet"
    },
    home: {
      hello: "Sebastián Cortés",
      name: "Software engineer",
      role: "full-stack developer",
      place: "and casual game dev.",
      lead: "I build web apps, automate processes, and casually develop video games.",
      body: "I like working between code, product and applied AI: understanding the problem, building a first version and improving it with care.",
      featured: "// Featured projects"
    },
    about: {
      title: "About me",
      summary: "My name is Sebastián. I'm from San Antonio, Chile, and I love programming.",
      tabs: { summary: "Summary", experience: "Experience", tools: "Tools", interests: "Interests" },
      note: "Maintainable code, clear screens and room to experiment."
    },
    projects: {
      title: "Projects",
      all: "All",
      web: "Web",
      tools: "Tools",
      games: "Games",
      experiments: "Experiments",
      view: "View project"
    },
    contact: {
      title: "Contact",
      intro: "Have an idea, a project, or just want to talk? Let's chat.",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send",
      other: "Other channels",
      location: "Location"
    },
    admin: {
      title: "SEBA CORTES CONTROL PANEL",
      login: "Login",
      projects: "Projects",
      newProject: "New Project"
    }
  }
};

export const i18n = createI18n({
  legacy: false,
  locale: "es",
  fallbackLocale: "es",
  messages
});

export function setLocale(locale: "es" | "en") {
  i18n.global.locale.value = locale;
  document.documentElement.lang = locale;
}
