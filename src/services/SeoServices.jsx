import axios from "axios";
import config from "../../config";

// Public SEO records from the backend CMS (GET /api/seo/:slug). The admin create/update/delete calls lived in the
// dashboard app and referenced a helper that does not exist here, so they were removed from the public site.
const SeoServices = {};

SeoServices.seoList = () => axios.get(`${config.apiUrl}/api/seo`);

SeoServices.seoBySlug = (params) => {
  if (!params?.slug) return Promise.resolve({ data: null });
  return axios.get(`${config.apiUrl}/api/seo/${encodeURIComponent(params.slug)}`);
};

export default SeoServices;
