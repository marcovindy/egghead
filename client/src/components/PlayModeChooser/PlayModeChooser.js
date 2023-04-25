import React, { useState } from 'react';
import { Row, Col, Button, Modal, Image } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { InfoCircleFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom";

import t from "../../i18nProvider/translate";

import './PlayModeChooser.css';
import '../../assets/styles/Cards/Cards.css';

const PlayModeChooser = () => {
  let history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedModeDescription, setSelectedModeDescription] = useState(null);

  const availableImages = [
    'rankedgame.png',
    'customgame.png',
    'randomgame.png',
  ];

  const getImagePath = (mode) => {
    const imageFilename = `${mode}.png`;
    console.log(imageFilename);
    if (availableImages.includes(imageFilename)) {
      return require(`../../assets/images/gameMode/${imageFilename}`);
    }
    return null;
  };

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
    if (gamemode === 'customgame' || gamemode === 'rankedgame') {
      history.push(`/${gamemode}`);
    } else {
      toast.warning(t('featureInDevelopment'));
    }
  };

  const renderButton = (label, mode) => (
    <>
        <Card>
          <Card.Body className='cursor-pointer' onClick={() => handleButtonClick(mode)}>
            {getImagePath(mode) && (
              <Card.Img variant="top" src={getImagePath(mode)} alt={label} />
            )}
            <Card.Title>{label}</Card.Title>

          </Card.Body>
          <Card.Footer>
          <InfoCircleFill
          size={24}
          className="info-icon"
          onClick={() =>
            handleShowModal(
              label,
              mode === 'rankedgame'
                ? 'Play random quiz and earn XP and coins!'
                : mode === 'customgame'
                  ? 'Play custom quiz from our egghead community.'
                  : 'This mode is not available now.'
            )
          }
        />
          </Card.Footer>
        </Card>
    </>
  );

  return (
    <>
      <Row className='p-0 d-flex play-mode-chooser-row'>
        <Col xs={12} md={12} lg={4} className="mb-4 d-flex card-col">
          {renderButton('Ranked Game', 'rankedgame')}
        </Col>
        <Col xs={12} md={12} lg={4} className="mb-4 d-flex card-col">
          {renderButton('Custom Game', 'customgame')}
        </Col>
        <Col xs={12} md={12} lg={4} className="mb-4 d-flex card-col">
          {renderButton('Random Game', 'randomgame')}
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
