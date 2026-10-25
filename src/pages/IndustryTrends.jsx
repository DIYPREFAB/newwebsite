import React, { Suspense, lazy, useState, useMemo } from 'react';
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
import ScrollToTop from "../common/ScrollToTop";

// Constants
const BANNER_TITLE = "Blog and News";
const BANNER_DESCRIPTION = "Industry Trends";
const CATEGORY_SLUG = "industry-trends";
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;
const LOADING_TEXT = "Loading...";

// Lazy-loaded components with error handling
const WaveWrapper = lazy(() =>
  import("../common/WaveWrapper").catch(() => ({ default: () => <div>Failed to load WaveWrapper</div> }))
);

const Footer = lazy(() =>
  import("../common/Footer").catch(() => ({ default: () => <div>Failed to load Footer</div> }))
);

// Loading component
const LoadingSpinner = ({ message = LOADING_TEXT }) => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
    <span className="text-gray-600">{message}</span>
  </div>
);

const IndustryTrends = () => {
  const seo = useSeoHelmet("industry-trends");
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  // Memoized current page
  const currentPage = useMemo(() =>
    parseInt(searchParams.get('page') || String(DEFAULT_PAGE)),
    [searchParams]
  );

  // Memoized query parameters
  const queryParams = useMemo(() =>
    buildQueryString([
      { key: "page", value: currentPage },
      { key: "limit", value: limit },
      { key: "category_slug", value: CATEGORY_SLUG },
      { key: "is_published", value: true }
    ]),
    [currentPage, limit]
  );

  // Fetch blog data
  const {
    data: blogList,
    isLoading: isBlogLoad,
  } = useCustomQuery({
    queryKey: ['blog-list-category', currentPage, limit],
    service: BlogServices.blogList,
    params: queryParams,
    select: (data) => data?.data,
    onSuccess: (data) => {
      // Optional: Analytics or other side effects
    }
  });

  return (
    <div>
      <SeoHelmet seo={seo} />
      <NavBar />
      <Banner title={BANNER_TITLE} description={BANNER_DESCRIPTION} />

      {isBlogLoad ? (
        <Loader />
      ) : (
        <section className="blog-listing common-section container">
          <Row>
            {blogList?.data?.length === 0 ? (
              <NoDataFound msg="No Blog Found" />
            ) : (
              blogList?.data.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))
            )}
          </Row>
          {!isBlogLoad && blogList?.pagination && (
            <Pagination pagination={blogList.pagination} />
          )}
        </section>
      )}

      <Suspense fallback={<LoadingSpinner message="Loading visual section..." />}>
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

export default IndustryTrends;
