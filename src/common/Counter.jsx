import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const Counter = React.memo(({ end = 100, duration = 2000, label = "Label", showPercent = true }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (inView && !hasAnimated) {
      let current = 0;
      const stepTime = Math.floor(duration / end);

      const timer = setInterval(() => {
        current += 1;
        setCount(current);
        if (current >= end) {
          clearInterval(timer);
          setHasAnimated(true);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [inView, end, duration, hasAnimated]);

  const formattedValue = showPercent ? `${count}%` : count.toString();

  return (
    <div ref={ref} className="counter-box text-center">
      <h4>{formattedValue}</h4>
      <p>{label}</p>
    </div>
  );
});

export default Counter;
