import React, { useContext, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import PlayerBox from "../../components/PlayerBox/PlayerBox";
import PlayModeChooser from "../../components/PlayModeChooser/PlayModeChooser";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";

import { AuthContext } from "../../helpers/AuthContext";
import useBasicInfo from "../../hooks/useBasicInfo";

import './Play.css';

function Play() {
  const { authState } = useContext(AuthContext);
  const { basicInfo, isLoading } = useBasicInfo(authState.username);

  return (
    <Container className="play-container">
      <Row className="justify-content-center play-row p-3">
        {authState.status === true ? (
          <Col
            xs={12}
            md={12}
            lg={6}
            className="d-flex flex-column justify-content-center align-items-center player-box-col"
          >
            <PlayerBox
              name={basicInfo.username}
              level={basicInfo.level}
              experience={basicInfo.experience}
              avatar={basicInfo.avatar}
            />
          </Col>
        ) : (
          <Col
            xs={12}
            md={12}
            lg={6}
            className="d-flex flex-column justify-content-center align-items-center"
          >
            <div>
              <p>
                You need to <Link to="/login">login</Link> to play all modes.
              </p>
            </div>
          </Col>
        )}
        
      </Row>
      <Row className="p-3">
      <Col xs={12} md={12} lg={12} className="">
          <div className="d-flex flex-column align-items-center">
            <PlayModeChooser />
          </div>
        </Col>
      </Row>
      <LoadingOverlay isLoading={isLoading} />
    </Container>
  );
}

export default Play;
