import React from 'react'
import { FaWarehouse } from 'react-icons/fa'
import { Container } from 'reactstrap'

const Information = React.memo(() => {
  return (
    <section className="information-section">
      <Container>
        <div className="information-container">
          {/* Info boxes loop can be extracted too if needed */}
          <div className="info-box">
            <FaWarehouse className="info-box-icons" />
            <h6>Why It Matters</h6>
            <p>India needs faster, cleaner, and more scalable infrastructure...</p>
            <ul>
              <li>Time-saving prefabricated systems</li>
              <li>Eco-conscious and low-carbon materials</li>
              <li>Minimal labor and zero machinery dependency</li>
              <li>Predictable, affordable costs for every project size</li>
            </ul>
          </div>
          <div className="info-box">
            <FaWarehouse className="info-box-icons" />
            <h6>What Drives Us</h6>
            <ul>
              <li>The passion to empower remote and rural India...</li>
              <li>The mission to eliminate inefficiencies...</li>
            </ul>
          </div>
          <div className="info-box">
            <FaWarehouse className="info-box-icons" />
            <h6>Built for Bharat, Engineered for the World</h6>
            <p>Our mission and vision are rooted in India’s grassroots...</p>
          </div>
          <div className="info-box">
            <FaWarehouse className="info-box-icons" />
            <h6>Let’s Build the Vision Together</h6>
            <p>Whether you're an individual, startup, NGO, or enterprise...</p>
          </div>
        </div>
      </Container>
    </section>
  )
});

export default Information