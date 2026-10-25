// Production server for the built site (replaces `vite preview` behind PM2 / nginx).
// A single-page app normally answers EVERY path with index.html and HTTP 200, which makes unknown URLs "soft 404s".
// This server answers known routes with 200, moved URLs with a 301, and everything else with a real 404
// (still serving index.html so the React "Page not found" screen renders, plus X-Robots-Tag: noindex).
//   npm run build && npm start        (PORT / HOST env vars optional; default 0.0.0.0:3000)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { STATIC_PATHS, PATTERN_PATHS } from "./src/seo/indexability.js";
import LEGACY_REDIRECTS from "./src/routes/redirects.js";

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), "dist");
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const KNOWN = new Set(STATIC_PATHS);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".gif": "image/gif", ".ico": "image/x-icon", ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf",
  ".mp4": "video/mp4", ".webm": "video/webm", ".glb": "model/gltf-binary", ".pdf": "application/pdf",
};

export const classify = (pathname) => {
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (LEGACY_REDIRECTS[p]) return { type: "redirect", to: LEGACY_REDIRECTS[p] };
  if (p !== pathname) return { type: "redirect", to: p };           // /about-us/ -> /about-us
  if (KNOWN.has(p) || PATTERN_PATHS.some((re) => re.test(p))) return { type: "app" };
  return { type: "notfound" };
};

const send = (res, status, headers, body, head) => { res.writeHead(status, headers); res.end(head ? undefined : body); };

const serveFile = (req, res, file, status = 200, extra = {}) => {
  const ext = path.extname(file).toLowerCase();
  const isHtml = ext === ".html";
  const hashed = /\/assets\//.test(file);
  const body = fs.readFileSync(file);
  send(res, status, {
    "Content-Type": TYPES[ext] || "application/octet-stream",
    "Content-Length": body.length,
    "Cache-Control": isHtml ? "no-cache" : hashed ? "public, max-age=31536000, immutable" : "public, max-age=86400",
    ...extra,
  }, body, req.method === "HEAD");
};

export const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, { Allow: "GET, HEAD" }, "Method Not Allowed", false);
  let url;
  try { url = new URL(req.url, "http://localhost"); } catch { return send(res, 400, {}, "Bad Request", false); }
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { return send(res, 400, {}, "Bad Request", false); }

  // real files first (assets, images, sitemap.xml, robots.txt ...); never outside dist
  if (path.extname(pathname) && pathname !== "/index.html") {
    const file = path.normalize(path.join(DIST, pathname));
    if (file.startsWith(DIST + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile()) return serveFile(req, res, file);
    return send(res, 404, { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" }, "Not found", req.method === "HEAD");
  }

  const index = path.join(DIST, "index.html");
  const c = classify(pathname === "/index.html" ? "/" : pathname);
  if (c.type === "redirect") return send(res, 301, { Location: c.to + url.search, "Cache-Control": "public, max-age=3600" }, "", true);
  if (c.type === "app") return serveFile(req, res, index);
  return serveFile(req, res, index, 404, { "X-Robots-Tag": "noindex" });
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, HOST, () => console.log(`diyprefab frontend on http://${HOST}:${PORT} (serving ${DIST})`));
}
