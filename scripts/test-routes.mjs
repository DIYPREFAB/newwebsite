// Direct-navigation / refresh test for the real deployment (server.js serving dist/).
//   npm run build && node scripts/test-routes.mjs
// Every known route (nested ones included) must answer 200 on a cold request, moved URLs 301, unknown URLs 404,
// and every URL in public/sitemap.xml must be a 200 route.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { server } from "../server.js";
import { STATIC_PATHS } from "../src/seo/indexability.js";
import LEGACY_REDIRECTS from "../src/routes/redirects.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
if (!fs.existsSync(path.join(root, "dist/index.html"))) { console.error("dist/index.html missing: run `npm run build` first"); process.exit(2); }
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;
let fail = 0;
const check = async (p, status, loc) => {
  const res = await fetch(base + p, { redirect: "manual" });
  const ok = res.status === status && (!loc || res.headers.get("location") === loc);
  if (!ok) { fail += 1; console.log(`FAIL ${p}: got ${res.status} ${res.headers.get("location") || ""}, wanted ${status} ${loc || ""}`); }
  return res;
};
for (const p of STATIC_PATHS) await check(p, 200);
for (const p of ["/blog/some-post", "/details/anything"]) await check(p, 200);
for (const [from, to] of Object.entries(LEGACY_REDIRECTS)) await check(from, 301, to);
await check("/about-us/", 301, "/about-us");
for (const p of ["/nope", "/careers/nothing", "/contact-us/locate-our-dealers", "/blog-news/x/y"]) {
  const res = await check(p, 404);
  if (res.headers.get("x-robots-tag") !== "noindex") { fail += 1; console.log(`FAIL ${p}: missing X-Robots-Tag noindex`); }
}
const sm = path.join(root, "public/sitemap.xml");
if (fs.existsSync(sm)) {
  const urls = [...fs.readFileSync(sm, "utf8").matchAll(/<loc>https:\/\/diyprefab\.com([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
  for (const u of urls) await check(u, 200);
  console.log(`sitemap: ${urls.length} URLs checked`);
}
server.close();
console.log(fail ? `${fail} failure(s)` : "all route checks passed");
process.exit(fail ? 1 : 0);
