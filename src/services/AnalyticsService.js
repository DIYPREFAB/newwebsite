/**
 * Google Analytics 4 Event Tracking
 * Tracks custom events for LinkedIn landing pages
 */

/**
 * Track custom GA4 event
 */
export const trackGAEvent = (eventName, eventParams = {}) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, {
      ...eventParams,
      send_to: import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-S8KND0M92C'
    });
    console.log('GA4 Event:', eventName, eventParams);
  }
};

/**
 * Track LinkedIn landing page view
 */
export const trackLandingPageView = (pageName, funnelStage) => {
  trackGAEvent('landing_page_view', {
    page_name: pageName,
    funnel_stage: funnelStage,
    traffic_source: 'LinkedIn Ads'
  });
};

/**
 * Track form submission
 */
export const trackFormSubmit = (formName, formData = {}) => {
  trackGAEvent('generate_lead', {
    form_name: formName,
    traffic_source: 'LinkedIn Ads',
    ...formData
  });
};

/**
 * Track Cal.com booking click
 */
export const trackBookingClick = (pageName) => {
  trackGAEvent('consultation_booking', {
    page_name: pageName,
    traffic_source: 'LinkedIn Ads'
  });
};

/**
 * Track case study engagement
 */
export const trackCaseStudyClick = (caseStudyId, caseStudyName) => {
  trackGAEvent('case_study_engagement', {
    case_study_id: caseStudyId,
    case_study_name: caseStudyName,
    traffic_source: 'LinkedIn Ads'
  });
};

/**
 * Track combined conversion (LinkedIn + GA4)
 */
export const trackCombinedConversion = (conversionType, value, params = {}) => {
  // Track in LinkedIn
  if (window.trackLinkedInConversion) {
    const linkedinIds = {
      'form_submit': 17770813,
      'booking': 17770814,
      'consultation_view': 17770815,
      'consultation_book': 17770816,
      'content_view': 17770817,
      'content_engagement': 17770818,
      'cta_click': 17770819
    };
    
    if (linkedinIds[conversionType]) {
      window.trackLinkedInConversion(linkedinIds[conversionType], value);
    }
  }

  // Track in GA4
  trackGAEvent(conversionType, {
    value: value,
    currency: 'INR',
    ...params
  });
};

export default {
  trackGAEvent,
  trackLandingPageView,
  trackFormSubmit,
  trackBookingClick,
  trackCaseStudyClick,
  trackCombinedConversion
};
