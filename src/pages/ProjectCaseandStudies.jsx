import React, { useState, lazy, Suspense } from "react";
import { Button, Col, Container, Progress, Row } from "reactstrap";
import { TbSettingsUp } from "react-icons/tb";
import { FaHelmetSafety } from "react-icons/fa6";
import { FaLayerGroup, FaLeaf, FaPlay, FaSortAmountUp } from "react-icons/fa";
import { MdEngineering, MdFactory } from "react-icons/md";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { GiCargoCrane } from "react-icons/gi";
import { VscFileSubmodule } from "react-icons/vsc";
import { FiSettings } from "react-icons/fi";
import Banner from "../common/Banner";
import NavBar from "../common/NavBar";
import Info from "../components/productandservices/portablestructure/Info";
import TestimonialCard from "../common/TestimonialCard";
import OurVision from "../common/OurVision";
import OurServices from "../components/productandservices/diyprefabkits/OurServices";
import ImagePath from "../assets/ImagePath";
import { weOfferList } from "../Constants";
import WhyChooseUs from "../components/productandservices/wallroofingsolutions/sandwichpanel/WhyChooseUs";
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
const ProjectCaseStudies = () => {
  const [openVideo, setOpenVideo] = useState(false);
  const handleOpenVideo = () => setOpenVideo(!openVideo);
  const seo = useSeoHelmet("project-case-studies");

  return (
    <div>
      <SeoHelmet seo={seo} />
      <NavBar />
      <Banner
        title={"Project & Case Studies"}
        description={"Engineering Excellence, Industrial Solutions"}
      />
      <OurServices title={"Products & Services Scalable Prefab & Steel Solutions for Every Sector"} />

      <ErrorBoundary>
        <Suspense fallback={<SectionLoader height="200px" />}>
          <TrustSlider />
        </Suspense>
      </ErrorBoundary>

      <section
        className="we-offer"
        style={{
          backgroundImage: `url(${ImagePath.Bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "60px 0",
          backgroundColor: "#a8dadc",
        }}
      >
        <Container>
          <div className="we-offer-header">
            <p>What WE oFFER</p>
            <h4>Engineering solutions for all industries</h4>
          </div>
          <div className="we-offer-container">
            {weOfferList.map((item, index) => (
              <div className="we-offer-box" key={index}>
                <div className="we-offer-inner">
                  <div className="we-offer-front">
                    <div className="we-offer-icon">{item.icon}</div>
                    <div className="we-offer-content">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  </div>
                  <div className="we-offer-hover-box">
                    <div className="we-offer-hover-content">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                      <Button className="common-btn">Learn More</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <ErrorBoundary>
        <Suspense fallback={<SectionLoader height="200px" />}>
          <CounterCard />
        </Suspense>
      </ErrorBoundary>

      <WhyChooseUs handleOpenVideo={handleOpenVideo} />

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

export default ProjectCaseStudies;
