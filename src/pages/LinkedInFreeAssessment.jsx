import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Form, Alert } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import SeoHelmet from '../common/SeoHelmet';
import { createContact, createDeal } from '../services/HubSpotService';
import { trackLandingPageView, trackCombinedConversion } from '../services/AnalyticsService';

/**
 * LinkedIn Free Assessment Landing Page
 * Middle of Funnel - Consideration Stage
 * Target: Users who watched awareness videos or engaged with content
 */

const LinkedInFreeAssessment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    projectSize: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    // Track page view for LinkedIn retargeting
    if (window.lintrk) {
      window.lintrk('track', { conversion_id: 17770812 }); // Page view
    }
    
    // Track in GA4
    trackLandingPageView('Free Assessment', 'Consideration');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Track combined conversion (LinkedIn + GA4)
    trackCombinedConversion('form_submit', 1000, {
      form_name: 'Free Assessment',
      project_type: formData.projectType,
      project_size: formData.projectSize,
      timeline: formData.timeline
    });

    // Create contact in HubSpot
    const hubspotResult = await createContact({
      ...formData,
      firstName: formData.firstName,
      lastName: formData.lastName,
      sourceDetail: 'LinkedIn Free Assessment Landing Page',
      campaign: 'linkedin-brand-to-demand-q2-2026'
    });

    if (hubspotResult.success) {
      // Create deal for assessment request
      await createDeal({
        dealName: `${formData.company || 'New Lead'} - Free Assessment Request`,
        amount: 0,
        stage: 'appointmentscheduled',
        projectType: formData.projectType,
        projectSize: formData.projectSize,
        timeline: formData.timeline,
        description: `Free assessment request from LinkedIn. Project: ${formData.projectType}, Size: ${formData.projectSize} sqm, Timeline: ${formData.timeline}`
      }, hubspotResult.contactId);

      setSubmitStatus({ type: 'success', message: 'Thank you! We\'ll contact you within 24 hours.' });
      
      // Redirect to Cal.com after short delay
      setTimeout(() => {
        window.location.href = 'https://cal.com/diyprefab/45min';
      }, 2000);
    } else {
      setSubmitStatus({ type: 'danger', message: 'Something went wrong. Please try again or call us directly.' });
      setIsSubmitting(false);
    }
  };

  const handleCalClick = () => {
    // Track combined conversion
    trackCombinedConversion('booking', 2000, {
      booking_type: '15_min_call'
    });
  };

  const seoData = {
    title: "Free Project Assessment | DIYPREFAB",
    description: "Get a free feasibility assessment for your steel building project. See if your timeline is achievable with our AI-assisted design process.",
    keywords: "steel building assessment, prefab project evaluation, AI design",
    canonical: "https://diyprefab.com/linkedin/free-assessment",
    ogType: "website",
    ogImage: "https://diyprefab.com/og-image-assessment.jpg"
  };

  return (
    <>
      <SeoHelmet seoData={seoData} />
      
      {/* Hero Section */}
      <section className="linkedin-landing-hero py-5" style={{ background: 'linear-gradient(135deg, #1b263b 0%, #001524 100%)' }}>
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={7} className="text-white">
              <span className="badge bg-warning text-dark mb-3">FREE ASSESSMENT</span>
              <h1 className="display-4 fw-bold mb-4">
                Is Your Project Feasible on a Fast-Track Schedule?
              </h1>
              <p className="lead mb-4">
                Get a free feasibility assessment from our engineers. We'll analyze your 
                project requirements and tell you whether a fast-track delivery is achievable — 
                no obligation, no sales pitch.
              </p>
              <ul className="list-unstyled mb-4">
                <li className="mb-2">✓ Timeline analysis</li>
                <li className="mb-2">✓ Cost estimate range</li>
                <li className="mb-2">✓ Risk identification</li>
                <li className="mb-2">✓ Delivery confidence score</li>
              </ul>
              <Button 
                variant="warning" 
                size="lg" 
                className="px-5 py-3 fw-bold"
                data-cal-link="45min"
                data-cal-namespace="45min"
                onClick={handleCalClick}
              >
                Book Free 15-Min Call
              </Button>
            </Col>
            <Col lg={5}>
              <Card className="shadow-lg border-0">
                <Card.Body className="p-4">
                  <h4 className="mb-4">Request Free Assessment</h4>
                  {submitStatus && (
                    <Alert variant={submitStatus.type} className="mb-3">
                      {submitStatus.message}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name *</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Your first name" 
                        required 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Last Name *</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Your last name" 
                        required 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control 
                        type="email" 
                        placeholder="you@company.com" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Company *</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Company name" 
                        required 
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control 
                        type="tel" 
                        placeholder="+91..."
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Project Type *</Form.Label>
                      <Form.Select 
                        required
                        value={formData.projectType}
                        onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                      >
                        <option value="">Select...</option>
                        <option value="industrial">Industrial Building</option>
                        <option value="warehouse">Warehouse/Storage</option>
                        <option value="commercial">Commercial</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Estimated Size (sqm)</Form.Label>
                      <Form.Control 
                        type="number" 
                        placeholder="e.g., 5000"
                        value={formData.projectSize}
                        onChange={(e) => setFormData({...formData, projectSize: e.target.value})}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Timeline Needed</Form.Label>
                      <Form.Select
                        value={formData.timeline}
                        onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                      >
                        <option value="">Select...</option>
                        <option value="urgent">&lt; 3 months (Urgent)</option>
                        <option value="standard">3-6 months</option>
                        <option value="flexible">6-12 months</option>
                        <option value="planning">&gt; 1 year (Planning)</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100 py-3 fw-bold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Get My Free Assessment'}
                    </Button>
                  </Form>
                  <p className="text-muted small mt-3 mb-0 text-center">
                    ⏱️ Response within 24 hours
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Trust Indicators */}
      <section className="py-4 bg-light">
        <Container>
          <Row className="text-center">
            <Col md={3}>
              <h3 className="text-primary fw-bold">Free</h3>
              <p className="mb-0">Feasibility Review</p>
            </Col>
            <Col md={3}>
              <h3 className="text-primary fw-bold">Factory</h3>
              <p className="mb-0">Built Steel</p>
            </Col>
            <Col md={3}>
              <h3 className="text-primary fw-bold">PEB</h3>
              <p className="mb-0">Pre-Engineered</p>
            </Col>
            <Col md={3}>
              <h3 className="text-primary fw-bold">Fast</h3>
              <p className="mb-0">Team Response</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5">How the Assessment Works</h2>
          <Row>
            <Col md={4} className="text-center mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <span className="fs-4 fw-bold">1</span>
              </div>
              <h5>Submit Details</h5>
              <p className="text-muted">Fill out the form with your project requirements</p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <span className="fs-4 fw-bold">2</span>
              </div>
              <h5>Engineer Review</h5>
              <p className="text-muted">Our team analyzes feasibility within 24 hours</p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <span className="fs-4 fw-bold">3</span>
              </div>
              <h5>Get Results</h5>
              <p className="text-muted">Receive timeline estimate and next steps</p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default LinkedInFreeAssessment;
