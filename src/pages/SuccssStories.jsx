import React, { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { FaXTwitter } from "react-icons/fa6";
import { Button, Col, Container, Row } from "reactstrap";
import Banner from "../common/Banner";
import NavBar from "../common/NavBar";
import ImagePath from "../assets/ImagePath";
import SuccessStory from "../components/projectandcasestudies/SuccessStory";
import useSeoHelmet from "../hooks/ReactHelmet";
import SeoHelmet from "../common/SeoHelmet";

// Lazy-loaded components
const WaveWrapper = lazy(() => import("../common/WaveWrapper"));
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";

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

// Correct Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
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
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}

    return this.props.children;
  }
}

const SuccessStories = () => {
  const seo = useSeoHelmet("success-stories");

  return (
    <div>
      <SeoHelmet seo={seo} />
      <NavBar />
      <Banner
        title={"Success Stories"}
        description={"Empowered Minds, Innovative Solutions"}
      />

      <section className="common-section success-stories-wrap">
        <Container>
          <div className="success-head">
            <h6>Our Expert Team</h6>
            <h2>Meet the Team Driving Engineering</h2>
            <p>
              Factory-built steel shortens on-site time. Our process is designed for on-time delivery and clean erection, and timelines are confirmed per project.
            </p>
          </div>
          <div className="success-main">
            <SuccessStory />
          </div>
        </Container>
      </section>

      <section className="common-section join-wrap">
        <div className="join-img-right">
          <img src={ImagePath.sucessBg} alt="Success Background" />
        </div>
        <Container>
          <Row>
            <Col md={6} lg={6}>
              <div className="join-box">
                <h6>Join us</h6>
                <h2>How will you engineer a better world?</h2>
                <p>
                  Join DIYPREFAB and be part of revolutionizing steel construction in India. We are always looking for talented engineers, designers, and project managers who want to make a difference.
                </p>
                <Button className="common-btn">Contact Us</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="common-section insight-article-erap">
        <Container>
          <div className="insight-head">
            <h3>Insight & Article</h3>
            <Link to="#" className="common-btn">
              All Article
            </Link>
          </div>
          <div className="insight-lwr">
            <Row>
              <Col md="3">
                <div className="insight-box">
                  <h3>How We Plan Projects to Deliver On Time</h3>
                  <ul>
                    <li>February 9, 2025</li>
                    <li>1 Comment</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

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
    </div>
  );
};

export default SuccessStories;
