import React from 'react';
import Slider from 'react-slick';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';

const testimonials = [
  {
    id: 1,
    name: "Jane Doe",
    message: `“DIY PreFab’s innovative approach to automation transformed our warehouse logistics. The robotics integration project streamlined our operations, reducing errors and enhancing overall productivity. Their commitment to pushing the boundaries of industrial technology is commendable.”`,
    role: "Product Manager, TechCorp",
  },
  {
    id: 2,
    name: "John Smith",
    message: `“DIY PreFab’s innovative approach to automation transformed our warehouse logistics. The robotics integration project streamlined our operations, reducing errors and enhancing overall productivity. Their commitment to pushing the boundaries of industrial technology is commendable.”`,
    role: "CTO, Startify",
  },
  {
    id: 3,
    name: "Sara Lee",
    message: `“DIY PreFab’s innovative approach to automation transformed our warehouse logistics. The robotics integration project streamlined our operations, reducing errors and enhancing overall productivity. Their commitment to pushing the boundaries of industrial technology is commendable.”`,
    role: "Designer, Creative Hub",
  },
];

const sliderSettings = {
  dots: false,
  arrows: false,
  infinite: true,
  speed: 600,
  autoplay: true,
  autoplaySpeed: 3000,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  rtl: true,
};

const TestimonialCard = React.memo(() => {
  return (
    <section className="testimonial-section">
      <Container>
        <Row>
          <Col md={4}>
            <div className="left-testimony-box">
              <h6>Testimonial</h6>
              <h3>Trusted Voices, Real Experiences</h3>
              <p>
                Our clients consistently praise the quality, reliability, and innovation of our prefab building solutions—highlighting our commitment to excellence and personalized service.
              </p>
            </div>
          </Col>
          <Col md={8}>
            <div className="right-testimony-box">
              <Container>
                <Slider {...sliderSettings}>
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id}>
                      <Card className="mx-2 my-3 border-0">
                        <CardBody>
                          <p className="mb-3 fst-italic text-muted testimonial-message">
                            {testimonial.message}
                          </p>
                          <h5 className="mb-1">{testimonial.name}</h5>
                          <small className="text-secondary">{testimonial.role}</small>
                        </CardBody>
                      </Card>
                    </div>
                  ))}
                </Slider>
              </Container>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
});

export default TestimonialCard;
