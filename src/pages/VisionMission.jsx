import React, { lazy, Suspense, useState, useEffect } from "react";
import Banner from "../common/Banner";
import CounterCard from '../common/CounterCard';
import OurVision from '../common/OurVision';
import NavBar from '../common/NavBar';
import MainSection from "../components/about/MainSection";
import Information from "../components/about/Information";
import useSeoHelmet from "../hooks/ReactHelmet";
import SeoHelmet from "../common/SeoHelmet";
import ScrollToTop from "../common/ScrollToTop";

// Lazy-loaded components
const TrustSlider = lazy(() => import('../common/TrustSlider'));
const TestimonialCard = lazy(() => import('../common/TestimonialCard'));
const WaveWrapper = lazy(() => import('../common/WaveWrapper'));
const Footer = lazy(() => import('../common/Footer'));

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

// Error Boundary Class Component (Required for error boundaries)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          <p>Something went wrong loading this section.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
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

// Alternative: Functional Error Handler (for non-critical errors)
const SafeSuspenseWrapper = ({ children, fallback, height = "150px" }) => {
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Reset error state when children change
    setLoadError(false);
  }, [children]);

  if (loadError) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
        <p>Failed to load this section.</p>
        <button
          onClick={() => setLoadError(false)}
          style={{
            padding: "8px 16px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            background: "#f8f9fa",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense 
        fallback={fallback || <SectionLoader height={height} />}
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

const VisionMission = () => {
  const seo = useSeoHelmet("our-vision-mission");

  return (
    <div>
      <SeoHelmet seo={seo} />
      <NavBar />
      <Banner
        title={"Our Vision & Mission"}
        description={"Designing Tomorrow's Structures, Today."}
      />

      {/* Main Section */}
      <MainSection />

      {/* Information Section */}
      <Information />

      {/* <OurVision /> */}
      <CounterCard />

      {/* Trust Slider */}
      <SafeSuspenseWrapper height="200px">
        <TrustSlider />
      </SafeSuspenseWrapper>

      {/* Testimonial Card */}
      <SafeSuspenseWrapper height="200px">
        <TestimonialCard />
      </SafeSuspenseWrapper>

      {/* Wave Wrapper */}
      <SafeSuspenseWrapper height="100px">
        <WaveWrapper />
      </SafeSuspenseWrapper>

      {/* Footer */}
      <SafeSuspenseWrapper height="300px">
        <Footer />
      </SafeSuspenseWrapper>
       {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default VisionMission;