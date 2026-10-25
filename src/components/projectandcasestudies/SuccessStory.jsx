import React from "react";
import { Col, Row } from "reactstrap";
import { successStories } from "../../Constants";

// Social icons were placeholders with no destination (they resolved to the current page). They are now only rendered
// when a team member has a real profile URL in Constants.successStories (story.linkedin).
const SuccessStory = () => (
  <Row>
    {successStories.map((story, index) => (
      <Col md={6} lg={3} key={index}>
        <div className="sucess-box">
          <div className="sucess-img">
            <img src={story.image} alt={`${story.name}, ${story.role}`} />
          </div>
          <div className="sucess-stories-lower">
            <h3>{story.name}</h3>
            <p>{story.role}</p>
            {story.linkedin && (
              <ul>
                <li>
                  <a href={story.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${story.name} on LinkedIn`}>in</a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </Col>
    ))}
  </Row>
);

export default SuccessStory;
