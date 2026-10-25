import { useEffect, useState } from "react";
import SeoServices from "../services/SeoServices";

// Loads the CMS SEO record for a slug. If the request fails or the record does not exist, `null` is returned and the
// route defaults from seo/routeMeta.js (rendered by <RouteMeta/>) stay in place, so a page never keeps another page's tags.
const useSeoHelmet = (slug) => {
  const [seo, setSeo] = useState(null);

  useEffect(() => {
    let alive = true;
    setSeo(null);
    (async () => {
      try {
        const res = await SeoServices.seoBySlug({ slug });
        if (alive && res?.data?.status) setSeo(res.data.data);
      } catch (err) {
        console.error("SEO fetch failed", err?.message || err);
      }
    })();
    return () => { alive = false; };
  }, [slug]);

  return seo;
};

export default useSeoHelmet;
