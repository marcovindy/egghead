import React from "react";
import { Card, Button } from "react-bootstrap";

const PlayerBox = ({ name, level, avatar, experience }) => {
  return (
    <Card className="w-100 mb-4">
      <Card.Body className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <div className="mr-3">
            <img src={avatar} alt="avatar" className="rounded-circle" />
          </div>
          <div>
            <Card.Title className="mb-0">{name}</Card.Title>
            <Card.Subtitle className="text-muted">Level {level}</Card.Subtitle>
          </div>
        </div>
        <div>
          <Button variant="primary">Profile</Button>
        </div>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">Experience: {experience}</small>
      </Card.Footer>
    </Card>
  );
};

export default PlayerBox;
