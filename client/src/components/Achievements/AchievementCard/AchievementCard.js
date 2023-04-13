import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { Trophy } from 'react-bootstrap-icons';
import './AchievementCard.css';

const AchievementCard = ({ title, description, unlocked }) => {
  return (
    <Card className={`mb-3 achievement-card ${unlocked ? 'unlocked' : ''}`}>
      <Card.Body>
        <Row className="align-items-center padding-mobile-1 mobile-column">
          <Col xs={12} sm={12} md={1}>
            <Trophy size={36} />
          </Col>
          <Col xs={12} sm={12} md={8}>
            <Card.Title>{title}</Card.Title>
            <Card.Text>{description}</Card.Text>
          </Col>
          <Col xs={12} sm={12} md={3} className="text-right">
            {unlocked ? (
              <Button variant="success">Claim Reward</Button>
            ) : (
              <Button disabled variant="primary">Locked</Button>
            )}
          </Col>

        </Row>
      </Card.Body>
    </Card>
  );
};

export default AchievementCard;
