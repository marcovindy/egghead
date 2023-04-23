import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Sizer } from 'rsuite';
import { CSSTransition } from 'react-transition-group';
import { TrophyFill } from 'react-bootstrap-icons';

import './Podium.css';

const Podium = ({ winners }) => {
  const podium = winners.slice(0, 3).sort((a, b) => b.score - a.score);
  const podiumHeights = [75, 100, 50];

  return (
    <div className="podium">
      <Row className="justify-content-center">
        {podium.map((winner, index) => (
          <Col key={index} className={`position-${index + 1}`} xs="auto">
            <CSSTransition in timeout={1000} classNames="podium-animate" appear>
              <div
                className="podium-step"
                style={{
                  height: `${podiumHeights[index]}%`,
                }}
              >
                <TrophyFill className="trophy-icon" />
                <div className="winner-name">{winner.username}</div>
              </div>
            </CSSTransition>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Podium;