import  { useState, lazy, Suspense } from "react";
import ImagePath from "../assets/ImagePath";
import { FaWarehouse } from "react-icons/fa";
import { FaHelmetSafety } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { Col, Container, Row, Table } from "reactstrap";
import { comparisonListAbout } from "../Constants";
import NavBar from "../common/NavBar";
import Banner from "../common/Banner";
import SeoHelmet from "../common/SeoHelmet";
import useSeoHelmet from "../hooks/ReactHelmet";
import VideoModal from "../common/VideoModal";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";

// Constants
const BANNER_TITLE = "Company Overview";
const BANNER_DESCRIPTION = "Crafting Engineering Excellence";
const LOADING_TEXT = "Loading...";

// Lazy-loaded components with error handling
const CounterCard = lazy(() =>
  import("../common/CounterCard").catch(() => ({ default: () => <div>Failed to load CounterCard</div> }))
);

const TrustSlider = lazy(() =>
  import("../common/TrustSlider").catch(() => ({ default: () => <div>Failed to load TrustSlider</div> }))
);

const TestimonialCard = lazy(() =>
  import("../common/TestimonialCard").catch(() => ({ default: () => <div>Failed to load TestimonialCard</div> }))
);

const WaveWrapper = lazy(() =>
  import("../common/WaveWrapper").catch(() => ({ default: () => <div>Failed to load WaveWrapper</div> }))
);



// Loading component
const LoadingSpinner = ({ message = LOADING_TEXT }) => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
    <span className="text-gray-600">{message}</span>
  </div>
);

const InfoBox = ({  title, content, items }) => (
  <div className="info-box">
    <div className="info-box-icons" />
    <h6>{title}</h6>
    {content && <p>{content}</p>}
    {items && (
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    )}
  </div>
);

