import React, { Suspense, lazy, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import Banner from "../common/Banner";
import NavBar from "../common/NavBar";
import SeoHelmet from '../common/SeoHelmet';
import BlogServices from '../services/BlogServices';
import { useCustomQuery } from '../utils/QueryHooks';
import Swal from 'sweetalert2';
import Loader from '../utils/Loader/Loader';
import moment from 'moment';
import parse from 'html-react-parser';
import { buildQueryString } from '../utils/BuildQuery';
import ImagePath from '../assets/ImagePath';
import Footer from '../common/Footer';
import ScrollToTop from "../common/ScrollToTop";
import FAQComponent from '../components/FAQComponent';
import { generateJSONLDSchema, generateFallbackJSONLDSchema } from '../utils/JSONLDSchemaGenerator';

// Lazy-loaded components with error handling
const WaveWrapper = lazy(() =>
  import("../common/WaveWrapper").catch(() => ({ default: () => <div>Failed to load WaveWrapper</div> }))
);



// Loading component
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
    <span className="text-gray-600">{message}</span>
  </div>
);

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Memoized query parameters for blog details
  const blogDetailsParams = useMemo(() => ({ slug }), [slug]);

  // Fetch blog details
  const {
    data: blogDetails,
    isLoading: isBlogDetailsLoading,
  } = useCustomQuery({
    queryKey: ['blog-details', slug],
    service: BlogServices.blogBySlug,
    params: blogDetailsParams,
    enabled: !!slug,
    staleTime: 0,
    select: (data) => {
      if (!data?.data?.status) {
        Swal.fire({
          title: "Error",
          text: data?.data?.message,
          icon: "error",
        });
        navigate(-1);
        return;
      }
      return data?.data?.data;
    },
    onSuccess: () => {
      // Optional: Analytics or other side effects
    }
  });

  // Memoized query parameters for related blogs
  const relatedBlogParams = useMemo(() => buildQueryString([
    { key: "page", value: 1 },
    { key: "limit", value: 5 },
    { key: "category_slug", value: blogDetails?.category?.slug },
    { key: "is_published", value: true },
  ]), [blogDetails?.category?.slug]);

  // Fetch related blogs
  const {
    data: relatedBlog,
    isLoading: isRelatedBlogLoad,
  } = useCustomQuery({
    queryKey: ['related-blog-details', slug, isBlogDetailsLoading],
    service: BlogServices.blogList,
    params: relatedBlogParams,
    enabled: !isBlogDetailsLoading && !!blogDetails?.category?.id,
    staleTime: 0,
    select: (data) => {
      if (!data?.data?.status) {
        Swal.fire({
          title: "Error",
          text: data?.data?.message,
          icon: "error",
        });
        navigate(-1);
        return;
      }
      return data?.data?.data?.filter((blog) => blog.slug !== blogDetails?.slug);
    },
  });

  // Memoized SEO data with GEO support
  const seo = useMemo(() => {
    if (!blogDetails) return { title: "Blog Post" };
    
    const currentUrl = window.location.href;
    
    // Generate JSON-LD schema based on GEO fields or fallback to basic schema
    let jsonLd;
    if (blogDetails.ai_summary || blogDetails.faq_section || blogDetails.schema_type || blogDetails.entities_keywords) {
      jsonLd = generateJSONLDSchema(blogDetails, currentUrl);
    } else {
      jsonLd = generateFallbackJSONLDSchema(blogDetails, currentUrl);
    }
    
    return {
      title: blogDetails.title,
      meta_description: blogDetails.ai_summary || blogDetails.content?.substring(0, 160),
      meta_keywords: blogDetails.entities_keywords?.join(', '),
      json_ld: JSON.stringify(jsonLd),
      og_title: blogDetails.title,
      og_description: blogDetails.ai_summary || blogDetails.content?.substring(0, 160),
      og_image: blogDetails.cover_image,
      og_type: "article"
    };
  }, [blogDetails]);

  return (
    <div>
      <SeoHelmet seo={seo} />
      <NavBar />
      {isBlogDetailsLoading ? (
        <Loader />
      ) : (
        <>
          <Banner title={blogDetails?.title || "Blog Post Title"} />
          <section className="common-section blog-details">
            <Container>
              <Row>
                <Col md="6" lg="9" className="mb-4">
                  <div className="blog-details-content">
                    <h1 className="blog-title">{blogDetails?.title || "Blog Post Title"}</h1>
                    <p className="blog-date">
                      Published on: {blogDetails.published_at && moment(blogDetails.published_at).format("lll")}
                    </p>
                    <div className="blog-details-img">
                      <img src={ImagePath.MainSlider1} alt="Blog Post" className="img-fluid mb-4" />
                    </div>
                    <div className="blog-details-meta">
                      <Link to={"/blog-news/" + blogDetails?.category?.slug}>
                        <p className="blog-category">Category: {blogDetails?.category?.name}</p>
                      </Link>
                    </div>
                    <div>
                      <p className="blog-text">
                        {blogDetails.content && parse(blogDetails.content)}
                      </p>
                    </div>
                    
                    {/* AI Summary Display */}
                    {blogDetails.ai_summary && (
                      <div className="ai-summary-section mt-4">
                        <div className="card">
                          <div className="card-body">
                            <h5 className="card-title">
                              <i className="fas fa-robot me-2"></i>
                              AI Summary
                            </h5>
                            <p className="card-text">{blogDetails.ai_summary}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* FAQ Section Display */}
                    {blogDetails.faq_section && blogDetails.faq_section.length > 0 && (
                      <div className="faq-section mt-4">
                        <FAQComponent 
                          faqs={blogDetails.faq_section} 
                          title="Frequently Asked Questions"
                        />
                      </div>
                    )}
                    
                    {/* Entities & Keywords Display */}
                    {blogDetails.entities_keywords && blogDetails.entities_keywords.length > 0 && (
                      <div className="entities-section mt-4">
                        <div className="card">
                          <div className="card-body">
                            <h5 className="card-title">
                              <i className="fas fa-tags me-2"></i>
                              Key Concepts
                            </h5>
                            <div className="d-flex flex-wrap gap-2">
                              {blogDetails.entities_keywords.map((keyword, index) => (
                                <span key={index} className="badge bg-primary">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Col>
                {!isRelatedBlogLoad && relatedBlog?.length > 0 && (
                  <Col md="6" lg="3" className="mb-4">
                    <div className="blog-details-sidebar">
                      <h2 className="sidebar-title">Related Posts</h2>
                      <ul className="related-posts-list">
                        {relatedBlog?.map((blog) => (
                          <li key={blog.id}>
                            <Link to={"/blog/" + blog.slug}>{blog.title}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                )}
              </Row>
            </Container>
          </section>
        </>
      )}

      <Suspense fallback={<LoadingSpinner message="Loading WaveWrapper..." />}>
        <WaveWrapper />
      </Suspense>

      <Suspense fallback={<LoadingSpinner message="Loading footer..." />}>
        <Footer />
      </Suspense>
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default BlogDetails;
