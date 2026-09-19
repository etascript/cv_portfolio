import { createRouter, createWebHistory, type RouteLocationNormalized } from "vue-router";
import { setLocale } from "@/i18n";
import PublicLayout from "@/layouts/PublicLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import ProjectsView from "@/views/ProjectsView.vue";
import ProjectDetailView from "@/views/ProjectDetailView.vue";
import ContactView from "@/views/ContactView.vue";
import AdminLoginView from "@/views/admin/AdminLoginView.vue";
import AdminDashboardView from "@/views/admin/AdminDashboardView.vue";
import AdminProjectsView from "@/views/admin/AdminProjectsView.vue";
import AdminProjectEditView from "@/views/admin/AdminProjectEditView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

const localizedChildren = [
  { path: "", name: "home", component: HomeView },
  { path: "about", name: "about", component: AboutView },
  { path: "projects", name: "projects", component: ProjectsView },
  { path: "projects/:slug", name: "project-detail", component: ProjectDetailView },
  { path: "contact", name: "contact", component: ContactView }
];

function localeFromRoute(to: RouteLocationNormalized) {
  return to.params.locale === "en" ? "en" : "es";
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/es/" },
    {
      path: "/:locale(es|en)",
      component: PublicLayout,
      children: localizedChildren
    },
    {
      path: "/admin",
      component: AdminLayout,
      children: [
        { path: "", name: "admin", component: AdminDashboardView },
        { path: "login", name: "admin-login", component: AdminLoginView },
        { path: "projects", name: "admin-projects", component: AdminProjectsView },
        { path: "projects/new", name: "admin-project-new", component: AdminProjectEditView },
        { path: "projects/:id/edit", name: "admin-project-edit", component: AdminProjectEditView }
      ]
    },
    { path: "/:pathMatch(.*)*", component: NotFoundView }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to) => {
  if (to.params.locale) setLocale(localeFromRoute(to));
});
