import { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getRouteMeta, normalizePath, SITE_URL } from "../seo/routeMeta";

// Injects CMS custom scripts once. They are tagged with a key so remounting a page (or navigating back to it) never
// adds the same analytics / chat snippet a second time.
const keyOf = (str) => { let h = 0; for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) | 0; return `seo-${h}`; };

const injectRawScripts = (scripts = [], position = "head") => {
  scripts.forEach((html) => {
    if (typeof html !== "string") return;
    const key = keyOf(html);
    if (document.querySelector(`script[data-seo-key="${key}"]`)) return;
    const temp = document.createElement("div");
    temp.innerHTML = html.trim();
    const scriptTag = temp.querySelector("script");
    if (scriptTag) {
      const script = document.createElement("script");
      if (scriptTag.src) script.src = scriptTag.src;
      script.text = scriptTag.innerHTML;
      Array.from(scriptTag.attributes).forEach((attr) => script.setAttribute(attr.name, attr.value));
      script.setAttribute("data-seo-key", key);
      (position === "head" ? document.head : document.body).appendChild(script);
    }
  });
};

// A CMS canonical is only trusted when it points at the page being shown. A record copied from the homepage
// (canonical "https://diyprefab.com/") must never become the canonical of /contact-us, /applications, /blog-news ...
const safeCanonical = (cms, pathname) => {
  const route = getRouteMeta(pathname)?.canonical || `${SITE_URL}${normalizePath(pathname)}`;
  if (!cms) return route;
  try {
    const u = new URL(cms, SITE_URL);
    return normalizePath(u.pathname) === normalizePath(pathname) ? `${SITE_URL}${normalizePath(u.pathname)}` : route;
  } catch {
    return route;
  }
};

const SeoHelmet = ({ seo }) => {
  const { pathname } = useLocation();
  // Hook calls must be unconditional, so even if seo is null, hooks run
  // Memoize JSON.parse results to avoid new arrays every render
  const jsonLd = useMemo(() => {
    if (!seo?.json_ld) return null;
    try {
      return JSON.parse(seo.json_ld);
    } catch (e) {
      console.warn("Invalid JSON-LD:", e);
      return null;
    }
  }, [seo?.json_ld]);

  const customHeadScripts = useMemo(() => {
    if (!seo?.custom_head_scripts) return [];
    try {
      return JSON.parse(seo.custom_head_scripts);
    } catch (e) {
      console.warn("Invalid customHeadScripts JSON:", e);
      return [];
    }
  }, [seo?.custom_head_scripts]);

  const customFooterScripts = useMemo(() => {
    if (!seo?.custom_footer_scripts) return [];
    try {
      return JSON.parse(seo.custom_footer_scripts);
    } catch (e) {
      console.warn("Invalid customFooterScripts JSON:", e);
      return [];
    }
  }, [seo?.custom_footer_scripts]);

  useEffect(() => {
    if (customHeadScripts.length > 0) {
      injectRawScripts(customHeadScripts, "head");
    }
    if (customFooterScripts.length > 0) {
      injectRawScripts(customFooterScripts, "body");
    }
  }, [customHeadScripts, customFooterScripts]);

  if (!seo) return null;

  const canonical = safeCanonical(seo.canonical_url, pathname);
  const title = seo.meta_title || seo.title;
  const ogTitle = seo.og_title || title;
  const ogDescription = seo.og_description || seo.meta_description;

  return (
    <Helmet>
      {/* Title and Meta */}
      {title && <title>{title}</title>}
      {seo.meta_description && <meta name="description" content={seo.meta_description} />}
      {seo.meta_keywords && <meta name="keywords" content={seo.meta_keywords} />}
      {seo.robots && <meta name="robots" content={seo.robots} />}
      {seo.google_cseid && <meta name="google" content={`cse_id=${seo.google_cseid}`} />}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={seo.og_type || "website"} />
      {ogTitle && <meta property="og:title" content={ogTitle} />}
      {ogDescription && <meta property="og:description" content={ogDescription} />}
      {seo.og_image && <meta property="og:image" content={seo.og_image} />}
      <meta property="og:url" content={canonical} />
      {ogTitle && <meta name="twitter:title" content={ogTitle} />}
      {ogDescription && <meta name="twitter:description" content={ogDescription} />}

      {/* Structured Data (JSON-LD) */}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
};

export default SeoHelmet;
