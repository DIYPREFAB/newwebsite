import React from 'react'
import { Button, Container } from 'reactstrap'
import { weDo } from '../../Constants'
import { useNavigate } from 'react-router-dom'
import ROUTE_PATHS from '../../routes/RoutePath'

const WeDo = ({ handleComingSoon }) => {
  const navigate=useNavigate()
  return (
      <section className="we-do-section">
        <Container>
          <div className="we-do-container">
            {weDo.map(({ icon, title, desc }, i) => (
              <div className="we-do-box" key={i}>
                {icon}
                <hr />
                <h3>{title}</h3>
                <p>{desc}</p>
                <Button 
                  className="common-btn"
                  onClick={() =>navigate(ROUTE_PATHS.CARD_DETAILS)}
                >
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </Container>
      </section>
  )
}

export default WeDo