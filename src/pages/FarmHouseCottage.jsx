import React, { useState, lazy, Suspense } from "react";
import Banner from "../common/Banner";
import NavBar from "../common/NavBar";
import WhyChooseUs from "../components/productandservices/diyprefabkits/WhyChooseUs";
import WeOffer from "../components/productandservices/diyprefabkits/WeOffer";
import OurServices from "../components/productandservices/diyprefabkits/OurServices";
import SeoHelmet from "../common/SeoHelmet";
import useSeoHelmet from "../hooks/ReactHelmet";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";

// Constants
const BANNER_TITLE = "Farmhouses & Cottages";
const BANNER_DESCRIPTION = "Engineering Excellence, Industrial Solutions";
const OUR_SERVICES_TITLE = "Precision-Built Wall & Roofing Systems That Last";
const OUR_SERVICES_DESCRIPTION = "At DIY PreFab, we specialize in delivering high-performance wall and roofing solutions that offer superior durability, energy efficiency, and design flexibility. Every product is engineered for seamless integration and long-term reliability.";
const LOADING_TEXT = "Loading...";

// Lazy-loaded components with error handling
const TrustSlider = lazy(() =>
  import("../common/TrustSlider").catch(() => ({ default: () => <div>Failed to load TrustSlider</div> }))
);

const CounterCard = lazy(() =>
  import("../common/CounterCard").catch(() => ({ default: () => <div>Failed to load CounterCard</div> }))
);

const WaveWrapper = lazy(() =>
  import("../common/WaveWrapper").catch(() => ({ default: () => <div>Failed to load WaveWrapper</div> }))
);


const VideoModal = lazy(() =>
  import("../common/VideoModal").catch(() => ({ default: () => <div>Failed to load VideoModal</div> }))
);

// Loading component
const LoadingSpinner = ({ message = LOADING_TEXT }) => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
    <span className="text-gray-600">{message}</span>
  </div>
);

const FarmHouseCottage = () => {
  const [openVideo, setOpenVideo] = useState(false);
  const handleOpenVideo = () => setOpenVideo(!openVideo);
  const seo = useSeoHelmet("farmhouses-cottages");

  return (
    <div>
      <SeoHelmet seo={seo} />
      <NavBar />
      <Banner title={BANNER_TITLE} description={BANNER_DESCRIPTION} />
      <OurServices title={OUR_SERVICES_TITLE} desc={OUR_SERVICES_DESCRIPTION} />

      <Suspense fallback={<LoadingSpinner message="Loading trust slider..." />}>
        <TrustSlider />
      </Suspense>

      <WeOffer />

      <Suspense fallback={<LoadingSpinner message="Loading counter card..." />}>
        <CounterCard />
      </Suspense>

      <WhyChooseUs handleOpenVideo={handleOpenVideo} />

      <Suspense fallback={<LoadingSpinner message="Loading visual section..." />}>
        <WaveWrapper />
      </Suspense>

      <Suspense fallback={<LoadingSpinner message="Loading footer..." />}>
        <Footer />
      </Suspense>

      <Suspense fallback={null}>
        <VideoModal open={openVideo} onClose={handleOpenVideo} />
      </Suspense>
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default FarmHouseCottage;
