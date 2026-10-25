import React, { Suspense, lazy, useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { FaIndustry, FaCogs, FaClipboardCheck, FaTruck, FaPaintRoller, FaRulerCombined, FaHammer } from "react-icons/fa";
import ImagePath from "../assets/ImagePath";
import useSeoHelmet from "../hooks/ReactHelmet";
import SeoHelmet from "../common/SeoHelmet";
import ScrollToTop from "../common/ScrollToTop";

// Lazy load components
const NavBar = lazy(() => import("../common/NavBar").then(m => ({ default: m.default })));
const Banner = lazy(() => import("../common/Banner").then(m => ({ default: m.default })));
const Footer = lazy(() => import("../common/Footer").then(m => ({ default: m.default })));
const WaveWrapper = lazy(() => import("../common/WaveWrapper").then(m => ({ default: m.default })));

const LoadingFallback = () => (
  <div className="loading-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px", fontSize: "16px", color: "#666" }}>
    <div className="loading-spinner" style={{ width: "20px", height: "20px", border: "2px solid #f3f3f3", borderTop: "2px solid #3498db", borderRadius: "50%", animation: "spin 1s linear infinite", marginRight: "10px" }} />
    Loading...
  </div>
);

// Production stages data
const productionStages = [
  {
    id: 1,
    title: "Stage 1: Cutting — Plasma + Oxyfuel",
    icon: <FaRulerCombined className="stage-icon" />,
    description: "Every PEB structure begins with precision cutting. Our facility uses advanced Plasma + Oxyfuel cutting machines to process raw steel plates and sections with millimeter accuracy. The CNC-controlled cutting table ensures clean edges and minimal material waste, with each piece traced to its position in the BIM model.",
    details: ["Plasma + Oxyfuel cutting", "CNC-controlled precision", "Minimal material waste", "BIM-traceable pieces"],
    image: "/images/plasma-3-maxpro-200.jpeg",
    placeholder: false
  },
  {
    id: 2,
    title: "Stage 2: Fabrication, Shearing & Threading",
    icon: <FaCogs className="stage-icon" />,
    description: "From shearing to submerged arc welding to precision threading — our fabrication line handles every step. Our CNC shearing machine cuts steel up to 10mm, the fully automatic PTW beam welding machine uses SAW principle for deep consistent welds, and our threading & power press equipment prepares connection-ready members. Every piece is fabricated to exact BIM specifications, ensuring perfect fit during site assembly.",
    details: ["CNC shearing (10mm capacity)", "PTW beam welding (SAW principle)", "Threading & power press", "BIM-specified fabrication"],
    images: [
      "/images/cnc-shearing-machine.jpeg",
      "/images/fully-automatic-ptw.jpeg",
      "/images/fully-automatic-ptw-2.jpeg",
      "/images/threading-and-power-press-machine.jpeg",
      "/images/2-radial-drill-machines.jpeg",
      "/images/2-radial-drill-machines-2.jpeg",
      "/images/welding-section.jpeg",
      "/images/welding-section-2.jpeg"
    ],
    placeholder: false
  },
  {
    id: 3,
    title: "Stage 3: Surface Treatment",
    icon: <FaPaintRoller className="stage-icon" />,
    description: "Our automatic shot blasting machine with 8 wheels ensures thorough surface preparation, removing mill scale and impurities from every steel member. After blasting, components receive hot-dip galvanizing (80-120 microns) for corrosion protection, followed by color-coated finishing with PU/PIR insulation for thermal and weather resistance.",
    details: ["8-wheel automatic shot blasting", "Hot-dip galvanizing (80-120 microns)", "Color coating", "Weather resistance"],
    images: [
      "/images/automatic-shot-blasting-machine.jpeg",
      "/images/automatic-shot-blasting-machine-2.jpeg"
    ],
    placeholder: false
  },
  {
    id: 4,
    title: "Stage 4: Fittup & Quality Check",
    icon: <FaClipboardCheck className="stage-icon" />,
    description: "Our fittup section performs mock assembly of structural members under EOT crane supervision, ensuring every connection, bolt hole, and weld joint aligns perfectly before dispatch. After fittup, each member undergoes rigorous quality inspection — dimensional accuracy checks, weld quality verification using ultrasonic testing, and surface finish inspection — reducing on-site rework to near zero.",
    details: ["Mock assembly (fittup) under EOT crane", "Dimensional accuracy check", "Weld quality verification", "Surface finish inspection"],
    images: [
      "/images/fittup-section.jpeg",
      "/images/h-beam-tacking-section.jpeg"
    ],
    placeholder: false
  },
  {
    id: 5,
    title: "Stage 5: Packing & Dispatch",
    icon: <FaTruck className="stage-icon" />,
    description: "Completed members are carefully packaged with protective wrapping and loaded for dispatch under professional warehouse management. Each package is labeled with QR codes linking to the BIM model and assembly instructions. Our logistics team coordinates delivery to ensure materials arrive on-site just-in-time for erection, with forklift-assisted loading and organized pallet staging.",
    details: ["Protective packaging & pallet staging", "QR code labeling", "Forklift-assisted loading", "Just-in-time delivery"],
    image: "/images/production-stage-5-packing.png",
    placeholder: false
  }
];

