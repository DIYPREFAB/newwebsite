import React, { Suspense, useState, useEffect, lazy, useCallback } from "react";
import SeoHelmet from "../common/SeoHelmet";
import NavBar from "../common/NavBar";
import Banner from "../common/Banner";
import useSeoHelmet from "../hooks/ReactHelmet";
import config from "../../config";
import axios from "axios";
import { Container, Row, Col } from "reactstrap";
import {
  FaCertificate,
  FaExpand,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CounterCard from "../common/CounterCard";
import WaveWrapper from "../common/WaveWrapper";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";
import WeDo from "../components/dashboard/WeDo";
import WhyChoose from "../components/dashboard/WhyChoose";
import WeOffer from "../components/dashboard/WeOffer";
import TakeAction from "../components/dashboard/TakeAction";

// Lazy load components
const TrustSlider = lazy(() => import("../common/TrustSlider"));
const ContactForm = lazy(() => import("../common/ContactForm"));

const hallOfFameData = [
  {
    icon: "🏆",
    title: "Awards & Recognition",
    desc: "Industry awards and certifications recognizing our commitment to quality, safety, and innovation.",
  },
  {
    icon: "👥",
    title: "People of Excellence",
    desc: "Engineers, leaders, and teams whose expertise and dedication drive our success.",
  },
  {
    icon: "🚀",
    title: "Iconic Projects",
    desc: "Landmark projects delivered across sectors, setting benchmarks in speed and reliability.",
  },
  {
    icon: "🌱",
    title: "Sustainability Leadership",
    desc: "Recognized initiatives focused on eco-friendly fabrication and responsible construction.",
  },
  {
    icon: "🏗️",
    title: "Engineering Milestones",
    desc: "Breakthrough designs and fabrication achievements that redefine prefab construction.",
  },
];

const sliderSettings = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 700,
  autoplay: true,
  autoplaySpeed: 4000,
  slidesToShow: 3,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: "0px",
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
        centerMode: false,
      },
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
        centerMode: false,
      },
    },
  ],
};

