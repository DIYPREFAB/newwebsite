import React from 'react'
import { FiSettings } from 'react-icons/fi'
import { Col, Container, Progress, Row } from 'reactstrap'
import ImagePath from '../../../assets/ImagePath'

const OurServices = ({ title, }) => {
    return (
        <section className="common-section our-service-wrap">
            <Container>
                <Row>
                    <Col md={12} lg={6}>
                        <div className="our-service-left">
                            <div className="our-service-img">
                                <img src={ImagePath.ourService} alt="Our Service" />
                            </div>
                            <div className="our-service-performance">
                                <FiSettings className="service-icon" />
                                <div className="performance-box">
                                    <h5>{ "Precision Performance"}</h5>
                                    <p>
                                        { "Machina excels in delivering precise and efficient performance"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={12} lg={6}>
                        <div className="our-service-right">
                            <h6>Our Service</h6>
                            <h2>{title ||"Smart, Ready-to-Assemble Prefab Kits for Every Need"}</h2>
                            <p>
                                At “DIY PreFab”, we’re redefining construction with
                                easy-to-install, flat-pack prefab kits designed for speed,
                                simplicity, and sustainability. Our DIY kits empower anyone to
                                build durable, efficient structures without the complexity of
                                traditional methods.
                            </p>
                            <p>
                                Whether it’s for site offices, emergency shelters,
                                classrooms, clinics, or storage units, each kit is crafted
                                with low-carbon materials, smart design, and hassle-free
                                setup—perfect for fast-paced, budget-friendly, and flexible
                                applications across India.
                            </p>
                            <div className="progress-section">
                                <div className="progress-item">
                                    <div className="label">
                                        <span>Customer Satisfaction</span>
                                        <span className="percent">97%</span>
                                    </div>
                                    <Progress value={97} className="custom-progress" />
                                </div>
                                <div className="progress-item">
                                    <div className="label">
                                        <span>Utilization Works</span>
                                        <span className="percent">84%</span>
                                    </div>
                                    <Progress value={84} className="custom-progress" />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default OurServices