const ProductionPlant = () => {
  const seo = useSeoHelmet("production-plant");
  const [lightbox, setLightbox] = useState({ isOpen: false, images: [], currentIndex: 0, title: "" });

  const openLightbox = (images, title, index = 0) => {
    const imageArray = Array.isArray(images) ? images : [images];
    if (imageArray.length === 0) return;
    setLightbox({ isOpen: true, images: imageArray, currentIndex: index, title });
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightbox({ isOpen: false, images: [], currentIndex: 0, title: "" });
    document.body.style.overflow = "";
  };

  const goToPrev = () => {
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }));
  };

  const goToNext = () => {
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox.isOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox.isOpen]);

  return (
    <div>
      <SeoHelmet seo={seo} />

      <Suspense fallback={<LoadingFallback />}>
        <NavBar />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <Banner
          title="Our Production Plant"
          description="Where Precision Engineering Meets Manufacturing Excellence"
        />
      </Suspense>

      {/* Hero Section */}
      <section className="production-plant-hero">
        <Container>
          <Row className="align-items-center">
            <Col md={12} lg={6}>
              <div className="plant-hero-content">
                <h2>World-Class PEB Manufacturing Facility</h2>
                <p>
                  Located in <strong>Banswara, Rajasthan</strong>, our 10,000+ sqm production plant is the heart of DIYPREFAB's manufacturing operations. Equipped with CNC machinery, automated welding stations, and advanced surface treatment facilities, we produce precision-engineered steel components for projects across India and beyond.
                </p>
                <p>
                  From raw steel to ready-to-install building kits, every step follows ISO 9001 quality management standards with full traceability from material source to site delivery.
                </p>
                <div className="plant-stats">
                  <div className="stat-item">
                    <h4>10,000+</h4>
                    <p>Sq. Meters Facility</p>
                  </div>
                  <div className="stat-item">
                    <h4>1000+</h4>
                    <p>Tons/Year Capacity</p>
                  </div>
                  <div className="stat-item">
                    <h4>7+</h4>
                    <p>Years Experience</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={12} lg={6}>
              <div className="plant-hero-image">
                <img src="/images/secondary-bay.jpeg" alt="DIYPREFAB Production Plant" className="img-fluid" />
                <div className="plant-badge">
                  <FaHammer />
                  <span>ISO 9001 Certified</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Production Process Gallery */}
      <section className="production-process-section">
        <Container>
          <div className="section-header">
            <h2>Our Production Process</h2>
            <p>From Design to Dispatch — Every Step, Documented</p>
          </div>

          <div className="production-stages">
            {productionStages.map((stage, index) => (
              <div key={stage.id} className={`stage-card ${index % 2 === 1 ? 'reverse' : ''}`}>
                <Row className="align-items-center">
                  <Col md={12} lg={6} className="stage-image-col">
                    <div className="stage-image-wrapper">
                      {stage.images && stage.images.length > 0 ? (
                        <div className="stage-images-grid">
                          {stage.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt={`${stage.title} ${i + 1}`}
                              className="img-fluid"
                              onClick={() => openLightbox(stage.images, stage.title, i)}
                              style={{ cursor: "pointer" }}
                            />
                          ))}
                        </div>
                      ) : stage.placeholder ? (
                        <div className="placeholder-image">
                          <div className="placeholder-icon">{stage.icon}</div>
                          <div className="placeholder-text">
                            <p>{stage.title}</p>
                            <span className="coming-soon">Photo Coming Soon</span>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={stage.image}
                          alt={stage.title}
                          className="img-fluid"
                          onClick={() => openLightbox(stage.image, stage.title)}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                      <div className="stage-number">{String(stage.id).padStart(2, '0')}</div>
                    </div>
                  </Col>
                  <Col md={12} lg={6} className="stage-content-col">
                    <div className="stage-content">
                      <div className="stage-title-wrapper">
                        {stage.icon}
                        <h3>{stage.title}</h3>
                      </div>
                      <p className="stage-description">{stage.description}</p>
                      <ul className="stage-details">
                        {stage.details.map((detail, idx) => (
                          <li key={idx}><span className="detail-bullet">▸</span>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Facility Features */}
      <section className="facility-features-section">
        <Container>
          <div className="section-header">
            <h2>Facility Capabilities</h2>
            <p>Advanced Equipment for Precision Manufacturing</p>
          </div>
          <Row>
            <Col md={6} lg={4}>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaCogs />
                </div>
                <h4>CNC Machinery</h4>
                <p>Computer-controlled cutting and drilling for millimeter-level accuracy on every structural member.</p>
              </div>
            </Col>
            <Col md={6} lg={4}>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaIndustry />
                </div>
                <h4>Automated Welding</h4>
                <p>Robotic and semi-automatic welding stations ensure consistent weld quality and reduce fabrication time.</p>
              </div>
            </Col>
            <Col md={6} lg={4}>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaPaintRoller />
                </div>
                <h4>Surface Treatment Line</h4>
                <p>Complete shot blasting, galvanizing, and powder coating facility for corrosion-resistant finishes.</p>
              </div>
            </Col>
            <Col md={6} lg={4}>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaClipboardCheck />
                </div>
                <h4>Quality Lab</h4>
                <p>In-house testing for tensile strength, chemical composition, coating thickness, and dimensional accuracy.</p>
              </div>
            </Col>
            <Col md={6} lg={4}>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaRulerCombined />
                </div>
                <h4>BIM Integration</h4>
                <p>Direct data transfer from BIM models to CNC machines eliminates human error in fabrication.</p>
              </div>
            </Col>
            <Col md={6} lg={4}>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaTruck />
                </div>
                <h4>Logistics Hub</h4>
                <p>Dedicated loading bay and fleet coordination for timely delivery across Rajasthan, Gujarat, and MP.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="plant-cta-section">
        <Container>
          <div className="cta-box">
            <h2>See Our Facility in Action</h2>
            <p>Schedule a site visit to our Banswara production plant and witness the precision behind every DIYPREFAB structure.</p>
            <a href="/contact-us" className="cta-button">Book a Factory Tour</a>
          </div>
        </Container>
      </section>

      <Suspense fallback={<LoadingFallback />}>
        <WaveWrapper />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <Footer />
      </Suspense>

      <ScrollToTop />

      {/* Lightbox Modal */}
      {lightbox.isOpen && (
        <div className="stage-lightbox-overlay" onClick={closeLightbox}>
          <div className="stage-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="stage-lightbox-close" onClick={closeLightbox} aria-label="Close">
              ✕
            </button>

            {lightbox.images.length > 1 && (
              <button className="stage-lightbox-arrow stage-lightbox-arrow-left" onClick={goToPrev} aria-label="Previous">
                ‹
              </button>
            )}

            <div className="stage-lightbox-image-wrap">
              <img
                src={lightbox.images[lightbox.currentIndex]}
                alt={`${lightbox.title} ${lightbox.currentIndex + 1}`}
              />
              {lightbox.images.length > 1 && (
                <div className="stage-lightbox-counter">
                  {lightbox.currentIndex + 1} / {lightbox.images.length}
                </div>
              )}
            </div>

            {lightbox.images.length > 1 && (
              <button className="stage-lightbox-arrow stage-lightbox-arrow-right" onClick={goToNext} aria-label="Next">
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ProductionPlant);
