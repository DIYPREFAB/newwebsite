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
                            <h2 className="faq-head">LGSF FAQs – Know Before You Build</h2>
                            <Accordion open={open} toggle={toggle}>
                                <AccordionItem>
                                    <AccordionHeader targetId="1">
                                        What is LGSF construction?
                                    </AccordionHeader>
                                    <AccordionBody accordionId="1">
                                        <p>It’s a dry-tech construction system using cold-formed steel sections to build modular, lightweight, yet strong buildings.</p>
                                    </AccordionBody>
                                </AccordionItem>
                                <AccordionItem>
                                    <AccordionHeader targetId="2">
                                        How long does it take to build an LGSF home?
                                    </AccordionHeader>
                                    <AccordionBody accordionId="2">
                                        <p>Most structures can be assembled within 15–30 days depending on size.</p>
                                    </AccordionBody>
                                </AccordionItem>
                                <AccordionItem>
                                    <AccordionHeader targetId="3">
                                        Is it safe for earthquakes or high-rise add-ons?
                                    </AccordionHeader>
                                    <AccordionBody accordionId="3">
                                        <p>Yes — LGSF performs exceptionally well in seismic zones and on rooftops.</p>
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