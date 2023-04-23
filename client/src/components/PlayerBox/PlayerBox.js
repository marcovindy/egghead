import React from "react";
import { Card, Button, ProgressBar, Col, Image, Row } from "react-bootstrap";
import { Progress } from 'rsuite';
import { useHistory } from "react-router-dom";
import './PlayerBox.css';
import Achievements from '../Achievements/Achievements';
import Badge from '../Badge/Badge';

const PlayerBox = ({ name, level, avatar, experience }) => {
  const history = useHistory();
  
  const maxExperience = ((100 * level) / 2);
  const experiencePercentage = (experience / maxExperience) * 100;

  const handleClick = () => {
    console.log(maxExperience, experiencePercentage);
    history.push(`/profile/${name}`);
  };


  return (
    <div className="w-100 mb-4 player-box">
      <div className="player-box-avatar justify-content-between">
        <div className="player-box-avatar-x position-relative">
          <div className="player-box-avatar-content">
            {avatar && <Image src={require(`../../assets/images/userAvatars/${avatar}`)} alt={avatar} width='100px' />}
          </div>
          <Progress.Circle
            style={{ width: '105px', height: '100px', top: '5%', zIndex: '1' }}
            percent={experiencePercentage}
            strokeColor="#3FC7FA"
            strokeWidth={6}
            trailColor="#D9D9D9"
            className="position-absolute"
            showInfo={false}
          />
          <Badge level={level}/>
        </div>
        <div >
          <h3 className="mb-0 mt-1">{name}</h3>
        </div>
        <div >
          <Button variant="primary" onClick={handleClick}>Profile</Button>
        </div>
      </div>
      <Achievements preview={true} />
    </div>
  );
};

export default PlayerBox;
