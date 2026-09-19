import { watchEffect } from "vue";
import { useRoute } from "vue-router";

export function useSeo(title: () => string, description: () => string) {
  const route = useRoute();
  watchEffect(() => {
    const fullTitle = `${title()} | Sebastián Cortés`;
    document.title = fullTitle;
    setMeta("description", description());
    setProperty("og:title", fullTitle);
    setProperty("og:description", description());
    setProperty("og:type", "website");
    setLink("canonical", `${window.location.origin}${route.fullPath}`);
    setHreflang("es", route.fullPath.replace(/^\/en/, "/es"));
    setHreflang("en", route.fullPath.replace(/^\/es/, "/en"));
  });
}

function setMeta(name: string, content: string) {
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = name;
    document.head.append(meta);
  }
  meta.content = content;
}

function setProperty(property: string, content: string) {
  let meta = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.append(meta);
  }
  meta.content = content;
}

function setLink(rel: string, href: string) {
  let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.rel = rel;
    document.head.append(link);
  }
  link.href = href;
}

function setHreflang(lang: string, path: string) {
  let link = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${lang}"]`);
  if (!link) {
    link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = lang;
    document.head.append(link);
  }
  link.href = `${window.location.origin}${path}`;
}
