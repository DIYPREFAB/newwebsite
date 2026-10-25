import React, { lazy, Suspense } from "react";
import { Col, Container, Row } from 'reactstrap';
import NavBar from "../common/NavBar";
import Banner from "../common/Banner";
import ContactForm from "../common/ContactForm";
import SeoHelmet from "../common/SeoHelmet";
import useSeoHelmet from "../hooks/ReactHelmet";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";

// Constants
const BANNER_TITLE = "Inquiry Form";
const BANNER_DESCRIPTION = "Reach Out for Innovation and Industrial Solutions";
const LOADING_TEXT = "Loading...";

// Lazy-loaded components with error handling


// Loading component
const LoadingSpinner = ({ message = LOADING_TEXT }) => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
    <span className="text-gray-600">{message}</span>
  </div>
);

const EnquiryForm = () => {
  const seo = useSeoHelmet("inquiry-form");

  return (
    <div>
      <SeoHelmet seo={seo} />
      <NavBar />
      <Banner title={BANNER_TITLE} description={BANNER_DESCRIPTION} />

      <section className="send-message">
        <Container>
          <Row className="align-items-center justify-content-center">
            <Col md={12} lg={8}>
              <ContactForm />
            </Col>
          </Row>
        </Container>
      </section>

      <Suspense fallback={<LoadingSpinner message="Loading footer..." />}>
        <Footer />
      </Suspense>
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default EnquiryForm;
