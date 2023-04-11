import React, { useState } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { InfoCircleFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom";

import t from "../../i18nProvider/translate";

import './PlayModeChooser.css';

const PlayModeChooser = () => {
  let history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedModeDescription, setSelectedModeDescription] = useState(null);

  const handleShowModal = (mode, description) => {
    setSelectedMode(mode);
    setSelectedModeDescription(description);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedModeDescription(null);
    setSelectedMode(null);
  };
  
  const handleButtonClick = (gamemode) => {
    if (gamemode === 'customgame') {
      history.push(`/${gamemode}`);
    } else {
      toast.warning(t('featureInDevelopment'));
    }
  };

  return (
    <>
      <Row className='p-0 d-flex'>
        <Col xs={12} md={12} lg={12} className="mb-4 d-flex w-100">
          <Col lg={11} className="d-flex justify-content-center">  
             <Button className="w-100" block="true" onClick={() => handleButtonClick('rankedgame')}>
              Ranked Game
            </Button>
          </Col>
          <Col lg={1} className="d-flex flex-column align-items-center justify-content-center">
            <InfoCircleFill
              size={20}
              className="info-icon"
              onClick={() =>
                handleShowModal(
                  'Ranked Game',
                  'Play random quiz and earn XP and coins!'
                )
              }
            />
          </Col>
        </Col>
        <Col xs={12} md={12} lg={12} className="mb-4 d-flex w-100">
          <Col lg={11} className="d-flex justify-content-center">
             <Button className="w-100" block="true" onClick={() => handleButtonClick('customgame')}>
              Custom Game
            </Button>
          </Col>
          <Col lg={1} className="d-flex flex-column align-items-center justify-content-center">
            <InfoCircleFill
              size={20}
              className="info-icon"
              onClick={() =>
                handleShowModal(
                  'Custom Game',
                  'Play custom quiz from our egghead community.'
                )
              }
            />
          </Col>
        </Col>
        <Col xs={12} md={12} lg={12} className="mb-4 d-flex w-100">
          <Col lg={11} className="d-flex justify-content-center">
             <Button className="w-100" block="true" onClick={() => handleButtonClick('randomgame')}>
              Random Game with Friends
            </Button>
          </Col>
          <Col lg={1} className="flex-column align-items-center justify-content-center">
            <InfoCircleFill
              size={20}
              className="info-icon"
              onClick={() =>
                handleShowModal(
                  'Random Game with Friends',
                  'Play random game with your friends random quiz and compete.'
                )
              }
            />
          </Col>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedMode}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedModeDescription}</p>
        </Modal.Body>
      </Modal>
      </>
  );
};

export default PlayModeChooser;
