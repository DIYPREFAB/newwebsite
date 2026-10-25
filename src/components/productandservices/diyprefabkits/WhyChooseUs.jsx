import React from 'react'
import { Col, Container, Row } from 'reactstrap'
import { chooseUs } from '../../../Constants'
import ImagePath from '../../../assets/ImagePath'
import { FaPlay } from 'react-icons/fa'

const WhyChooseUs = ({ handleOpenVideo, title, desc }) => {
    return (
        <section className="why-choose-us">
            <Container>
                <Row className="align-items-center">
                    <Col md={6}>
                        <div className="why-choose-left-content-container">
                            <h6>{ "Why Choose Us"}</h6>
                            <h4>
                                {title || "Precision Fabrication for High-Performance Office & Workspace Solutions"}
                            </h4>
                            <p>
                               {desc||" At DIY PreFab, we focus on delivering top-tier prefab buildings that are expertly fabricated for functionality,  speed, and style—enhancing productivity and professionalism."}
                            </p>
                            <hr style={{ borderColor: "#001524", borderWidth: "1px" }} />
                            <div className="choose-us-container">
                                {chooseUs.map((item, index) => (
                                    <div className="why-choose-us-boxes" key={index}>
                                        <div className="box-icon">{item.icon}</div>
                                        <div className="box-content">
                                            <h4>{item.title}</h4>
                                            <p>{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <Row>
                            <Col md={6}>
                                <div className="why-choose-right-content-container">
                                    <img
                                        src={ImagePath.ChooseUsVideo}
                                        alt="Industry-Video"
                                        className="img-fluid"
                                    />
                                    <div className="play-button">
                                        <div
                                            className="play-button-box"
                                            onClick={handleOpenVideo}
                                        >
                                            <FaPlay className="play-button-icon" />
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="why-choose-right-content-container">
                                    <img
                                        src={ImagePath.ChooseUsImg}
                                        alt="Industry-Video"
                                        className="img-fluid"
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default WhyChooseUs