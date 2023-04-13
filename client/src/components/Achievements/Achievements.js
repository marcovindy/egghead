import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Trophy } from 'react-bootstrap-icons';

const AchievementCard = ({ title, description }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Row className="align-items-center">
          <Col xs={2}>
            <Trophy size={36} />
          </Col>
          <Col>
            <Card.Title>{title}</Card.Title>
            <Card.Text>{description}</Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

const Achievements = () => {
  const achievements = [
    {
      title: 'First Achievement',
      description: 'You have unlocked your first achievement!',
    },
    {
      title: 'Second Achievement',
      description: 'You have unlocked your second achievement!',
    },
    {
      title: 'Third Achievement',
      description: 'You have unlocked your third achievement!',
    },
  ];

  return (
    <div>
      <h2>Achievements</h2>
      {achievements.map((achievement) => (
        <AchievementCard
          key={achievement.title}
          title={achievement.title}
          description={achievement.description}
        />
      ))}
    </div>
  );
};

export default Achievements;
