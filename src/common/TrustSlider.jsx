import React, { useState, useCallback, useMemo } from 'react';
import { Col, Container, Row } from 'reactstrap';
import Slider from 'react-slick';
import ImagePath from '../assets/ImagePath';
import { ResponsiveImage } from './OptimizedImage';

const imageList = [
  { img: ImagePath.downSlider1, alt: 'ROHAN Limited - Trusted Engineering Partner' },
  { img: ImagePath.downSlider2, alt: 'TTIPL - Industrial Innovation Leader' },
  { img: ImagePath.downSlider3, alt: 'Alpha Natural Resources - Sustainable Solutions' },
  { img: ImagePath.downSlider4, alt: 'BAS Engineering - Quality Structures' },
  { img: ImagePath.downSlider5, alt: 'Industry Partner - Reliable Solutions' },
];



// Optimized Trust Logo Component
const TrustLogoImage = React.memo(({ src, alt, index }) => {
  return (
    <div className="trust-logo-wrapper">
      <img
        src={src}
        alt={alt}
        className="trust-logo-image"
        loading="lazy"
        style={{ 
          width: 'auto', 
          height: '100%', 
          objectFit: 'contain',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        onError={(e) => {
          console.error(`Failed to load image: ${src}`, e);
          // Fallback to a placeholder
          e.target.style.display = 'none';
          if (e.target.nextSibling) {
            e.target.nextSibling.style.display = 'flex';
          }
        }}
      />
      {/* Fallback placeholder */}
      <div 
        style={{
          display: 'none',
          width: '100%',
          height: '100%',
          background: '#f0f0f0',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          color: '#666',
          textAlign: 'center'
        }}
      >
        {alt}
      </div>
    </div>
  );
});

TrustLogoImage.displayName = 'TrustLogoImage';

const TrustSlider = React.memo(() => {
  // Memoize slider settings to prevent recreation
  const settings = useMemo(() => ({
    infinite: true,
    speed: 8000,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    slidesToShow: 3,
    slidesToScroll: 1,
    rtl: false,
    arrows: false,
    pauseOnHover: false,
    variableWidth: false,
    centerMode: true,
    centerPadding: '0px',
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          speed: 6000,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          speed: 5000,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          speed: 4000,
        },
      },
    ],
  }), []);

  // Memoize slides to prevent recreation
  const slides = useMemo(() =>
    imageList.map((item, index) => (
      <div key={index} className="trust-slide-item">
        <TrustLogoImage
          src={item.img}
          alt={item.alt}
          index={index}
        />
      </div>
    )), []);

  return (
    <>
      <style>{`
        /* Trust Slider Specific Styles - Significantly Reduced Height */
        .trust-slider {
          padding: clamp(10px, 2vw, 20px) 0; /* Reduced from 20px-40px */
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          position: relative;
          overflow: hidden;
        }
        
        .trust-slider::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23000" opacity="0.02"/><circle cx="75" cy="75" r="1" fill="%23000" opacity="0.02"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
          pointer-events: none;
          z-index: 1;
        }
        
        .trust-slider .container {
          position: relative;
          z-index: 2;
        }
        
        .trust-slider-container {
          padding: clamp(5px, 1vw, 10px); /* Reduced from 10px-20px */
        }
        
        .trust-slider-container h2 {
          font-size: clamp(18px, 3vw, 24px); /* Reduced from 20px-28px */
          font-weight: 700;
          color: #001524;
          margin-bottom: clamp(4px, 1vw, 8px); /* Reduced from 8px-15px */
          line-height: 1.1; /* Reduced from 1.2 */
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .trust-slider-container p {
          font-size: clamp(12px, 2vw, 14px); /* Reduced from 13px-16px */
          color: #495057;
          margin-bottom: clamp(4px, 1vw, 8px); /* Reduced from 10px-15px */
          line-height: 1.3; /* Reduced from 1.5 */
          font-weight: 400;
        }
        
        .trust-slider-container hr {
          border: 0;
          height: 2px;
          background: linear-gradient(90deg, #001524, transparent);
          margin: clamp(4px, 1vw, 8px) 0; /* Reduced from 10px-15px */
          border-radius: 2px;
        }
        
        /* Trust Slider Specific Slick Overrides - Ultra Compact */
        .trust-slider .slick-slider {
          margin: 0 !important;
          padding: 0 !important;
          height: clamp(35px, 5vw, 45px) !important; /* Force fixed height */
          line-height: 1 !important; /* Remove default line-height */
        }
        
        .trust-slider .slick-list {
          overflow: hidden;
          padding: 0 !important; /* Force remove padding */
          margin: 0 !important; /* Force remove margin */
          height: 100% !important; /* Force full height of slider */
        }
        
        .trust-slider .slick-track {
          display: flex !important;
          align-items: center !important;
          height: 100% !important; /* Force full height of list */
          margin: 0 !important; /* Remove any default margin */
          padding: 0 !important; /* Remove any default padding */
        }
        
        .trust-slider .slick-slide {
          padding: 0 clamp(3px, 0.5vw, 6px) !important; /* Force reduced padding */
          margin: 0 !important; /* Remove any margin */
          outline: none;
          height: 100% !important; /* Force full height of track */
          line-height: 1 !important; /* Remove line-height issues */
        }
        
        .trust-slider .slick-slide > div {
          height: 100% !important; /* Force inner div to full height */
        }
        
        .trust-slide-item {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          height: 100% !important; /* Force full height instead of fixed clamp */
          padding: 0 !important; /* Remove all padding from slide item */
          margin: 0 !important; /* Remove all margin from slide item */
          min-height: clamp(35px, 5vw, 45px) !important; /* Force minimum height constraint */
          max-height: clamp(35px, 5vw, 45px) !important; /* Force maximum height constraint */
        }
        
        .trust-logo-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 100%;
          max-height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border-radius: 6px; /* Reduced from 8px */
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06); /* Reduced shadow */
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.05);
          margin: 2px; /* Add small margin instead of slide item padding */
        }
        

        
        .trust-logo-wrapper:hover {
          transform: translateY(-1px) scale(1.01);
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1); /* Reduced shadow */
        }
        
      .trust-logo-image {
        width: auto;
        height: 100%;
        max-height: 100%;
        max-width: 100%;
        object-fit: contain;
        transition: all 0.3s ease;
        filter: grayscale(20%) brightness(1.1);
        display: block;
        margin: 0 auto;
      }

      .trust-logo-image.trust-loaded {
        filter: grayscale(0%) brightness(1);
      }
        
        .trust-logo-wrapper:hover .trust-logo-image {
          transform: scale(1.03);
          filter: grayscale(0%) brightness(1.1);
        }
        
        .trust-logo-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #f8f9fa 25%, transparent 25%),
                      linear-gradient(-45deg, #f8f9fa 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #f8f9fa 75%),
                      linear-gradient(-45deg, transparent 75%, #f8f9fa 75%);
          background-size: 12px 12px;
          background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .trust-loading-spinner {
          width: 16px; /* Reduced from 20px */
          height: 16px; /* Reduced from 20px */
          border: 2px solid #e9ecef;
          border-top: 2px solid #001524;
          border-radius: 50%;
          animation: trustSpin 1s linear infinite;
        }
        
        .trust-logo-error {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
          font-size: 10px; /* Reduced from 11px */
          text-align: center;
        }
        
        @keyframes trustSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Map Section - Reduced Height */
        .trust-map-img-box {
          padding: clamp(5px, 1vw, 10px); /* Reduced from 10px-20px */
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .trust-map-img-box img {
          max-width: 100%;
          height: auto;
          border-radius: 8px; /* Reduced from 12px */
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06); /* Reduced shadow */
          transition: all 0.3s ease;
        }
        
        .trust-map-img-box img:hover {
          transform: scale(1.01);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); /* Reduced shadow */
        }
        
        /* Responsive Design - All Reduced with Forced Heights */
        @media (max-width: 992px) {
          .trust-slider {
            padding: clamp(8px, 2vw, 15px) 0; /* Reduced */
          }
          
          .trust-slider-container {
            margin-bottom: clamp(8px, 2vw, 12px); /* Reduced */
          }
          
          .trust-slider-container h2 {
            font-size: clamp(16px, 3vw, 20px); /* Reduced */
          }
          
          .trust-slider .slick-slider {
            height: 35px !important;
          }
          .trust-slide-item {
            min-height: 28px !important;
            max-height: 35px !important;
          }
          .trust-logo-wrapper {
            min-height: 28px !important;
            max-height: 35px !important;
          }
        }
        
        @media (max-width: 768px) {
          .trust-slider {
            padding: clamp(8px, 2vw, 12px) 0; /* Reduced */
          }
          
          .trust-slider-container {
            text-align: center;
            margin-bottom: 8px; /* Reduced */
          }
          
          .trust-slider-container h2 {
            font-size: clamp(14px, 4vw, 18px); /* Reduced */
            margin-bottom: 4px; /* Reduced */
          }
          
          .trust-slider-container p {
            font-size: clamp(11px, 2.5vw, 13px); /* Reduced */
            margin-bottom: 4px; /* Reduced */
          }
          
          .trust-slider .slick-slider {
            height: 30px !important;
          }
          .trust-slide-item {
            min-height: 24px !important;
            max-height: 30px !important;
          }
          .trust-logo-wrapper {
            min-height: 24px !important;
            max-height: 30px !important;
          }
        }
        
        @media (max-width: 480px) {
          .trust-slider {
            padding: 4px 0 !important;
          }
          .trust-slider .container,
          .trust-slider-container {
            padding: 0 !important;
            margin: 0 !important;
          }
          .trust-slider .slick-slider,
          .trust-slider .slick-list,
          .trust-slider .slick-track {
            height: 32px !important;
            min-height: 0 !important;
            max-height: 32px !important;
          }
          .trust-slide-item,
          .trust-logo-wrapper,
          .trust-logo-image {
            height: 28px !important;
            min-height: 0 !important;
            max-height: 28px !important;
          }
        }
        
        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .trust-slider .slick-slider {
            animation: none !important;
          }
          
          .trust-loading-spinner,
          .trust-logo-wrapper,
          .trust-logo-image {
            animation: none !important;
            transition: none !important;
          }
        }
        
        /* Hide default slick dots and arrows for trust slider */
        .trust-slider .slick-dots {
          display: none !important;
        }
        
        .trust-slider .slick-arrow {
          display: none !important;
        }
        
        /* Ensure smooth scrolling */
        .trust-slider .slick-track {
          will-change: transform;
        }
        
        /* Custom focus styles */
        .trust-logo-wrapper:focus-within {
          outline: 2px solid #001524;
          outline-offset: 2px;
        }
      `}</style>

      <section className="trust-slider" aria-label="Trusted Partners Section">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="trust-slider-container">
                <h2>Trusted by Engineering Visionaries and Industrial Innovators Worldwide</h2>
                <p>
                  Trusted by engineering and industrial leaders for delivering
                  innovative, reliable, and scalable prefab building solutions.
                </p>
                <hr />
                <div role="region" aria-label="Partner logos carousel">
                  <Slider {...settings}>
                    {slides}
                  </Slider>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="trust-map-img-box">
                <img
                  src={ImagePath.Map}
                  alt="World map showing global trust and partnership locations"
                  className="img-fluid"
                  loading="lazy"

                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
});

TrustSlider.displayName = 'TrustSlider';

export default TrustSlider;