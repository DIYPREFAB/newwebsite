import React, { useState, lazy, Suspense } from "react";
import Banner from "../common/Banner";
import NavBar from "../common/NavBar";
import WeOffer from "../components/productandservices/diyprefabkits/WeOffer";
import OurServices from "../components/productandservices/diyprefabkits/OurServices";
import ComparisionSec2 from "../components/productandservices/wallroofingsolutions/sandwichpanel/ComparisionSec2";
import ComparisionSec1 from "../components/productandservices/wallroofingsolutions/sandwichpanel/ComparisionSec1";
import WhyChooseUs from "../components/productandservices/wallroofingsolutions/sandwichpanel/WhyChooseUs";
import Faq from "../components/productandservices/wallroofingsolutions/sandwichpanel/Faq";
import SeoHelmet from "../common/SeoHelmet";
import useSeoHelmet from "../hooks/ReactHelmet";

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
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
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

const SandwichPanels = () => {
  const [openVideo, setOpenVideo] = useState(false);
  const handleOpenVideo = () => setOpenVideo(!openVideo);
  const seo = useSeoHelmet("sandwich-panels");

  return (
    <div>
      <SeoHelmet seo={seo} />
      <NavBar />
      <Banner
        title={"Sandwich Panels"}
        description={"Engineering Excellence, Industrial Solutions"}
      />
      <OurServices
        title={"What Are Sandwich Panels?"}
        desc={"Sandwich panels are three-layer structural components: Outer Skin + Core Insulation + Inner Skin, bonded under pressure."}
      />

      <ErrorBoundary>
        <Suspense fallback={<SectionLoader height="200px" />}>
          <TrustSlider />
        </Suspense>
      </ErrorBoundary>

      <WeOffer desc={"Key Benefits of DIY PreFab Sandwich Panels"} />

      <ComparisionSec2 />
      <ComparisionSec1 />

      <ErrorBoundary>
        <Suspense fallback={<SectionLoader height="200px" />}>
          <CounterCard />
        </Suspense>
      </ErrorBoundary>

      <WhyChooseUs handleOpenVideo={handleOpenVideo} />

      <Faq />

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

export default SandwichPanels;
