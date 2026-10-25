import React, { useEffect, useRef } from "react";
import SeoHelmet from "../common/SeoHelmet";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import Banner from "../common/Banner";
import { Container } from "reactstrap";
import { weDoMore } from "../Constants";
import { Link } from "react-router-dom";

const CardDetails = () => {
  const bannerRef = useRef(null);

  useEffect(() => {
    // Smooth scroll to the banner section
    if (bannerRef.current) {
      bannerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="dashboard-box">
      <div ref={bannerRef}>
        <Banner
          title="Engineering Excellence, Industrial Solutions"
        />
      </div>

      <NavBar />

      <section className="common-section">
        <Container>
          <div className="we-do">
            {weDoMore.map(({ icon, title, desc, subTitle, ctaBtn, linkTo }, i) => (
              <div
                className="we-do mb-5"
                style={{
                  border: "1px solid #d9d9d9",
                  padding: "20px",
                  boxShadow: "0px 0px 10px -4px rgba(0, 0, 0, 0.5)",
                  borderRadius: "6px",
                }}
                key={i}
              >
                {icon}
                <hr />
                <h3>
                  {i + 1}. {title}
                </h3>
                <h5>{subTitle}</h5>
                <p>{desc}</p>
                <Link to={linkTo} className="common-btn">{ctaBtn}</Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default CardDetails;
