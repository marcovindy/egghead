import React, { useContext, useEffect } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";

import PlayModeChooser from "../../components/PlayModeChooser/PlayModeChooser";
import PlayerBox from "../../components/PlayerBox/PlayerBox";

import { AuthContext } from "../../helpers/AuthContext";


function Play() {
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    console.log("Player is in Play page.");
    console.log("authState Username: ", authState.username);
    console.log("authState status: ", authState.status);
  }, []);

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Row>
        {authState.status === true ? (
          <Col xs={12} md={12} lg={6} className="d-flex flex-column justify-content-center align-items-center">
            <PlayerBox
              name={authState.username}
              level={authState.userLevel}
              avatar={authState.avatar}
              experience={authState.userExperience}
            />
          </Col>
        ) : (
          <Col xs={12} md={12} lg={6} className="d-flex flex-column justify-content-center align-items-center">
            <div>
              <p>You need to <Link to="/login">login</Link> to play all modes.</p>
            </div>
          </Col>
        )}
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
