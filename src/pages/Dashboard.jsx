import React, {
  useState,
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";

// Critical components - loaded immediately
import CounterCard from "../common/CounterCard";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";
import Certifications from "../common/Certifications";

import TrustDoor from "../components/home3d/TrustDoor";
import MessageBlock from "../components/home3d/MessageBlock";
import useSeoHelmet from "../hooks/ReactHelmet";
import SeoHelmet from "../common/SeoHelmet";
import ScrollHome from "../components/home3d/ScrollHome";
import HomeNav from "../components/home3d/HomeNav";

const TrustSlider = lazy(() =>
  import(/* webpackChunkName: "trust-slider" */ "../common/TrustSlider").then(
    (module) => ({
      default: module.default,
    })
  )
);

const ContactForm = lazy(() =>
  import(/* webpackChunkName: "contact-form" */ "../common/ContactForm").then(
    (module) => ({
      default: module.default,
    })
  )
);

const LeadModal = lazy(() =>
  import(/* webpackChunkName: "lead-modal" */ "../common/FormModal").then(
    (module) => ({
      default: module.default,
    })
  )
);

// Enhanced Loading Spinner with reduced layout shift
const LoadingSpinner = React.memo(() => (
  <div
    className="loading-spinner"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px 0",
      minHeight: "60px",
      contain: "layout style paint",
    }}
    role="status"
    aria-label="Loading"
  >
    <div
      style={{
        width: "20px",
        height: "20px",
        border: "2px solid #e3e3e3",
        borderTop: "2px solid #3498db",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        willChange: "transform",
      }}
    />
  </div>
));

// Enhanced section placeholder with better aspect ratio handling
const SectionPlaceholder = React.memo(
  ({ height = "100px", className = "", aspectRatio }) => {
    const style = useMemo(
      () => ({
        minHeight: height,
        aspectRatio: aspectRatio || "auto",
        background:
          "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        borderRadius: "4px",
        margin: "10px 0",
        contain: "layout style paint",
      }),
      [height, aspectRatio]
    );

    return (
      <div
        className={`section-placeholder ${className}`}
        style={style}
        role="status"
        aria-label="Loading content"
      />
    );
  }
);

// Optimized Error Boundary with better error reporting
const ErrorBoundary = React.memo(
  ({ children, fallback, componentName = "Component" }) => {
    const [hasError, setHasError] = useState(false);
    const [, setError] = useState(null);

    useEffect(() => {
      setHasError(false);
      setError(null);
    }, [children]);

    useEffect(() => {
      const handleError = (event) => {
        if (event.error) {
          setHasError(true);
          setError(event.error);
          console.error(`Error in ${componentName}:`, event.error);
        }
      };

      window.addEventListener("error", handleError);
      return () => window.removeEventListener("error", handleError);
    }, [componentName]);

    const handleRetry = useCallback(() => {
      setHasError(false);
      setError(null);
    }, []);

    if (hasError) {
      return (
        fallback || (
          <div
            style={{
              padding: "15px",
              textAlign: "center",
              fontSize: "14px",
              border: "1px solid #f0f0f0",
              borderRadius: "4px",
              backgroundColor: "#fafafa",
            }}
          >
            <p style={{ margin: "0 0 10px 0", color: "#666" }}>
              Failed to load {componentName}
            </p>
            <button
              onClick={handleRetry}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                border: "1px solid #ddd",
                borderRadius: "3px",
                background: "#fff",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
            >
              Retry
            </button>
          </div>
        )
      );
    }

    return children;
  }
);

// Enhanced Intersection Observer hook with better performance
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      // Fallback for older browsers
      setIsVisible(true);
      setHasTriggered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setIsVisible(true);
          setHasTriggered(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Increased for better UX
        ...options,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [hasTriggered, options]);

  return [ref, isVisible];
};

