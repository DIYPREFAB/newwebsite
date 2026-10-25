import React from 'react';
import { Container } from 'reactstrap';

// Use React.memo to memoize the component
const Banner = React.memo(({ title, description }) => {
    return (
        <div className="banner-pattern-wrapper">
            <Container>
                <div className="banner-content">
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
            </Container>
        </div>
    );
});

export default Banner;
