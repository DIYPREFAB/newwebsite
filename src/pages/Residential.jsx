import React, { useState, lazy, Suspense } from "react";
import Banner from "../common/Banner";
import NavBar from "../common/NavBar";
import WhyChooseUs from "../components/productandservices/diyprefabkits/WhyChooseUs";
import WeOffer from "../components/productandservices/diyprefabkits/WeOffer";
import OurServices from "../components/productandservices/diyprefabkits/OurServices";
import Comparison from "../components/productandservices/diyprefabkits/homekit/Comparison";
import Faq from "../components/productandservices/diyprefabkits/homekit/Faq";
import useSeoHelmet from "../hooks/ReactHelmet";
import SeoHelmet from "../common/SeoHelmet";

// Lazy-loaded components
const TrustSlider = lazy(() => import("../common/TrustSlider"));
const CounterCard = lazy(() => import("../common/CounterCard"));
const WaveWrapper = lazy(() => import("../common/WaveWrapper"));
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";
const VideoModal = lazy(() => import("../common/VideoModal"));

// Loading Spinner Component
const LoadingSpinner = React.memo(() => (
  <div
    className="loading-spinner-container"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px 0",
      minHeight: "100px",
    }}
    role="status"
    aria-label="Loading content"
  >
    <div
      className="spinner"
      style={{
        width: "24px",
        height: "24px",
        border: "3px solid #f3f3f3",
        borderTop: "3px solid #007bff",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
));

// Section Loader Component
const SectionLoader = React.memo(({ height = "150px" }) => (
  <div
    style={{
      minHeight: height,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: 0.7,
    }}
    role="status"
    aria-label="Loading section"
  >
    <LoadingSpinner />
  </div>
));

// Error Boundary Component

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          <p>Something went wrong loading this section.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: "8px 16px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              background: "#f8f9fa",
              cursor: "pointer",
            }}
          >
            Retry
          </button>

    </div>
  );
}

    return this.props.children;
  }
}

const Residential = () => {
  const [openVideo, setOpenVideo] = useState(false);
  const handleOpenVideo = () => setOpenVideo(!openVideo);
  const seo = useSeoHelmet("residential");

  return (
    <div>
      <SeoHelmet seo={seo} />
      <NavBar />
      <Banner
        title={"Residential"}
        description={"Engineering Excellence, Industrial Solutions"}
      />
      <OurServices
        title={"Smart, Stylish, and Sustainable Prefab Solutions for Modern Residential Living"}
        desc={"We specialize in delivering high-quality prefabricated building services tailored for residential needs, combining comfort, efficiency, and modern design"}
      />

      <ErrorBoundary>
        <Suspense fallback={<SectionLoader height="200px" />}>
          <TrustSlider />
        </Suspense>
      </ErrorBoundary>

      <WeOffer />

      <ErrorBoundary>
        <Suspense fallback={<SectionLoader height="200px" />}>
          <CounterCard />
        </Suspense>
      </ErrorBoundary>

      <WhyChooseUs
        title={"Delivering Excellence in Residential Prefab Solutions"}
        desc={"At DIY PreFab, we prioritize world-class quality, combining innovation, comfort, and sustainability in every residential structure we build."}
        handleOpenVideo={handleOpenVideo}
      />

      <ErrorBoundary>
        <Suspense fallback={<SectionLoader height="200px" />}>
          <WaveWrapper />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionLoader height="200px" />}>
          <Footer />
        </Suspense>
      </ErrorBoundary>

      {openVideo && (
        <ErrorBoundary>
          <Suspense fallback={null}>
            <VideoModal open={openVideo} onClose={handleOpenVideo} />
          </Suspense>
        </ErrorBoundary>
      )}
            {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default Residential;
