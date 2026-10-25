import React, { useState, lazy, Suspense, useCallback } from "react";
import Banner from "../common/Banner";
import NavBar from "../common/NavBar";
import WhyChooseUs from "../components/productandservices/diyprefabkits/WhyChooseUs";
import WeOffer from "../components/productandservices/diyprefabkits/WeOffer";
import OurServices from "../components/productandservices/diyprefabkits/OurServices";
import SeoHelmet from "../common/SeoHelmet";
import useSeoHelmet from "../hooks/ReactHelmet";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";

// Lazy-loaded components with better error boundaries
const TrustSlider = lazy(() => 
  import("../common/TrustSlider").catch(() => ({ default: () => <div>Failed to load content</div> }))
);
const CounterCard = lazy(() => 
  import("../common/CounterCard").catch(() => ({ default: () => <div>Failed to load content</div> }))
);
const WaveWrapper = lazy(() => 
  import("../common/WaveWrapper").catch(() => ({ default: () => <div>Failed to load content</div> }))
);

const VideoModal = lazy(() => 
  import("../common/VideoModal").catch(() => ({ default: () => <div>Failed to load content</div> }))
);

// Optimized loading component
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
    <span className="text-gray-600">{message}</span>
  </div>
);

const AccessoriesandCustomization = () => {
  const [openVideo, setOpenVideo] = useState(false);
  


  // Memoized callback for closing video
  const handleCloseVideo = useCallback(() => {
    setOpenVideo(false);
  }, []);

  const seo = useSeoHelmet("accessories-customization");

  return (
    <>
      {/* SEO Meta Tags */}
      <SeoHelmet seo={seo} />
      
      {/* Navigation */}
      <NavBar />
      
      {/* Hero Section */}
      <Banner 
      title="Accessories and Customization" 
      description="Engineering Excellence, Industrial Solutions"/>
      
      {/* Main Content Sections */}
      <main>
        <WhyChooseUs />
        <WeOffer />
        <OurServices />
        
        {/* Lazy-loaded sections with optimized loading states */}
        <Suspense fallback={<LoadingSpinner message="Loading trust indicators..." />}>
          <TrustSlider />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner message="Loading statistics..." />}>
          <CounterCard />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner message="Loading visual elements..." />}>
          <WaveWrapper />
        </Suspense>
      </main>
      
      {/* Footer */}
      <Suspense fallback={<LoadingSpinner message="Loading footer..." />}>
        <Footer />
      </Suspense>
      
      {/* Video Modal - Only load when needed */}
      {openVideo && (
        <Suspense fallback={<LoadingSpinner message="Loading video player..." />}>
          <VideoModal 
            isOpen={openVideo} 
            onClose={handleCloseVideo}
          />
        </Suspense>
      )}

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </>
  );
};

export default AccessoriesandCustomization;