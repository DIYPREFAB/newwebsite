import React, { Suspense, useEffect, useRef } from "react";
import SeoHelmet from "../common/SeoHelmet";
import Banner from "../common/Banner";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import { Container } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import ROUTE_PATHS from "../routes/RoutePath";
import { weOfferList } from "../Constants";

const WeOfferCardDetails = () => {
  const { name } = useParams();
  const bannerRef = useRef(null);

  useEffect(() => {
    if (bannerRef.current) {
      bannerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const currentOffer = weOfferList.find((item) => item.slug === name);

  const LoadingSpinner = ({ message = "Loading..." }) => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
      <span className="text-gray-600">{message}</span>
    </div>
  );

  return (
    <div>
      {/* <SeoHelmet seo={seo} /> */}

      <div ref={bannerRef}>
        <NavBar />
      </div>

      <Banner
        title={currentOffer ? currentOffer.title : "Service Not Found"}
      />

      <section className="common-section empower-page">
        <Container>
          {currentOffer ? (
            <div>
              {/* <div className="we-offer-icon mb-4">{currentOffer.icon}</div> */}
              <h1>{currentOffer.title}</h1>
              <p>{currentOffer.description}</p>
              <p>
                We’re here to scale with your ambition — from small warehouse
                expansions to multi-acre industrial campuses. Let’s build
                smarter, faster, and more sustainably.
              </p>
              <p>
                <span>Our promise:</span> - Aligned project strategy - Long-term
                support - Transparent communication
              </p>
              <Link to={ROUTE_PATHS.ABOUT_US} className="common-btn">
                Start your industrial journey today.
              </Link>
            </div>
          ) : (
            <p className="text-center text-red-600">
              Service not found. Please check the URL.
            </p>
          )}
        </Container>
      </section>

      <Suspense fallback={<LoadingSpinner message="Loading footer..." />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default WeOfferCardDetails;

