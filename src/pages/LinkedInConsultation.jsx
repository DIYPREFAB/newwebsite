import React, { useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import SeoHelmet from '../common/SeoHelmet';
import { trackLandingPageView, trackCombinedConversion } from '../services/AnalyticsService';

/**
 * LinkedIn Consultation Booking Page
 * Bottom of Funnel - Conversion Stage
 * Target: High-intent prospects ready to book a meeting
 */

const LinkedInConsultation = () => {
  useEffect(() => {
    // Track high-intent page view
    if (window.lintrk) {
      window.lintrk('track', { conversion_id: 17770815 }); // High intent page view
    }
    
    // Track in GA4
    trackLandingPageView('Consultation Booking', 'Conversion');
  }, []);

  const handleCalClick = () => {
    // Track combined conversion
    trackCombinedConversion('consultation_book', 5000, {
      booking_type: '45_min_strategy'
    });
  };

  const seoData = {
    title: "Book Free Consultation | DIYPREFAB",
    description: "Book a free 45-minute consultation with our steel building experts. Discuss your project and get timeline estimates.",
    keywords: "steel building consultation, prefab expert call, project discussion",
    canonical: "https://diyprefab.com/linkedin/consultation",
    ogType: "website",
    ogImage: "https://diyprefab.com/og-image-consultation.jpg"
  };

  return (
    <>
      <SeoHelmet seoData={seoData} />
      
      <section className="linkedin-landing-hero py-5" style={{ background: 'linear-gradient(135deg, #001524 0%, #1b263b 100%)', minHeight: '100vh' }}>
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={8} className="text-center text-white">
              <span className="badge bg-success mb-3">45-MINUTE STRATEGY SESSION</span>
              
              <h1 className="display-3 fw-bold mb-4">
                Let's Discuss Your Project
              </h1>
              
              <p className="lead mb-5">
                Book a free consultation with our engineering team. We'll review your 
                requirements, discuss timeline options, and show you exactly how we've 
                helped companies like yours shorten project delivery.
              </p>

              <Row className="mb-5">
                <Col md={4} className="mb-3">
                  <Card className="h-100 border-0 bg-white bg-opacity-10">
                    <Card.Body className="text-white">
                      <h5>📋 Project Review</h5>
                      <p className="mb-0 small">We'll analyze your specific requirements and constraints</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} className="mb-3">
                  <Card className="h-100 border-0 bg-white bg-opacity-10">
                    <Card.Body className="text-white">
                      <h5>⏱️ Timeline Planning</h5>
                      <p className="mb-0 small">Get a realistic delivery schedule based on your needs</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} className="mb-3">
                  <Card className="h-100 border-0 bg-white bg-opacity-10">
                    <Card.Body className="text-white">
                      <h5>💰 Budget Estimate</h5>
                      <p className="mb-0 small">Receive a preliminary cost range for your project</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Button 
                variant="warning" 
                size="lg" 
                className="px-5 py-4 fw-bold fs-5 mb-4"
                data-cal-link="45min"
                data-cal-namespace="45min"
                onClick={handleCalClick}
              >
                📅 Book My Free Consultation
              </Button>

              <p className="text-white-50 mb-5">
                Available slots this week: Limited | Next available: Tomorrow
              </p>

              {/* Testimonial */}
              <Card className="border-0 bg-white bg-opacity-10 text-white text-start">
                <Card.Body className="p-4">
                  <blockquote className="mb-3">
                    "The consultation gave us clarity we couldn't get from 3 other vendors. 
                    Within 45 minutes, we had a realistic timeline and budget. Project 
                    delivered exactly as promised."
                  </blockquote>
                  <footer className="text-white-50">
                    — Operations Director, Chennai Auto Plant
                  </footer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default LinkedInConsultation;
