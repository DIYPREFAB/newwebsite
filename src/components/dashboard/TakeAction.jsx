import React from 'react'
import { Button, Container } from 'reactstrap'
import ImagePath from '../../assets/ImagePath'
import { Link } from 'react-router-dom'
import ROUTE_PATHS from '../../routes/RoutePath'

const TakeAction = ({  }) => {
  return (
     <section className="take-action">
        <img src={ImagePath.TakeAction} alt="Take Action" className="img-fluid" />
        <Container>
          <div className="take-action-container">
            <div className="take-action-box">
              <h3>
                Empower Your Future with Industrial Excellence, Seize the Opportunity to Engineer Innovation
              </h3>
              <p>
                We assist with structural planning, smart material choices, and seamless integration of building systems.
              </p>
              <Link to={ROUTE_PATHS.INQUIRY_FORM} 
                className="btn common-btn"
              >
                TAKE ACTION NOW
              </Link>
            </div>
          </div>
        </Container>
      </section>
  )
}

export default TakeAction