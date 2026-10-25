// Generates public/sitemap.xml and public/robots.txt from the SAME route table the router and server use,
// so the sitemap can never list a URL the app does not serve (the old hand-written one listed /about, /services,
// /projects and /contact, which rendered "Page Not Found" with HTTP 200).
//   node scripts/generate-sitemap.mjs        (runs automatically before `npm run build`)
// Optional: set VITE_APP_API_URL (or SITEMAP_API_URL) to add blog posts published in the CMS.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { STATIC_PATHS, NOINDEX_PATHS } from "../src/seo/indexability.js";
import staticBlogs from "../src/data/staticBlogs.js";

const DOMAIN = "https://diyprefab.com";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "public");
fs.mkdirSync(pub, { recursive: true });

const slugs = new Set(staticBlogs.map((b) => b.slug).filter(Boolean));
const api = process.env.SITEMAP_API_URL || process.env.VITE_APP_API_URL;
if (api) {
  try {
    const res = await fetch(`${api}/api/blogs`, { signal: AbortSignal.timeout(8000) });
    const json = await res.json();
    (json?.data || []).forEach((b) => b?.slug && slugs.add(b.slug));
  } catch (e) {
    console.warn("Could not read blogs from the API, using the static list only:", e.message);
  }
}

const urls = [
  ...STATIC_PATHS.filter((p) => !NOINDEX_PATHS.includes(p)),
  ...[...slugs].map((s) => `/blog/${s}`),
];
const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${DOMAIN}${u === "/" ? "/" : u}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(pub, "sitemap.xml"), xml, "utf8");
fs.writeFileSync(path.join(pub, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /linkedin/\nDisallow: /card-details\n\nSitemap: ${DOMAIN}/sitemap.xml\n`, "utf8");
console.log(`sitemap.xml: ${urls.length} URLs, robots.txt written to ${pub}`);
