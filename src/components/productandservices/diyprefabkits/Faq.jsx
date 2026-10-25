import React, { useState } from 'react'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Col, Container, Row } from 'reactstrap'

const Faq = () => {
    const [open, setOpen] = useState("1");
    const toggle = (id) => setOpen(open === id ? undefined : id);

    return (
        <section className="common-section faq-section">
            <Container>
                <Row>
                    <Col className="m-auto" md={10}>
                        <h2 className="faq-head">FAQ – Everything You Need to Know</h2>
                        <Accordion open={open} toggle={toggle}>
                            <AccordionItem>
                                <AccordionHeader targetId="1">
                                    What are prefabricated structures made of?
                                </AccordionHeader>
                                <AccordionBody accordionId="1">
                                    <p>
                                        We use a combination of light-gauge steel, insulated
                                        sandwich panels, and smart joinery for strength and
                                        thermal performance.
                                    </p>
                                </AccordionBody>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionHeader targetId="2">
                                    How long does installation take?
                                </AccordionHeader>
                                <AccordionBody accordionId="2">
                                    <p>
                                        Depending on size, 1–3 days for small units, up to 10–15
                                        days for multi-room facilities.
                                    </p>
                                </AccordionBody>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionHeader targetId="3">
                                    Are your prefabs movable?
                                </AccordionHeader>
                                <AccordionBody accordionId="3">
                                    <p>
                                        Yes! We offer fully relocatable prefab cabins and
                                        semi-permanent buildings as well.
                                    </p>
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