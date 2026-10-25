/**
 * Generates JSON-LD structured data for blog posts based on GEO fields
 * @param {Object} blogData - Blog post data including GEO fields
 * @param {string} currentUrl - Current page URL
 * @returns {Object} JSON-LD schema object
 */
export const generateJSONLDSchema = (blogData, currentUrl) => {
  const {
    title,
    content,
    published_at,
    author,
    category,
    cover_image,
    ai_summary,
    faq_section,
    schema_type,
    entities_keywords
  } = blogData;

  // Base schema structure
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": schema_type || "Article",
    "headline": title,
    "description": ai_summary || content?.substring(0, 160),
    "datePublished": published_at,
    "dateModified": published_at,
    "author": {
      "@type": "Person",
      "name": author?.name || "Unknown Author"
    },
    "publisher": {
      "@type": "Organization",
      "name": "DIY PreFab Solutions",
      "url": window.location.origin
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    },
    "url": currentUrl
  };

  // Add category if available
  if (category) {
    baseSchema.articleSection = category.name;
  }

  // Add cover image if available
  if (cover_image) {
    baseSchema.image = {
      "@type": "ImageObject",
      "url": cover_image.startsWith('http') ? cover_image : `${window.location.origin}/${cover_image}`,
      "width": 1200,
      "height": 630
    };
  }

  // Add keywords if available
  if (entities_keywords && entities_keywords.length > 0) {
    baseSchema.keywords = entities_keywords.join(', ');
  }

  // Generate FAQ schema if FAQ section exists
  if (faq_section && faq_section.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faq_section.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    // Return both schemas
    return [baseSchema, faqSchema];
  }

  return [baseSchema];
};

/**
 * Generates fallback JSON-LD schema using existing SEO data
 * @param {Object} blogData - Blog post data
 * @param {string} currentUrl - Current page URL
 * @returns {Object} JSON-LD schema object
 */
export const generateFallbackJSONLDSchema = (blogData, currentUrl) => {
  const {
    title,
    content,
    published_at,
    author,
    category
  } = blogData;

  return [{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": content?.substring(0, 160),
    "datePublished": published_at,
    "dateModified": published_at,
    "author": {
      "@type": "Person",
      "name": author?.name || "Unknown Author"
    },
    "publisher": {
      "@type": "Organization",
      "name": "DIY PreFab Solutions",
      "url": window.location.origin
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    },
    "url": currentUrl,
    "articleSection": category?.name
  }];
};
