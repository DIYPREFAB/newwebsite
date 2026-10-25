import "./App.css";
import "./Responsive.css";
import "./assets/geo-styles.css";
import { Route, Routes } from "react-router-dom";
import RoutesPath from './helper/Routes/Routes'
import PageNotFound from "./pages/PageNotFound";
import { Suspense } from "react";
import useScrollToTop from "./hooks/useScrollToTop";
import WhatsAppButton from "./common/WhatsAppButton";
import RouteMetaTags from "./seo/RouteMetaTags";

const App = () => {
  // Hook to scroll to top on route change
  useScrollToTop();

  return (
    <>
      {/* Title / description / canonical / Open Graph for the current route */}
      <RouteMetaTags />
      <Suspense fallback={<div style={{ minHeight: "100vh", background: "#001524" }} aria-hidden="true" />}>
        <Routes>
          {
            RoutesPath()
          }

          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
      
      {/* Global WhatsApp Button - Available on all pages */}
      <WhatsAppButton />
    </>
  );
}

export default App;
