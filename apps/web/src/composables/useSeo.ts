import { watchEffect } from "vue";
import { useRoute } from "vue-router";

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

interface SeoOptions {
  image?: () => string | undefined;
  type?: () => "website" | "profile" | "article";
  jsonLd?: () => JsonLd | undefined;
}

const siteName = "Sebastián Cortés";
const defaultImage = "/assets/branding/sebastian-cortes-portrait.png";

export function useSeo(title: () => string, description: () => string, options: SeoOptions = {}) {
  const route = useRoute();

  watchEffect(() => {
    const cleanTitle = title();
    const cleanDescription = description();
    const fullTitle = cleanTitle === siteName ? siteName : `${cleanTitle} | ${siteName}`;
    const canonicalUrl = absoluteUrl(route.path);
    const imageUrl = absoluteUrl(options.image?.() ?? defaultImage);
    const ogType = options.type?.() ?? "website";

    document.title = fullTitle;
    document.documentElement.lang = route.params.locale === "en" ? "en" : "es";

    setMeta("description", cleanDescription);
    setMeta("robots", route.path.startsWith("/admin") ? "noindex,nofollow" : "index,follow");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", cleanDescription);
    setMeta("twitter:image", imageUrl);

    setProperty("og:site_name", siteName);
    setProperty("og:title", fullTitle);
    setProperty("og:description", cleanDescription);
    setProperty("og:type", ogType);
    setProperty("og:url", canonicalUrl);
    setProperty("og:image", imageUrl);
    setProperty("og:locale", route.params.locale === "en" ? "en_US" : "es_CL");

    setLink("canonical", canonicalUrl);
    setHreflang("es", localizedPath("es", route.path));
    setHreflang("en", localizedPath("en", route.path));
    setHreflang("x-default", localizedPath("es", route.path));
    setJsonLd(options.jsonLd?.());
  });
}

function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${window.location.origin}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

function localizedPath(locale: "es" | "en", path: string) {
  if (path === "/") return `/${locale}/`;
  if (/^\/(es|en)(\/|$)/.test(path)) return path.replace(/^\/(es|en)/, `/${locale}`);
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
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
  let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]:not([hreflang])`);
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
  link.href = absoluteUrl(path);
}

function setJsonLd(data: JsonLd | undefined) {
  const id = "page-json-ld";
  let script = document.querySelector<HTMLScriptElement>(`script#${id}`);

  if (!data) {
    script?.remove();
    return;
  }

  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.append(script);
  }

  script.textContent = JSON.stringify(data);
}
