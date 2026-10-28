import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContextWrapper } from "./contexts/Context.jsx";
import { HelmetProvider } from "react-helmet-async";

// Static fallback tags in index.html (description, Open Graph, Twitter) are only for crawlers that do not run scripts.
// Remove them before the first render so <RouteMeta/> / <SeoHelmet/> are the only source of per-route tags (no duplicates).
document.querySelectorAll("[data-seo-static]").forEach((el) => el.remove());

// A refresh must always open on the hero: the browser never restores an old scroll position, and the position
// saved for this page is reset to the top as the page unloads (covers reload, close and bfcache).
if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
const resetScroll = () => { window.scrollTo(0, 0); document.documentElement.scrollTop = 0; document.body.scrollTop = 0; };
window.addEventListener("beforeunload", resetScroll);
window.addEventListener("pagehide", resetScroll);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>

    <HelmetProvider>
      <BrowserRouter>
        <ContextWrapper>
          <App />
        </ContextWrapper>
      </BrowserRouter>
    </HelmetProvider>
  </QueryClientProvider>
);
