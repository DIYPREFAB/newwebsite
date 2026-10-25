import React, { useState, useCallback, useMemo } from 'react';
import ImagePath from '../assets/ImagePath';

// Optimized Image Component with automatic responsive loading
const OptimizedImage = React.memo(({
  src,
  mobileSrc,
  desktopSrc,
  alt,
  className = '',
  style = {},
  loading = 'lazy',
  fetchPriority = 'auto',
  decoding = 'async',
  sizes = '(max-width: 768px) 768px, 1920px',
  background = false,
  children,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate responsive image paths
  const imagePaths = useMemo(() => {
    if (mobileSrc && desktopSrc) {
      return {
        mobile: mobileSrc,
        desktop: desktopSrc,
        fallback: src
      };
    }

    // Auto-generate paths based on the original src
    const baseName = src.split('/').pop().split('.')[0];
    const extension = '.webp';
    
    return {
      mobile: `/images/optimized/mobile/${baseName}-mobile${extension}`,
      desktop: `/images/optimized/desktop/${baseName}-desktop${extension}`,
      fallback: src
    };
  }, [src, mobileSrc, desktopSrc]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    // Fallback to original image on error
    setIsLoaded(true);
  }, []);

  // Background image component
  if (background) {
    return (
      <div
        className={`optimized-background-image ${className}`}
        style={{
          ...style,
          backgroundImage: `url(${imagePaths.desktop})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        {...props}
      >
        {children}
        <style>{`
          @media (max-width: 768px) {
            .optimized-background-image {
              background-image: url(${imagePaths.mobile}) !important;
            }
          }
        `}</style>
      </div>
    );
  }

  // Regular image component
  return (
    <>
      <img
        src={imagePaths.fallback}
        srcSet={`
          ${imagePaths.mobile} 768w,
          ${imagePaths.desktop} 1920w
        `}
        sizes={sizes}
        alt={alt}
        className={`optimized-image ${className} ${isLoaded ? 'loaded' : ''}`}
        style={{
          ...style,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div 
          className="image-placeholder"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Error fallback */}
      {hasError && (
        <div 
          className="image-error"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f8f8f8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            fontSize: '14px'
          }}
        >
          Image unavailable
        </div>
      )}

      <style>{`
        .optimized-image {
          position: relative;
          max-width: 100%;
          height: auto;
        }
        
        .image-placeholder {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #ddd;
          border-top: 2px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Specialized image components for common use cases
export const ResponsiveImage = React.memo(({ src, alt, ...props }) => {
  const imagePaths = useMemo(() => {
    const baseName = src.split('/').pop().split('.')[0];
    return {
      mobile: `/images/optimized/mobile/${baseName}-mobile.webp`,
      desktop: `/images/optimized/desktop/${baseName}-desktop.webp`,
      fallback: src
    };
  }, [src]);

  return (
    <OptimizedImage
      src={imagePaths.fallback}
      mobileSrc={imagePaths.mobile}
      desktopSrc={imagePaths.desktop}
      alt={alt}
      {...props}
    />
  );
});

export const BackgroundImage = React.memo(({ src, children, ...props }) => {
  const imagePaths = useMemo(() => {
    const baseName = src.split('/').pop().split('.')[0];
    return {
      mobile: `/images/optimized/mobile/${baseName}-mobile.webp`,
      desktop: `/images/optimized/desktop/${baseName}-desktop.webp`,
      fallback: src
    };
  }, [src]);

  return (
    <OptimizedImage
      src={imagePaths.fallback}
      mobileSrc={imagePaths.mobile}
      desktopSrc={imagePaths.desktop}
      background={true}
      {...props}
    >
      {children}
    </OptimizedImage>
  );
});

export const ThumbnailImage = React.memo(({ src, alt, ...props }) => {
  const thumbnailPath = useMemo(() => {
    const baseName = src.split('/').pop().split('.')[0];
    return `/images/optimized/thumbnails/${baseName}-thumb.webp`;
  }, [src]);

  return (
    <img
      src={thumbnailPath}
      alt={alt}
      className="thumbnail-image"
      loading="lazy"
      {...props}
    />
  );
});

export default OptimizedImage;
