import React, { useState, lazy, Suspense } from "react";
import Banner from "../common/Banner";
import NavBar from "../common/NavBar";
import WhyChooseUs from "../components/productandservices/diyprefabkits/WhyChooseUs";
import WeOffer from "../components/productandservices/diyprefabkits/WeOffer";
import OurServices from "../components/productandservices/diyprefabkits/OurServices";
import SeoHelmet from "../common/SeoHelmet";
import useSeoHelmet from "../hooks/ReactHelmet";
import ScrollToTop from "../common/ScrollToTop";

// Constants
const BANNER_TITLE = "Healthcare Facilities";
const BANNER_DESCRIPTION = "Engineering Excellence, Industrial Solutions";
const OUR_SERVICES_TITLE = "Smart, Stylish, and Sustainable Prefab Solutions for Modern Residential Living";
const OUR_SERVICES_DESCRIPTION = "We specialize in delivering high-quality prefabricated building services tailored for residential needs, combining comfort, efficiency, and modern design.";
const WHY_CHOOSE_US_TITLE = "Delivering Excellence in Residential Prefab Solutions";
const WHY_CHOOSE_US_DESCRIPTION = "At DIY PreFab, we prioritize world-class quality, combining innovation, comfort, and sustainability in every residential structure we build.";
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

const Footer = lazy(() =>
  import("../common/Footer").catch(() => ({ default: () => <div>Failed to load Footer</div> }))
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

const HealthcareFacilities = () => {
  const [openVideo, setOpenVideo] = useState(false);
  const handleOpenVideo = () => setOpenVideo(!openVideo);
  const seo = useSeoHelmet("healthcare-facilities");

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

      <WhyChooseUs
        title={WHY_CHOOSE_US_TITLE}
        desc={WHY_CHOOSE_US_DESCRIPTION}
        handleOpenVideo={handleOpenVideo}
      />

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

export default HealthcareFacilities;
