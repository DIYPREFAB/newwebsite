import React, { useState } from 'react';
import { Accordion, AccordionItem, AccordionHeader, AccordionBody } from 'reactstrap';

const FAQComponent = ({ faqs = [], title = "Frequently Asked Questions" }) => {
  const [open, setOpen] = useState('0');

  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div className="faq-component">
      <h3 className="faq-title mb-4">{title}</h3>
      <Accordion open={open} toggle={toggle}>
        {faqs.map((faq, index) => (
          <AccordionItem key={index}>
            <AccordionHeader targetId={index.toString()}>
              <strong>{faq.question}</strong>
            </AccordionHeader>
            <AccordionBody accordionId={index.toString()}>
              <div className="faq-answer">
                {faq.answer}
              </div>
            </AccordionBody>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQComponent;
