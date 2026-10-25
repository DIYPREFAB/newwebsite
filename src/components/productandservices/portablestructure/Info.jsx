import React from 'react'
import { FaWarehouse } from 'react-icons/fa'
import { Container } from 'reactstrap'

const Info = () => {
  return (
     <section className="information-section">
                <Container>
                    <div className="information-container">
                        <div className="info-box">
                            <FaWarehouse className="info-box-icons" />
                            <h6>Experience & dependability</h6>
                            <p>Prefab buildings offer unmatched experience and dependability, providing reliable, high-quality solutions that stand the test of time and performance.</p>
                        </div>
                        <div className="info-box">
                            <FaWarehouse className="info-box-icons" />
                            <h6>Licensing deals & scalability</h6>
                            <p>Prefab buildings offer unmatched scalability and flexibility, making them ideal for licensing deals that require rapid expansion and efficient, standardized construction solutions.</p>
                        </div>
                        <div className="info-box">
                            <FaWarehouse className="info-box-icons" />
                            <h6>Holistic & custom approach</h6>
                            <p>Prefab buildings provide a holistic and customizable approach, allowing tailored solutions that meet specific needs while ensuring efficiency, sustainability, and quality.</p>
                        </div>
                        <div className="info-box">
                            <FaWarehouse className="info-box-icons" />
                            <h6>Development & fabrication</h6>
                            <p>Prefab buildings play a crucial role in streamlining development and fabrication processes, ensuring faster construction, cost efficiency, and high-quality results.</p>
                        </div>
                    </div>
                </Container>
            </section>
  )
}

export default Info