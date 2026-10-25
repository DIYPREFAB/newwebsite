import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import {
  FaCertificate,
  FaExpand,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import config from "../../config";
import axios from "axios";

const Certifications = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch certifications from CMS
  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}/api/cms/by-category/49`
        );
        const data = response.data;

        if (data?.status && data?.data?.content?.hall_of_fame?.achievements) {
          const achievementItems = data.data.content.hall_of_fame.achievements;

          // Filter only items tagged as certificates or with section_name 'certifications'
          const certs = achievementItems.filter(
            (item) =>
              item.section_name === "certifications" ||
              item.tags?.some((tag) => tag.name === "certificate")
          );

          setCertifications(certs);
        }
      } catch (error) {
        console.error("Error fetching certifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % certifications.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + certifications.length) % certifications.length
    );
  };

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
  }, [lightboxOpen]);

  return (
    <>
      <style>{`
        .cert-showcase {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          position: relative;
          overflow: hidden;
          padding: 80px 0;
        }

        .cert-showcase::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 300px;
          background: linear-gradient(135deg, rgba(13, 110, 253, 0.05) 0%, rgba(25, 135, 84, 0.05) 100%);
          clip-path: polygon(0 0, 100% 0, 100% 70%, 0 100%);
        }

        .cert-header {
          text-align: center;
          margin-bottom: 60px;
          position: relative;
          z-index: 2;
        }

        .cert-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          color: white;
          padding: 8px 24px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
          box-shadow: 0 4px 15px rgba(13, 110, 253, 0.3);
        }

        .cert-main-title {
          font-size: 48px;
          font-weight: 800;
          color: #001524;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .cert-title-highlight {
          background: linear-gradient(135deg, #0d6efd 0%, #198754 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cert-subtitle {
          font-size: 18px;
          color: #6c757d;
          max-width: 800px;
          margin: 0 auto 30px;
          line-height: 1.6;
        }

        .cert-gallery-card {
          position: relative;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          height: 100%;
          cursor: pointer;
        }

        .cert-gallery-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 60px rgba(13, 110, 253, 0.2);
        }

        .cert-image-container {
          position: relative;
          padding-top: 120%; /* Slightly reduced height */
          overflow: hidden;
          background: #f8f9fa;
        }

        .cert-image-container img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .cert-gallery-card:hover .cert-image-container img {
          transform: scale(1.08);
        }

        .cert-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 0%, rgba(0, 21, 36, 0.7) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cert-gallery-card:hover .cert-overlay {
          opacity: 1;
        }

        .cert-expand-icon {
          background: white;
          color: #0d6efd;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          transform: scale(0.8);
          transition: transform 0.3s ease;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .cert-gallery-card:hover .cert-expand-icon {
          transform: scale(1);
        }

        .cert-year-tag {
          position: absolute;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
          color: #001524;
          padding: 8px 16px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 14px;
          box-shadow: 0 4px 15px rgba(255, 193, 7, 0.4);
          z-index: 2;
        }

        .cert-info {
          padding: 24px;
          background: white;
        }

        .cert-badge {
          display: inline-block;
          background: linear-gradient(135deg, #e7f3ff 0%, #cfe2ff 100%);
          color: #0d6efd;
          padding: 5px 14px;
          border-radius: 50px;
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .cert-name {
          font-size: 18px;
          font-weight: 700;
          color: #001524;
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .cert-desc {
          font-size: 14px;
          color: #6c757d;
          line-height: 1.5;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .cert-verified {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #198754;
          font-size: 13px;
          font-weight: 600;
        }

        .cert-verified::before {
          content: '';
          width: 8px;
          height: 8px;
          background: #198754;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Lightbox Styles */
        .cert-lightbox {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-content {
          position: relative;
          max-width: 1400px;
          width: 100%;
          height: 85vh;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 80px rgba(0, 0, 0, 0.5);
        }

        .lightbox-image-section {
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          position: relative;
        }

        .lightbox-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }

        .lightbox-details-section {
          padding: 50px 40px;
          overflow-y: auto;
          background: white;
        }

        .lightbox-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.7);
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 20px;
          color: white;
          z-index: 10;
        }

        .lightbox-close:hover {
          background: #dc3545;
          transform: rotate(90deg);
        }

        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.7);
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 18px;
          color: white;
          z-index: 10;
        }

        .lightbox-nav:hover {
          background: #0d6efd;
          transform: translateY(-50%) scale(1.1);
        }

        .lightbox-prev {
          left: 20px;
        }

        .lightbox-next {
          right: 20px;
        }

        .lightbox-detail-header {
          margin-bottom: 30px;
          padding-bottom: 25px;
          border-bottom: 2px solid #e9ecef;
        }

        .lightbox-counter {
          display: inline-block;
          background: linear-gradient(135deg, #e7f3ff 0%, #cfe2ff 100%);
          color: #0d6efd;
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .lightbox-title {
          font-size: 32px;
          font-weight: 800;
          color: #001524;
          margin-bottom: 15px;
          line-height: 1.3;
        }

        .lightbox-highlight {
          display: inline-block;
          background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
          color: #001524;
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .lightbox-detail-item {
          margin-bottom: 25px;
        }

        .lightbox-detail-label {
          font-size: 12px;
          font-weight: 700;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .lightbox-detail-value {
          font-size: 16px;
          color: #001524;
          line-height: 1.6;
        }

        .lightbox-verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #d1f4e0 0%, #c3f0d8 100%);
          color: #198754;
          padding: 12px 20px;
          border-radius: 50px;
          font-weight: 700;
          margin-top: 20px;
        }

        .lightbox-verified-badge::before {
          content: '✓';
          width: 24px;
          height: 24px;
          background: #198754;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .cert-stats {
          margin-top: 60px;
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }

        .cert-stat-item {
          display: inline-block;
          margin: 0 30px;
        }

        .cert-stat-number {
          font-size: 48px;
          font-weight: 800;
          background: linear-gradient(135deg, #0d6efd 0%, #198754 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
          line-height: 1;
          margin-bottom: 8px;
        }

        .cert-stat-label {
          font-size: 14px;
          color: #6c757d;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        @media (max-width: 768px) {
          .cert-main-title {
            font-size: 32px;
          }

          .cert-stat-item {
            margin: 20px 15px;
          }

          .lightbox-content {
            grid-template-columns: 1fr;
            height: auto;
            max-height: 90vh;
          }

          .lightbox-image-section {
            padding: 30px 20px;
            min-height: 50vh;
          }

          .lightbox-details-section {
            padding: 30px 20px;
          }

          .lightbox-title {
            font-size: 24px;
          }

          .lightbox-nav {
            width: 40px;
            height: 40px;
          }

          .cert-showcase {
            padding: 50px 0;
          }

          .cert-subtitle {
            font-size: 16px;
          }
        }
      `}</style>

      <section className="cert-showcase">
        <Container>
          {/* Header */}
          <div className="cert-header">
            <div className="cert-header-badge">
              <FaCertificate />
              <span>Our Achievements</span>
            </div>
            <h2 className="cert-main-title">
              Award-Winning{" "}
              <span className="cert-title-highlight">Certifications</span>
            </h2>
            <p className="cert-subtitle">
              Recognized globally for our commitment to excellence, quality, and
              innovation in prefab construction. Each certification represents
              our dedication to maintaining the highest industry standards.
            </p>
          </div>

          {/* Gallery Grid */}
          <Row className="g-4">
            {loading ? (
              <Col xs="12" className="text-center">
                <div className="py-5 text-muted">Loading certifications...</div>
              </Col>
            ) : certifications.length > 0 ? (
              certifications.map((cert, index) => (
                <Col key={cert.id || index} lg={3} md={6} sm={12}>
                  <div
                    className="cert-gallery-card"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => openLightbox(index)}
                  >
                    <div className="cert-image-container">
                      {cert.year && (
                        <div className="cert-year-tag">{cert.year}</div>
                      )}
                      {cert.media?.file_path ? (
                        <img
                          src={`${config.apiUrl}/${cert.media.file_path}`}
                          alt={
                            cert.media?.alt_text || cert.title || "Certificate"
                          }
                          onError={(e) => {
                            e.target.src =
                              "/images/certificates/placeholder-cert.png";
                          }}
                        />
                      ) : (
                        <img
                          src="/images/certificates/placeholder-cert.png"
                          alt={cert.title || "Certificate"}
                        />
                      )}
                      <div className="cert-overlay">
                        <div className="cert-expand-icon">
                          <FaExpand />
                        </div>
                      </div>
                    </div>
                    <div className="cert-info">
                      <div className="cert-badge">
                        {cert.highlight || "Certified Excellence"}
                      </div>
                      <h3 className="cert-name">{cert.title}</h3>
                      <p className="cert-desc">
                        {cert.description ||
                          cert.short_description ||
                          cert.content?.substring(0, 150) ||
                          "Industry-recognized certification"}
                      </p>
                      <div className="cert-verified">
                        <span>Verified & Authentic</span>
                      </div>
                    </div>
                  </div>
                </Col>
              ))
            ) : (
              <Col xs="12" className="text-center">
                <p className="text-muted">No certifications available.</p>
              </Col>
            )}
          </Row>

          {/* Stats Section */}
          {certifications.length > 0 && (
            <div className="cert-stats">
              <div className="cert-stat-item">
                <span className="cert-stat-number">
                  {certifications.length}+
                </span>
                <span className="cert-stat-label">Certifications</span>
              </div>
              <div className="cert-stat-item">
                <span className="cert-stat-number">15+</span>
                <span className="cert-stat-label">Years Excellence</span>
              </div>
              <div className="cert-stat-item">
                <span className="cert-stat-number">100%</span>
                <span className="cert-stat-label">Verified</span>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && certifications.length > 0 && (
        <div className="cert-lightbox" onClick={closeLightbox}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="lightbox-close" onClick={closeLightbox}>
              <FaTimes />
            </button>

            {certifications.length > 1 && (
              <>
                <button
                  className="lightbox-nav lightbox-prev"
                  onClick={prevImage}
                >
                  <FaChevronLeft />
                </button>
                <button
                  className="lightbox-nav lightbox-next"
                  onClick={nextImage}
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Left Side - Certificate Image */}
            <div className="lightbox-image-section">
              {certifications[currentImageIndex]?.media?.file_path ? (
                <img
                  src={`${config.apiUrl}/${certifications[currentImageIndex].media.file_path}`}
                  alt={
                    certifications[currentImageIndex]?.media?.alt_text ||
                    certifications[currentImageIndex]?.title ||
                    "Certificate"
                  }
                  className="lightbox-image"
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
                  className="lightbox-image"
                />
              )}
            </div>

            {/* Right Side - Certificate Details */}
            <div className="lightbox-details-section">
              <div className="lightbox-detail-header">
                <div className="lightbox-counter">
                  {currentImageIndex + 1} of {certifications.length}
                </div>

                {certifications[currentImageIndex]?.highlight && (
                  <div className="lightbox-highlight">
                    {certifications[currentImageIndex].highlight}
                  </div>
                )}

                <h2 className="lightbox-title">
                  {certifications[currentImageIndex]?.title}
                </h2>
              </div>

              {certifications[currentImageIndex]?.year && (
                <div className="lightbox-detail-item">
                  <div className="lightbox-detail-label">Year Awarded</div>
                  <div className="lightbox-detail-value">
                    {certifications[currentImageIndex].year}
                  </div>
                </div>
              )}

              {(certifications[currentImageIndex]?.description ||
                certifications[currentImageIndex]?.short_description ||
                certifications[currentImageIndex]?.content) && (
                <div className="lightbox-detail-item">
                  <div className="lightbox-detail-label">Description</div>
                  <div className="lightbox-detail-value">
                    {certifications[currentImageIndex]?.description ||
                      certifications[currentImageIndex]?.short_description ||
                      certifications[currentImageIndex]?.content}
                  </div>
                </div>
              )}

              {certifications[currentImageIndex]?.tags &&
                certifications[currentImageIndex].tags.length > 0 && (
                  <div className="lightbox-detail-item">
                    <div className="lightbox-detail-label">Categories</div>
                    <div className="lightbox-detail-value">
                      {certifications[currentImageIndex].tags
                        .map((tag) => tag.name)
                        .join(", ")}
                    </div>
                  </div>
                )}

              <div className="lightbox-verified-badge">
                Verified & Authenticated
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Certifications;
