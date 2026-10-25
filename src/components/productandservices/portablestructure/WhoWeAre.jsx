import React from 'react'
import ImagePath from '../../../assets/ImagePath'
import { Col, Container, Row } from 'reactstrap'
import { FaHelmetSafety } from 'react-icons/fa6'
import { MdSupportAgent } from 'react-icons/md'

const WhoWeAre = () => {
    return (
        <section className="we-are-section">
            <Container>
                <Row>
                    <Col md={12} lg={6}>
                        <div className="we-are-left">
                            <h6>Who We Are</h6>
                            <h2>
                                Your Trusted Partner for Efficient Site Office Solutions
                            </h2>
                            <p>
                                At “DIY PreFab”, we specialize in creating high-quality, modular site offices that are quick to assemble, cost-effective, and fully functional. With a focus on sustainability, we use eco-friendly materials and energy-efficient designs to ensure minimal environmental impact.
                            </p>
                            <p>
                                Our extensive experience in large-scale prefab construction allows us to provide fast, reliable site office solutions without compromising on quality. We offer free design consultations, accurate cost estimates, and a quality verification check to ensure your project meets the highest standards.
                            </p>
                            <p>
                                With our advanced 3D Smart Building Planner, we empower clients to visualize, customize, and optimize their site office designs, making the planning process seamless and cost-effective.
                            </p>
                            <div className="we-are-left-content-container">
                                <div className="we-are-left-content-box">
                                    <FaHelmetSafety className="performance-icons" />
                                    <h4>Professional Expert</h4>
                                    <p>
                                        Prefab buildings empower professional experts with faster
                                        deployment, design flexibility, and cost-effective
                                        construction solutions.
                                    </p>
                                </div>
                                <div className="we-are-left-content-box">
                                    <MdSupportAgent className="performance-icons" />
                                    <h4>24/7 Premium Support</h4>
                                    <p>
                                        Experience uninterrupted service and peace of mind with
                                        24/7 premium support tailored for your prefab building
                                        needs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={12} lg={6}>
                        <div className="we-are-right">
                            <div className="we-are-back-image-section">
                                <img
                                    src={ImagePath.WRB}
                                    alt="we-are-back"
                                    className="img-fluid"
                                ></img>
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
        </section>)
}

export default WhoWeAre