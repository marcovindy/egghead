import React, { useContext, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import PlayerBox from "../../components/PlayerBox/PlayerBox";
import PlayModeChooser from "../../components/PlayModeChooser/PlayModeChooser";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";

import { AuthContext } from "../../helpers/AuthContext";
import useBasicInfo from "../../hooks/useBasicInfo";

function Play() {
  const { authState } = useContext(AuthContext);
  const { basicInfo, isLoading } = useBasicInfo(authState.username);

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Row>
        {authState.status === true ? (
          <Col
            xs={12}
            md={12}
            lg={6}
            className="d-flex flex-column justify-content-center align-items-center"
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
        <Col xs={12} md={12} lg={6} className="">
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