// Enhanced preloading hook with connection awareness and resource hints
const useAdvancedPreloading = () => {
  useEffect(() => {
    let timeoutId;

    const addResourceHints = () => {
      // Add resource hints for critical third-party resources
      const hints = [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        { rel: "dns-prefetch", href: "//www.google-analytics.com" },
      ];

      hints.forEach((hint) => {
        const link = document.createElement("link");
        Object.assign(link, hint);
        if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;
        document.head.appendChild(link);
      });
    };

    const preloadCriticalComponents = () => {
      // Priority 1: Interactive elements
      setTimeout(() => {
        import("../common/ContactForm");
      }, 500);

      // Priority 3: Less critical
      setTimeout(() => {
        import("../common/TrustSlider");
      }, 1000);
    };

    // Add resource hints immediately
    addResourceHints();

    // Connection-aware preloading
    if ("connection" in navigator) {
      const connection = navigator.connection;
      const effectiveType = connection.effectiveType;
      const saveData = connection.saveData;

      if (effectiveType === "4g" && !saveData) {
        timeoutId = setTimeout(preloadCriticalComponents, 100);
      } else if (effectiveType === "3g" && !saveData) {
        timeoutId = setTimeout(preloadCriticalComponents, 500);
      }
      // For 2g or save-data: don't preload
    } else {
      // Unknown connection, be conservative
      timeoutId = setTimeout(preloadCriticalComponents, 300);
    }

    // Preload modals on first user interaction
    const preloadModals = () => {
      import("../common/FormModal");
    };

    const handleFirstInteraction = () => {
      preloadModals();
      document.removeEventListener("touchstart", handleFirstInteraction);
      document.removeEventListener("mousedown", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };

    // Multiple interaction types for better coverage
    ["touchstart", "mousedown", "keydown"].forEach((event) => {
      document.addEventListener(event, handleFirstInteraction, {
        passive: true,
        once: true,
      });
    });

    return () => {
      clearTimeout(timeoutId);
      ["touchstart", "mousedown", "keydown"].forEach((event) => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };
  }, []);
};

// Optimized modal hook with better state management for both video and lead modals
const useModalManager = () => {
  const [openVideo, setOpenVideo] = useState(false);
  const [openLead, setOpenLead] = useState(false);

  const toggleVideo = useCallback(() => {
    setOpenVideo((prev) => !prev);
  }, []);

  const toggleLead = useCallback(() => {
    setOpenLead((prev) => !prev);
  }, []);

  const closeVideo = useCallback(() => {
    setOpenVideo(false);
  }, []);

  const closeLead = useCallback(() => {
    setOpenLead(false);
  }, []);

  // Close on escape key for both modals
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (openVideo) {
          closeVideo();
        }
        if (openLead) {
          closeLead();
        }
      }
    };

    if (openVideo || openLead) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      if (!openVideo && !openLead) {
        document.body.style.overflow = "unset";
      }
    };
  }, [openVideo, openLead, closeVideo, closeLead]);

  return useMemo(
    () => ({
      openVideo,
      openLead,
      toggleVideo,
      toggleLead,
      closeVideo,
      closeLead,
    }),
    [openVideo, openLead, toggleVideo, toggleLead, closeVideo, closeLead]
  );
};

// Enhanced lazy component wrapper
const LazySection = React.memo(
  ({
    component: Component,
    fallback,
    height = "150px",
    rootMargin = "100px",
    componentName = "LazyComponent",
    aspectRatio,
    ...props
  }) => {
    const [ref, isVisible] = useIntersectionObserver({ rootMargin });

    return (
      <div ref={ref}>
        {isVisible ? (
          <ErrorBoundary componentName={componentName}>
            <Suspense
              fallback={
                fallback || (
                  <SectionPlaceholder
                    height={height}
                    aspectRatio={aspectRatio}
                  />
                )
              }
            >
              <Component {...props} />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <SectionPlaceholder height={height} aspectRatio={aspectRatio} />
        )}
      </div>
    );
  }
);

// Main Dashboard Component with enhanced performance optimizations
const Dashboard = () => {
  const { openLead, toggleLead, closeLead } = useModalManager();

  useAdvancedPreloading();

  // Memoize SEO data
  const seo = useSeoHelmet("home");

  // Add critical CSS for animations and performance
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      .loading-spinner, .section-placeholder {
        contain: layout style paint;
      }
      /* Optimize font loading */
      @font-display: swap;
      /* Modal optimizations */
      .modal-backdrop {
        backdrop-filter: blur(4px);
        will-change: opacity;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="dashboard-box">
      <SeoHelmet seo={seo} />

      <HomeNav onCta={toggleLead} />

      {/* Scroll-driven 3D home: blueprint -> fabrication -> assembled building */}
      <ScrollHome onCta={toggleLead} />
      {/* Certifications + trusted clients merged into one door-opening block */}
      <TrustDoor>
        <Certifications />
        <LazySection component={TrustSlider} componentName="TrustSlider" />
      </TrustDoor>

      {/* Contact: centred, zoom-out motion */}
      <MessageBlock>
        <LazySection
          component={ContactForm}
          height="300px"
          rootMargin="50px"
          componentName="ContactForm"
        />
      </MessageBlock>

      <Footer />

      {/* Lead Modal - Only render when open with portal for better performance */}
      {openLead && (
        <ErrorBoundary componentName="LeadModal">
          <Suspense fallback={null}>
            <LeadModal open={openLead} onClose={closeLead} />
          </Suspense>
        </ErrorBoundary>
      )}

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default React.memo(Dashboard);
