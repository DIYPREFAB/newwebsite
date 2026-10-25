import React, { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";
import Banner from "../common/Banner";
import NavBar from "../common/NavBar";
import ImagePath from "../assets/ImagePath";
import SuccessStory from "../components/projectandcasestudies/SuccessStory";
import useSeoHelmet from "../hooks/ReactHelmet";
import SeoHelmet from "../common/SeoHelmet";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";

// Constants
const BANNER_TITLE = "Client Testimonials";
const BANNER_DESCRIPTION = "Empowered Minds, Innovative Solutions";
const SECTION_TITLE = "Our Expert Team";
const SECTION_SUBTITLE = "Meet the Team Driving Engineering";
const SECTION_DESCRIPTION = "Meet our expert engineering team delivering steel building projects across India.";
const JOIN_US_TITLE = "Join us";
const JOIN_US_SUBTITLE = "How will you engineer a better world?";
const JOIN_US_DESCRIPTION = "Join DIYPREFAB and be part of revolutionizing steel construction in India. We are always looking for talented engineers and designers.";
const INSIGHTS_TITLE = "Insight & Article";
const INSIGHTS_BUTTON_TEXT = "All Article";
const LOADING_TEXT = "Loading...";
const JOIN_US_BUTTON_TEXT = "Join Us";

// Lazy-loaded components with error handling
const WaveWrapper = lazy(() =>
  import("../common/WaveWrapper").catch(() => ({ default: () => <div>Failed to load WaveWrapper</div> }))
);


// Loading component
const LoadingSpinner = ({ message = LOADING_TEXT }) => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
    <span className="text-gray-600">{message}</span>
  </div>
);

const ClientTestimonial = () => {
  const seo = useSeoHelmet("client-testimonials");

  return (
    <div>
      <SeoHelmet seo={seo} />
      <NavBar />
      <Banner title={BANNER_TITLE} description={BANNER_DESCRIPTION} />

      <section className="common-section sucess-stories-wrap">
        <Container>
          <div className="sucess-head">
            <h6>{SECTION_TITLE}</h6>
            <h2>{SECTION_SUBTITLE}</h2>
            <p>{SECTION_DESCRIPTION}</p>
          </div>
          <div className="sucess-main">
            <SuccessStory />
          </div>
        </Container>
      </section>

      <section className="common-section join-wrap">
        <div className="join-img-right">
          <img src={ImagePath.sucessBg} alt="Success background" />
        </div>
        <Container>
          <Row>
            <Col md={6} lg={6}>
              <div className="join-box">
                <h6>{JOIN_US_TITLE}</h6>
                <h2>{JOIN_US_SUBTITLE}</h2>
                <p>{JOIN_US_DESCRIPTION}</p>
                <Button className="common-btn">{JOIN_US_BUTTON_TEXT}</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="common-section insight-article-erap">
        <Container>
          <div className="insight-head">
            <h3>{INSIGHTS_TITLE}</h3>
            <Link to="#" className="common-btn">{INSIGHTS_BUTTON_TEXT}</Link>
          </div>
          <div className="insight-lwr">
            <Row>
              <Col md="3">
                <div className="insight-box">
                  <h3>The Future of Fast-Track Construction</h3>
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

      <Suspense fallback={<LoadingSpinner message="Loading visual section..." />}>
        <WaveWrapper />
        <Footer />
      </Suspense>
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default ClientTestimonial;
