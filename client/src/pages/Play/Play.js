import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../helpers/AuthContext";
import PlayModeChooser from "../../components/PlayModeChooser/PlayModeChooser";
import PlayerBox from "../../components/PlayerBox/PlayerBox";
import { Container, Row, Col, Button } from 'react-bootstrap';

function Play() {
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    console.log("Player is in Play page.");
    console.log("authState Username: ", authState.username);
  }, []);

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Row>
        <Col xs={12} md={12} lg={6} className="d-flex flex-column justify-content-center align-items-center">
          <PlayerBox
            name={authState.username}
            level={authState.userLevel}
            avatar={authState.avatar}
            experience={authState.userExperience}
          />
        </Col>
        <Col xs={12} md={12} lg={6} className="">
          <div className="d-flex flex-column align-items-center">
            <PlayModeChooser />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Play;