const CompanyOverview = () => {
  const [openVideo, setOpenVideo] = useState(false);
  const handleOpenVideo = () => setOpenVideo(!openVideo);
  const seo = useSeoHelmet("company-overview");

  return (
    <div>
      <SeoHelmet seo={seo} />
      <NavBar />
      <Banner title={BANNER_TITLE} description={BANNER_DESCRIPTION} />

      <section className="we-are-section">
        <Container>
          <Row>
            <Col md={12} lg={6}>
              <div className="we-are-left">
                <h2>Your Trusted and Visionary Partner in Engineering Excellence</h2>
                <p>
                  Prefab buildings empower professional experts with faster deployment, design flexibility, and cost-effective construction solutions.
                </p>
                <p>
                  Welcome to “DIY PreFab”— India’s emerging name in pre-engineered building solutions and modular prefab construction.
                </p>
                <p>From remote villages to fast-paced industrial hubs, our mission is simple:</p>
                <p>Make high-quality prefab structures accessible, fast, and affordable for all.</p>
                <p>
                  Whether you’re setting up a PEB warehouse in Rajasthan, a factory in Madhya Pradesh, or a modular shed in Gujarat, “DIY PreFab” delivers solutions tailored to your space, budget, and timeline.
                </p>
                <div className="we-are-left-content-container">
                  <div className="we-are-left-content-box">
                    <FaHelmetSafety className="performance-icons" />
                    <h4>Professional Expert</h4>
                    <p>
                      Prefab buildings empower professional experts with faster deployment, design flexibility, and cost-effective construction solutions.
                    </p>
                  </div>
                  <div className="we-are-left-content-box">
                    <MdSupportAgent className="performance-icons" />
                    <h4>24/7 Premium Support</h4>
                    <p>
                      Experience uninterrupted service and peace of mind with 24/7 premium support tailored for your prefab building needs.
                    </p>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={12} lg={6}>
              <div className="we-are-right">
                <div className="we-are-back-image-section">
                  <img src={ImagePath.WRB} alt="we-are-back" className="img-fluid" />
                  <div className="we-are-back-right-content-box">
                    <div className="we-are-back-right-content">
                      <h4>7+</h4>
                      <p>Years of Experience</p>
                    </div>
                    <div className="divider"></div>
                    <div className="we-are-back-right-content jcs">
                      <p>Cutting-Edge Expertise</p>
                      <p>Holistic Solutions Approach</p>
                      <p>Client-Centric Collaboration</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="common-section WhoWeAre-about">
        <Container>
          <div className="WhoWeAre-box">
            <h2>Who We Are</h2>
            <p>
              Backed by strong engineering, modern fabrication, and on-ground project execution experience, we specialize in:
            </p>
            <ul>
              <li>Pre Engineered Buildings (PEBs)</li>
              <li>Customizable Prefab Kits for Warehouses, Sheds, & Units</li>
              <li>Modular Buildings for Housing, Offices & Commercial Use</li>
              <li>Eco-Friendly & Low-Carbon Construction Systems</li>
              <li>Projects Across Rural, Urban & International Markets</li>
            </ul>
            <p>
              We proudly operate our in-house manufacturing facility in Banswara, Rajasthan, covering over 10,000+ sqm of area.
            </p>
            <p>
              With active operations in Udaipur, Jaipur, Ahmedabad, Indore, and growing export success in South Africa, DIY PreFab is on a mission to redefine how India builds — faster, smarter, and greener.
            </p>
            <p>
              Each building is designed using pre-engineered steel frames, precision-cut panels, and simplified assembly workflows — ensuring strength, safety, and speed.
            </p>
          </div>
        </Container>
      </section>

      <section className="comparison-section">
        <Container>
          <div className="comparison-container">
            <h2>What Makes Us Different?</h2>
            <div className="comparison-container-box">
              <Table responsive bordered hover>
                <thead className="common-table-thead">
                  <tr>
                    <th>Feature</th>
                    <th>Why It Matters</th>
                    <th>Conventional</th>
                  </tr>
                </thead>
                <tbody className="common-table-tbody">
                  {comparisonListAbout.map((compare, index) => (
                    <tr key={index}>
                      <td>{compare.feature}</td>
                      <td>{compare.prefab}</td>
                      <td>{compare.conventional}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Container>
      </section>

      <section className="information-section">
        <Container>
          <div className="information-container">
            <InfoBox
              icon={FaWarehouse}
              title="Where We Work"
              content="We serve across India with special focus on:"
              items={[
                "Ahmedabad (Gujarat)",
                "Udaipur, Jaipur (Rajasthan)",
                "Indore, Bhopal (Madhya Pradesh)",
                "And recently, South Africa (Export project)"
              ]}
            />
            <InfoBox
              icon={FaWarehouse}
              title="Our Core Offerings"
              items={[
                "Industrial Sheds",
                "Prefab Warehouses",
                "Site Offices & Cabins",
                "Low-Cost Modular Homes",
                "Cold Storage & Agro Sheds",
                "Machine Rooms & Utility Spaces",
                "Roof Replacements for Running Plants"
              ]}
            />
            <InfoBox
              icon={FaWarehouse}
              title="Our Journey So Far"
              content="Whether you need:"
              items={[
                "1000+ Tons of steel fabricated in the first year",
                "4+ Major PEB Projects delivered across India",
                "10–30 Days Avg. Completion Time per project",
                "Export Success to international client in South Africa"
              ]}
            />
            <InfoBox
              icon={FaWarehouse}
              title="Work With Us"
              content="Whether you need:"
              items={[
                "A durable warehouse",
                "A prefab home in the hills",
                "A compact machine room",
                "Or a scalable PEB for industrial growth..."
              ]}
            />
          </div>
        </Container>
      </section>

      <section className="our-vision-mission-section" style={{ backgroundImage: `url(${ImagePath.Bg})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
        <Container>
          <div className="our-vision-video-section">
            <img src={ImagePath.VideoBg} alt="Vision Video" />
            <div className="play-button">
              <div className="play-button-box" onClick={handleOpenVideo}>
                <FaPlay className="play-button-icon" />
              </div>
              <p>Play Intro</p>
            </div>
          </div>
        </Container>
        {openVideo && (

          <Suspense fallback={null}>
            <VideoModal open={openVideo} onClose={handleOpenVideo} />
          </Suspense>
        )}
      </section>

      <Suspense fallback={<LoadingSpinner />}>
        <CounterCard />
        <TrustSlider />
        <TestimonialCard />
        <WaveWrapper />
        <Footer />
      </Suspense>
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default CompanyOverview;