const HallOfFame = () => {
  const BANNER_TITLE = "Hall of Fame";
  const LOADING_TEXT = "Loading...";
  const BANNER_DESCRIPTION =
    "Recognizing excellence, innovation, and the people and projects that define our legacy.";

  const seo = useSeoHelmet("hall-of-fame");
  const [achievements, setAchievements] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [hoveredCertIndex, setHoveredCertIndex] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch CMS data and SEO
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Hall of Fame achievements (category_id: 55)
        const achievementsResponse = await axios.get(
          `${config.apiUrl}/api/cms/by-category/49`
        );
        const achievementsData = achievementsResponse.data;

        // Fetch certifications from Hall of Fame section
        if (
          achievementsData?.status &&
          achievementsData?.data?.content?.hall_of_fame?.achievements
        ) {
          const achievementItems =
            achievementsData.data.content.hall_of_fame.achievements;

          // Separate certifications from other achievements
          const certs = achievementItems.filter(
            (item) =>
              item.section_name === "certifications" ||
              item.tags?.some((tag) => tag.name === "certificate")
          );

          const otherAchievements = achievementItems.filter(
            (item) =>
              item.section_name !== "certifications" &&
              !item.tags?.some((tag) => tag.name === "certificate")
          );

          setCertifications(certs);
          setAchievements(otherAchievements);
        }
      } catch (error) {
        console.error("Error fetching Hall of Fame data:", error);
      }
    };

    fetchData();
  }, []);

  // Lightbox functions
  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % certifications.length);
  }, [certifications.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + certifications.length) % certifications.length
    );
  }, [certifications.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;

      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, nextImage, prevImage]);

  // Merge static and dynamic data
  const displayAchievements =
    achievements.length > 0 ? achievements : hallOfFameData;

  const LoadingSpinner = ({ message = LOADING_TEXT }) => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
      <span className="text-gray-600">{message}</span>
    </div>
  );

  return (
    <div>
      <SeoHelmet seo={seo} />
      <NavBar />

      <Banner title={BANNER_TITLE} description={BANNER_DESCRIPTION} />

      {/* Hall of Fame Section */}
      <section className="hall-of-fame py-5">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-5">
            <h2 className="hof-heading">A Legacy of Excellence</h2>
            <p className="hof-subtitle">
              A curated showcase of achievements that reflect our standards,
              values, and long-term impact.
            </p>
          </div>

          {/* Slider */}
          <Slider {...sliderSettings}>
            {displayAchievements.map((item, index) => (
              <div key={index} className="px-3">
                <div className="hof-card">
                  <div className="hof-icon-wrapper">
                    <span className="hof-icon">{item.icon || "🏆"}</span>
                  </div>
                  <h5>{item.title}</h5>
                  <p>{item.desc || item.description}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Certifications Section - Glorified Design */}
      <section className="certifications-section py-5 position-relative">
        {/* Decorative Background Elements */}
        <div className="cert-bg-decoration cert-bg-1"></div>
        <div className="cert-bg-decoration cert-bg-2"></div>
        <div className="cert-bg-decoration cert-bg-3"></div>

        <Container className="position-relative" style={{ zIndex: 2 }}>
          {/* Header with Glorified Design */}
          <div className="text-center mb-5">
            <div className="cert-badge-header mb-3">
              <FaCertificate className="me-2" />
              <span className="text-uppercase">Our Credentials</span>
            </div>
            <h2 className="cert-main-heading">
              Certifications of{" "}
              <span className="cert-highlight-text">Excellence</span>
            </h2>
            <p className="cert-subtitle">
              Industry-recognized certifications that validate our unwavering
              commitment to
              <span className="cert-emphasis">
                {" "}
                excellence, quality, and safety
              </span>{" "}
              standards in every project we deliver.
            </p>
            <div className="cert-divider">
              <span className="cert-divider-line"></span>
              <span className="cert-divider-star">★</span>
              <span className="cert-divider-line"></span>
            </div>
          </div>

          {/* Certification Cards with Enhanced Effects */}
          <Row className="g-4">
            {certifications.length > 0 ? (
              certifications.map((cert, index) => (
                <Col key={index} lg={3} md={6} sm={12}>
                  <div
                    className="cert-card"
                    onMouseEnter={() => setHoveredCertIndex(index)}
                    onMouseLeave={() => setHoveredCertIndex(null)}
                    onClick={() => openLightbox(index)}
                    style={{
                      cursor: "pointer",
                      transform:
                        hoveredCertIndex === index
                          ? "translateY(-12px) scale(1.02)"
                          : "translateY(0)",
                      boxShadow:
                        hoveredCertIndex === index
                          ? "0 20px 60px rgba(0, 21, 36, 0.2), 0 0 0 3px rgba(13, 110, 253, 0.1)"
                          : "0 4px 20px rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    {/* Glowing Effect on Hover */}
                    {hoveredCertIndex === index && (
                      <div className="cert-glow-effect"></div>
                    )}

                    {/* Shine Effect */}
                    <div className="cert-shine"></div>

                    {/* Image Wrapper with Premium Frame */}
                    <div className="cert-image-wrapper">
                      <div className="cert-corner-decoration cert-corner-tl"></div>
                      <div className="cert-corner-decoration cert-corner-tr"></div>
                      <div className="cert-corner-decoration cert-corner-bl"></div>
                      <div className="cert-corner-decoration cert-corner-br"></div>

                      {cert.media?.file_path ? (
                        <img
                          src={`${config.apiUrl}/${cert?.media?.file_path}`}
                          alt={
                            cert.media?.alt_text || cert.title || "Certificate"
                          }
                          className="cert-image"
                          onError={(e) => {
                            e.target.src =
                              "/images/certificates/placeholder-cert.png";
                          }}
                        />
                      ) : (
                        <img
                          src="/images/certificates/placeholder-cert.png"
                          alt={cert.title || "Certificate"}
                          className="cert-image"
                        />
                      )}

                      {/* Enhanced Year Badge with Icon */}
                      {cert.year && (
                        <div className="cert-year-badge">
                          <span className="cert-year-icon">🏆</span>
                          <span>{cert.year}</span>
                        </div>
                      )}

                      {/* Premium Overlay */}
                      <div
                        className="cert-premium-overlay"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background:
                            "linear-gradient(to bottom, transparent 0%, rgba(0, 21, 36, 0.7) 100%)",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.opacity = "1";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.opacity = "0";
                        }}
                      >
                        <div
                          className="cert-overlay-icon"
                          style={{
                            background: "white",
                            color: "#0d6efd",
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "24px",
                            transform: "scale(0.8)",
                            transition: "transform 0.3s ease",
                            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          <FaExpand />
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Content Section */}
                    <div className="cert-content">
                      <div className="cert-highlight-badge">
                        {cert.highlight || "Certified Excellence"}
                      </div>
                      <h5 className="cert-title">{cert.title}</h5>
                      <p className="cert-description">
                        {cert.description ||
                          cert.short_description ||
                          cert.content?.substring(0, 100)}
                      </p>

                      {/* Authenticity Seal */}
                      <div className="cert-authenticity-seal">
                        <div className="cert-seal-dot"></div>
                        <span>Verified & Certified</span>
                      </div>
                    </div>
                  </div>
                </Col>
              ))
            ) : (
              <Col xs="12" className="text-center">
                <p className="text-muted">Loading certifications...</p>
              </Col>
            )}
          </Row>

          {/* Bottom Trust Badge */}
          <div className="text-center mt-5">
            <div className="cert-trust-badge">
              <FaCertificate className="cert-trust-icon" />
              <div className="cert-trust-text">
                <strong>Trusted Excellence</strong>
                <p className="mb-0">
                  Certified by International Standards Organizations
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Additional Sections like Index Page */}
      <WeDo />

      <CounterCard />

      <WhyChoose />

      <WeOffer />

      <TakeAction />

      {/* Trust Slider - Lazy Loaded */}
      <Suspense fallback={<LoadingSpinner />}>
        <TrustSlider />
      </Suspense>

      {/* Contact Form Section */}
      <section className="send-message">
        <Container>
          <Row className="align-items-center">
            <Col md={12} lg={8}>
              <Suspense fallback={<LoadingSpinner />}>
                <ContactForm />
              </Suspense>
            </Col>
          </Row>
        </Container>
      </section>

      <Suspense fallback={<LoadingSpinner />}>
        <WaveWrapper />
        <Footer />
      </Suspense>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Lightbox Modal */}
      {lightboxOpen && certifications.length > 0 && (
        <div
          className="cert-lightbox"
          onClick={closeLightbox}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.95)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "1400px",
              width: "100%",
              height: "85vh",
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: "40px",
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 20px 80px rgba(0, 0, 0, 0.5)",
            }}
          >
            <button
              className="lightbox-close"
              onClick={closeLightbox}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(0, 0, 0, 0.7)",
                border: "none",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: "20px",
                color: "white",
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#dc3545";
                e.target.style.transform = "rotate(90deg)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(0, 0, 0, 0.7)";
                e.target.style.transform = "rotate(0deg)";
              }}
            >
              <FaTimes />
            </button>

            {certifications.length > 1 && (
              <>
                <button
                  className="lightbox-nav lightbox-prev"
                  onClick={prevImage}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "20px",
                    transform: "translateY(-50%)",
                    background: "rgba(0, 0, 0, 0.7)",
                    border: "none",
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontSize: "18px",
                    color: "white",
                    zIndex: 10,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#0d6efd";
                    e.target.style.transform = "translateY(-50%) scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(0, 0, 0, 0.7)";
                    e.target.style.transform = "translateY(-50%) scale(1)";
                  }}
                >
                  <FaChevronLeft />
                </button>
                <button
                  className="lightbox-nav lightbox-next"
                  onClick={nextImage}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "20px",
                    transform: "translateY(-50%)",
                    background: "rgba(0, 0, 0, 0.7)",
                    border: "none",
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontSize: "18px",
                    color: "white",
                    zIndex: 10,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#0d6efd";
                    e.target.style.transform = "translateY(-50%) scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(0, 0, 0, 0.7)";
                    e.target.style.transform = "translateY(-50%) scale(1)";
                  }}
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Left Side - Certificate Image */}
            <div
              className="lightbox-image-section"
              style={{
                background: "#f8f9fa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
              }}
            >
              {certifications[currentImageIndex]?.media?.file_path ? (
                <img
                  src={`${config.apiUrl}/${certifications[currentImageIndex].media.file_path}`}
                  alt={
                    certifications[currentImageIndex]?.media?.alt_text ||
                    certifications[currentImageIndex]?.title ||
                    "Certificate"
                  }
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: "8px",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
                  }}
                  onError={(e) => {
                    e.target.src = "/images/certificates/placeholder-cert.png";
                  }}
                />
              ) : (
                <img
                  src="/images/certificates/placeholder-cert.png"
                  alt={
                    certifications[currentImageIndex]?.title || "Certificate"
                  }
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: "8px",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
                  }}
                />
              )}
            </div>

            {/* Right Side - Certificate Details */}
            <div
              className="lightbox-details-section"
              style={{
                padding: "50px 40px",
                overflowY: "auto",
                background: "white",
              }}
            >
              <div
                className="lightbox-detail-header"
                style={{
                  marginBottom: "30px",
                  paddingBottom: "25px",
                  borderBottom: "2px solid #e9ecef",
                }}
              >
                <div
                  className="lightbox-counter"
                  style={{
                    display: "inline-block",
                    background:
                      "linear-gradient(135deg, #e7f3ff 0%, #cfe2ff 100%)",
                    color: "#0d6efd",
                    padding: "6px 16px",
                    borderRadius: "50px",
                    fontSize: "13px",
                    fontWeight: "700",
                    marginBottom: "20px",
                  }}
                >
                  {currentImageIndex + 1} of {certifications.length}
                </div>

                {certifications[currentImageIndex]?.highlight && (
                  <div
                    className="lightbox-highlight"
                    style={{
                      display: "inline-block",
                      background:
                        "linear-gradient(135deg, #ffc107 0%, #ff9800 100%)",
                      color: "#001524",
                      padding: "6px 16px",
                      borderRadius: "50px",
                      fontSize: "13px",
                      fontWeight: "700",
                      marginBottom: "10px",
                    }}
                  >
                    {certifications[currentImageIndex].highlight}
                  </div>
                )}

                <h2
                  className="lightbox-title"
                  style={{
                    fontSize: "32px",
                    fontWeight: "800",
                    color: "#001524",
                    marginBottom: "15px",
                    lineHeight: "1.3",
                  }}
                >
                  {certifications[currentImageIndex]?.title}
                </h2>
              </div>

              {certifications[currentImageIndex]?.year && (
                <div
                  className="lightbox-detail-item"
                  style={{ marginBottom: "25px" }}
                >
                  <div
                    className="lightbox-detail-label"
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#6c757d",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "8px",
                    }}
                  >
                    Year Awarded
                  </div>
                  <div
                    className="lightbox-detail-value"
                    style={{
                      fontSize: "16px",
                      color: "#001524",
                      lineHeight: "1.6",
                    }}
                  >
                    {certifications[currentImageIndex].year}
                  </div>
                </div>
              )}

              {(certifications[currentImageIndex]?.description ||
                certifications[currentImageIndex]?.short_description ||
                certifications[currentImageIndex]?.content) && (
                <div
                  className="lightbox-detail-item"
                  style={{ marginBottom: "25px" }}
                >
                  <div
                    className="lightbox-detail-label"
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#6c757d",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "8px",
                    }}
                  >
                    Description
                  </div>
                  <div
                    className="lightbox-detail-value"
                    style={{
                      fontSize: "16px",
                      color: "#001524",
                      lineHeight: "1.6",
                    }}
                  >
                    {certifications[currentImageIndex]?.description ||
                      certifications[currentImageIndex]?.short_description ||
                      certifications[currentImageIndex]?.content}
                  </div>
                </div>
              )}

              {certifications[currentImageIndex]?.tags &&
                certifications[currentImageIndex].tags.length > 0 && (
                  <div
                    className="lightbox-detail-item"
                    style={{ marginBottom: "25px" }}
                  >
                    <div
                      className="lightbox-detail-label"
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#6c757d",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        marginBottom: "8px",
                      }}
                    >
                      Categories
                    </div>
                    <div
                      className="lightbox-detail-value"
                      style={{
                        fontSize: "16px",
                        color: "#001524",
                        lineHeight: "1.6",
                      }}
                    >
                      {certifications[currentImageIndex].tags
                        .map((tag) => tag.name)
                        .join(", ")}
                    </div>
                  </div>
                )}

              <div
                className="lightbox-verified-badge"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  background:
                    "linear-gradient(135deg, #d1f4e0 0%, #c3f0d8 100%)",
                  color: "#198754",
                  padding: "12px 20px",
                  borderRadius: "50px",
                  fontWeight: "700",
                  marginTop: "20px",
                }}
              >
                ✓ Verified & Authenticated
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallOfFame;
