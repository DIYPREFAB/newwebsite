import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getRouteMeta, SITE_NAME } from "./routeMeta";

// Rendered once in <App/>. Gives the current route its own title, description, robots, canonical and Open Graph /
// Twitter tags. Page-level <SeoHelmet/> (CMS record) is mounted later and overrides title/description/OG when it exists.
export default function RouteMetaTags() {
  const { pathname } = useLocation();
  const m = getRouteMeta(pathname);
  if (!m) return null;
  return (
    <Helmet>
      <title>{m.title}</title>
      <meta name="description" content={m.description} />
      <meta name="robots" content={m.robots} />
      <link rel="canonical" href={m.canonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={m.title} />
      <meta property="og:description" content={m.description} />
      <meta property="og:url" content={m.canonical} />
      <meta property="og:image" content={m.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={m.title} />
      <meta name="twitter:description" content={m.description} />
      <meta name="twitter:image" content={m.image} />
    </Helmet>
  );
}
