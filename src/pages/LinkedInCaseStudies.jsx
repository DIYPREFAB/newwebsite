import React, { useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SeoHelmet from '../common/SeoHelmet';
import { trackLandingPageView, trackCombinedConversion, trackCaseStudyClick } from '../services/AnalyticsService';

/**
 * LinkedIn Case Studies Landing Page
 * Middle of Funnel - Consideration Stage
 * Target: Prospects researching solutions
 */

const LinkedInCaseStudies = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Track content engagement
    if (window.lintrk) {
      window.lintrk('track', { conversion_id: 17770817 }); // Content view
    }
    
    // Track in GA4
    trackLandingPageView('Case Studies', 'Consideration');
  }, []);

  const handleCaseStudyClick = (caseStudy) => {
    // Track combined conversion
    trackCombinedConversion('content_engagement', 500, {
      content_type: 'case_study',
      case_study_id: caseStudy.id,
      case_study_name: caseStudy.title
    });
    
    // Also track specific case study engagement
    trackCaseStudyClick(caseStudy.id, caseStudy.title);
  };

  const handleConsultationClick = () => {
    // Track combined conversion
    trackCombinedConversion('cta_click', 2000, {
      cta_location: 'case_studies_page',
      destination: 'consultation'
    });
    navigate('/linkedin/consultation');
  };

  const caseStudies = [
    {
      id: 'chennai-auto',
      title: 'Chennai Auto Component Plant',
      subtitle: '24,000 sqm | Accelerated delivery',
      challenge: 'Client needed roof closure before monsoon. Industry standard: 6 months.',
      solution: 'AI-assisted design + parallel detailing + pre-ordered materials',
      result: 'Delivered on a compressed schedule. First production line operational April 15.',
      metric: 'Time saved',
      metricValue: 'Shorter than standard',
      image: '/images/case-studies/chennai-plant.jpg'
    },
    {
      id: 'bangalore-cold-storage',
      title: 'Bangalore Cold Storage Facility',
      subtitle: '12,000 MT Capacity | Monsoon-Proof Delivery',
      challenge: 'Mango season deadline. 3 firms quoted 6 months minimum.',
      solution: 'Real-time fabrication scheduling + site-first coordination',
      result: 'Captured entire early-season market while competitors still building.',
      metric: 'Market advantage',
      metricValue: '4 months early',
      image: '/images/case-studies/bangalore-cold.jpg'
    },
    {
      id: 'warehouse-lesson',
      title: 'The $200,000 Lesson',
      subtitle: '8,000 sqm Warehouse | Design for Reality',
      challenge: 'Crane rails didn\'t align. Code-compliant but equipment-incompatible.',
      solution: 'Changed process: design to stricter of code OR equipment spec',
      result: 'New checklist prevents similar issues. 0 crane alignment issues since.',
      metric: 'Lessons applied',
      metricValue: 'Applied across projects',
      image: '/images/case-studies/warehouse.jpg'
    }
  ];

  const seoData = {
    title: "Project Case Studies | DIYPREFAB",
    description: "Selected steel building case studies, including an auto component plant and a cold storage facility. Results are project-specific.",
    keywords: "prefab case studies, steel building projects, fast track construction, industrial construction India",
    canonical: "https://diyprefab.com/linkedin/case-studies",
    ogType: "website",
    ogImage: "https://diyprefab.com/og-image-casestudies.jpg"
  };

  return (
    <>
      <SeoHelmet seoData={seoData} />
      
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #1b263b 0%, #001524 100%)' }}>
        <Container>
          <Row className="justify-content-center text-center text-white mb-5">
            <Col lg={8}>
              <span className="badge bg-warning text-dark mb-3">CASE STUDIES</span>
              <h1 className="display-4 fw-bold mb-4">
                Proven Results. Real Projects.
              </h1>
              <p className="lead">
                See how we've helped companies across India deliver steel building 
                projects faster than traditional methods, without cutting corners. Results are project-specific and depend on scope, site and approvals.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          {caseStudies.map((study, index) => (
            <Card key={study.id} className="mb-4 border-0 shadow-sm">
              <Card.Body className="p-0">
                <Row className="g-0">
                  <Col md={4} className="bg-light d-flex align-items-center justify-content-center p-4">
                    <div className="text-center">
                      <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                        <span className="fs-2">{index + 1}</span>
                      </div>
                      <h4 className="text-primary fw-bold">{study.metric}</h4>
                      <p className="text-muted mb-0">{study.metricValue}</p>
                    </div>
                  </Col>
                  <Col md={8} className="p-4">
                    <h3 className="mb-1">{study.title}</h3>
                    <p className="text-muted mb-3">{study.subtitle}</p>
                    
                    <div className="mb-3">
                      <strong>Challenge:</strong>
                      <p className="mb-2">{study.challenge}</p>
                      
                      <strong>Solution:</strong>
                      <p className="mb-2">{study.solution}</p>
                      
                      <strong>Result:</strong>
                      <p className="mb-0 text-success fw-bold">{study.result}</p>
                    </div>

                    <Button 
                      variant="outline-primary" 
                      onClick={() => handleCaseStudyClick(study)}
                    >
                      Read Full Case Study
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Container>
      </section>

      <section className="py-5 bg-light">
        <Container className="text-center">
          <h3 className="mb-4">Ready to See What We Can Do for Your Project?</h3>
          <Button 
            variant="primary" 
            size="lg" 
            className="px-5"
            onClick={handleConsultationClick}
          >
            Book Free Consultation
          </Button>
        </Container>
      </section>
    </>
  );
};

export default LinkedInCaseStudies;
