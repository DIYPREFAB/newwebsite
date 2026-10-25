import React, { useState } from 'react'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Col, Container, Row } from 'reactstrap'

const Faq = () => {
    const [open, setOpen] = useState("1");
    const toggle = (id) => setOpen(open === id ? undefined : id);

    return (
        <section className="common-section faq-section">
            <Container>
                <Row className="">
                    <Col className="m-auto" md={10}>
                        <h2 className="faq-head">Frequently Asked Questions (FAQs)</h2>
                        <Accordion open={open} toggle={toggle}>
                            <AccordionItem>
                                <AccordionHeader targetId="1">
                                    What is a sandwich panel used for?
                                </AccordionHeader>
                                <AccordionBody accordionId="1">
                                    <p>It's used for walling, roofing, partitions, and cladding in steel or prefab buildings — providing insulation and structural integrity.</p>
                                </AccordionBody>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionHeader targetId="2">
                                    What’s the difference between PUF, EPS, and Rockwool?
                                </AccordionHeader>
                                <AccordionBody accordionId="2">
                                    <ul>
                                        <li><strong>PUF:</strong> High thermal insulation, all-weather</li>
                                        <li><strong>EPS:</strong> Lightweight, budget-friendly</li>
                                        <li><strong>Rockwool:</strong> Best for fire & sound resistance</li>
                                    </ul>
                                </AccordionBody>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionHeader targetId="3">
                                    Are sandwich panels waterproof?
                                </AccordionHeader>
                                <AccordionBody accordionId="3">
                                    <p>Yes, with sealed joints and water-resistant coatings, they prevent leaks and moisture ingress.</p>
                                </AccordionBody>
                            </AccordionItem>
                        </Accordion>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default Faq