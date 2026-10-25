import React, { Suspense, lazy, useState } from 'react';
import Banner from "../common/Banner";
import NavBar from "../common/NavBar";
import useSeoHelmet from '../hooks/ReactHelmet';
import SeoHelmet from '../common/SeoHelmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCustomQuery } from '../utils/QueryHooks';
import BlogServices from '../services/BlogServices';
import { buildQueryString } from '../utils/BuildQuery';
import Loader from '../utils/Loader/Loader';
import NoDataFound from '../utils/NoDataFound';
import BlogCard from '../components/blogandnews/BlogCard';
import Pagination from '../utils/Pagination';
import { Row } from 'reactstrap';

// Lazy-loaded components
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";

// Loading Spinner Component
const LoadingSpinner = React.memo(() => (
  <div
    className="loading-spinner-container"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px 0",
      minHeight: "100px",
    }}
    role="status"
    aria-label="Loading content"
  >
    <div
      className="spinner"
      style={{
        width: "24px",
        height: "24px",
        border: "3px solid #f3f3f3",
        borderTop: "3px solid #007bff",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
));

// Section Loader Component
const SectionLoader = React.memo(({ height = "150px" }) => (
  <div
    style={{
      minHeight: height,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: 0.7,
    }}
    role="status"
    aria-label="Loading section"
  >
    <LoadingSpinner />
  </div>
));

// Correct Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          <p>Something went wrong loading this section.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: "8px 16px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              background: "#f8f9fa",
              cursor: "pointer",
            }}
          >
            Retry
          </button>

    </div>
  );
}

    return this.props.children;
  }
}

const SustainabilityInPreFab = () => {
  const seo = useSeoHelmet("sustainability-in-prefab");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [limit] = useState(10);

  // Get page from URL, default to 1
  const currentPage = parseInt(searchParams.get('page') || '1');

  const {
    data: blogList,
    isLoading: isBlogLoad,
  } = useCustomQuery({
    queryKey: ['blog-list-category', currentPage],
    service: BlogServices.blogList,
    params: buildQueryString([
      { key: "page", value: currentPage || 1 },
      { key: "limit", value: limit || 10 },
      { key: "category_slug", value: "sustainability-in-prefab" },
      { key: "is_published", value: true },
    ]),
    select: (data) => data?.data,
    errorMsg: "",
    onSuccess: () => { /* Handle success if needed */ },
  });

  return (
    <div>
      <SeoHelmet seo={seo} />
      <NavBar />
      <Banner
        title={"Blog and News"}
        description={"Sustainability In Prefab"}
      />
      {isBlogLoad ? (
        <Loader />
      ) : (
        <section className="blog-listing common-section container">
          <Row>
            {blogList?.data?.length === 0 ? (
              <NoDataFound msg={"No Blog Found"} />
            ) : (
              blogList?.data.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))
            )}
          </Row>
          {!isBlogLoad && <Pagination pagination={blogList?.pagination} />}
        </section>
      )}

      <ErrorBoundary>
        <Suspense fallback={<SectionLoader height="200px" />}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
            {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default SustainabilityInPreFab;
