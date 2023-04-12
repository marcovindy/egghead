import React from "react";
import { Card, Button, ProgressBar, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import './PlayerBox.css';

const PlayerBox = ({ name, level, avatar, experience }) => {
  const history = useHistory();
  const handleClick = () => {
    history.push(`/profile/${name}`); // replace `name` with the appropriate id value
  };

  return (
    <div className="w-100 mb-4 player-box">
      <div className="d-flex align-items-center justify-content-between player-box-info mb-3">
        <Col lg={4} xs={12} className="p-1">
          <img src={avatar} alt="avatar" />
        </Col>
        <Col lg={4} xs={12} className="p-1">
          <h3 className="mb-0">{name}</h3>
        </Col>
        <Col lg={4} xs={12} className="p-1">
          <Button variant="primary" onClick={handleClick}>Profile</Button>
        </Col>

      </div>
      <div className="p-0 player-box-exp">
        <div className="d-flex justify-content-center">
          <div className="text-muted">Level {level}</div>
          <div className="text-muted ml-1">Experience: {experience}</div>
        </div>
        <ProgressBar now={experience} max={100} />
      </div>
    </div>
  );
};

export default PlayerBox;
