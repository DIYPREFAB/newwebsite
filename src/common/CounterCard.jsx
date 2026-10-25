import React from 'react';
import { Container } from 'reactstrap';
import Counter from './Counter';

const CounterCard = React.memo(() => {
  return (
    <section className="counter-section">
      <Container>
        <div className="counter-section-container">
          <Counter end={96} duration={1200} label="Cases Solved" />
          <Counter end={20} duration={1700} label="Project Done" showPercent={false} />
          <Counter end={100} duration={2200} label="Happy Client" />
          <Counter end={100} duration={2500} label="Timeline Delivery" />
        </div>
      </Container>
    </section>
  );
});

export default CounterCard;
