import React from 'react'
import { FaHelmetSafety } from 'react-icons/fa6'
import { MdSupportAgent } from 'react-icons/md'
import { Col, Container, Row } from 'reactstrap'
import ImagePath from '../../assets/ImagePath'

const MainSection = React.memo(() => {
  return (
    <section className="we-are-section">
      <Container>
        <Row>
          <Col md={12} lg={6}>
            <div className="we-are-left">
              <h2>Redefining the Future of Prefab & Pre Engineered Buildings in India</h2>
              <p>
                At “DIY PreFab”, we don’t just manufacture buildings — we build possibilities...
              </p>
              <div className="we-are-left-content-container">
                <div className="we-are-left-content-box">
                  <FaHelmetSafety className="performance-icons" />
                  <h4>Professional Expert</h4>
                  <p>Prefab buildings empower professional experts with faster deployment...</p>
                </div>
                <div className="we-are-left-content-box">
                  <MdSupportAgent className="performance-icons" />
                  <h4>24/7 Premium Support</h4>
                  <p>Experience uninterrupted service and peace of mind...</p>
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
  )
});


export default MainSection