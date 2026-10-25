import React, { Suspense, lazy, useState, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row } from 'reactstrap';
import Banner from "../common/Banner";
import NavBar from "../common/NavBar";
import useSeoHelmet from '../hooks/ReactHelmet';
import SeoHelmet from '../common/SeoHelmet';
import { useCustomQuery } from '../utils/QueryHooks';
import BlogServices from '../services/BlogServices';
import { buildQueryString } from '../utils/BuildQuery';
import Loader from '../utils/Loader/Loader';
import NoDataFound from '../utils/NoDataFound';
import BlogCard from '../components/blogandnews/BlogCard';
import Pagination from '../utils/Pagination';
import Footer from '../common/Footer';
import ScrollToTop from '../common/ScrollToTop';

// Lazy-loaded components with error handling


// Loading component
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
    <span className="text-gray-600">{message}</span>
  </div>
);

// Constants
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

const BlogandNews = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const seo = useSeoHelmet("blog-news");
  
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  // Memoized URL params parsing
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const currentPage = useMemo(() => 
    parseInt(searchParams.get('page') || String(DEFAULT_PAGE)), 
    [searchParams]
  );

  // Memoized query parameters
  const queryParams = useMemo(() => 
    buildQueryString([
      { key: "page", value: currentPage },
      { key: "limit", value: limit },
      { key: "is_published", value: true }
    ]), 
    [currentPage, limit]
  );

  // Blog data fetching
  const {
    data: blogList,
    isLoading: isBlogLoad,
    error: blogError
  } = useCustomQuery({
    queryKey: ['blog-list', currentPage, limit],
    service: BlogServices.blogList,
    params: queryParams,
    select: (data) => data?.data,
    errorMsg: "Failed to load blogs",
    onSuccess: (data) => {
      // Optional: Analytics or other side effects
    }
  });

  // Memoized handlers
  const handleLimitChange = useCallback((newLimit) => {
    setLimit(newLimit);
    // Reset to first page when changing limit
    const newParams = new URLSearchParams(location.search);
    newParams.set('page', '1');
    navigate({ search: newParams.toString() });
  }, [location.search, navigate]);

  // Memoized blog data
  const blogData = useMemo(() => blogList?.data || [], [blogList?.data]);
  const hasBlogData = blogData.length > 0;

  // Error state
  if (blogError) {
    return (
      <>
        <SeoHelmet seo={seo} />
        <NavBar />
        <Banner title="Blog and News" />
        <section className="blog-listing common-section container">
          <div className="text-center py-8">
            <h3 className="text-red-600">Error loading blogs</h3>
            <p className="text-gray-600">Please try again later</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </section>
        <Suspense fallback={<LoadingSpinner message="Loading footer..." />}>
          <Footer />
        </Suspense>
      </>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <SeoHelmet seo={seo} />
      
      {/* Navigation */}
      <NavBar />
      
      {/* Hero Section */}
      <Banner title="Blog and News" />

      {/* Main Content */}
      <main>
        {isBlogLoad ? (
          <Loader />
        ) : (
          <section className="blog-listing common-section container">
            <Row>
              {!hasBlogData ? (
                <NoDataFound msg="No Blog Found" />
              ) : (
                blogData.map(blog => (
                  <BlogCard key={blog.id} blog={blog} />
                ))
              )}
            </Row>
            
            {/* Pagination - Only show if not loading and has data */}
            {!isBlogLoad && hasBlogData && blogList?.pagination && (
              <Pagination
                pagination={blogList.pagination}
                onLimitChange={handleLimitChange}
                currentLimit={limit}
              />
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <Suspense fallback={<LoadingSpinner message="Loading footer..." />}>
        <Footer />
      </Suspense>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </>
  );
};

export default BlogandNews;