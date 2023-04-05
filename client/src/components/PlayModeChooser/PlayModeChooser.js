import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const GameModeSelection = () => {
  return (
      <div className="justify-content-center align-items-center flex-column">
        <Col xs={12} md={12} lg={12} className="mb-4">
          <Button className='w-100'  block>Ranked Game</Button>
        </Col>
        <Col xs={12} md={12} lg={12} className="mb-4">
          <Button className='w-100' block>Custom Game</Button>
        </Col>
        <Col xs={12} md={12} lg={12} className="mb-4">
          <Button className='w-100'  block>Random Game with Friends</Button>
        </Col>
      </div>
  );
};

export default GameModeSelection;
