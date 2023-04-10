import React from "react";
import { Card, Button, ProgressBar } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const PlayerBox = ({ name, level, avatar, experience }) => {
  const history = useHistory();
  let maxExpProgress = level * experience;

  const handleClick = () => {
    history.push(`/profile/${name}`); // replace `name` with the appropriate id value
  };

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
          <Button variant="primary" onClick={handleClick}>Profile</Button>
        </div>
      </Card.Body>
      <Card.Footer className="p-0">
        <small className="text-muted">Experience: {experience}</small>
        <ProgressBar now={experience} max={maxExpProgress} label={`${experience}%`} />
      </Card.Footer>
    </Card>
  );
};

export default PlayerBox;
