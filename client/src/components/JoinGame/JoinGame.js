import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import './JoinGame.css';

import t from "../../i18nProvider/translate";

import Dashboard from '../../pages/Dashboard';

const JoinGame = () => {
    const [roomName, setRoomName] = useState('');
    const [joinRoomName, setJoinRoomName] = useState('');
    const [masterName, setMasterName] = useState('');
    const [playerName, setPlayerName] = useState('');

    

    return (
        <Container>

            <Row className="justify-content-md-center">
                <Col>
                    <h1>{t("Create Game Room")}</h1>
                    <Form>
                        <Form.Control placeholder="Game room name" type="text" onChange={(event) => setRoomName(event.target.value)} />
                        <Form.Control placeholder="Game Master name" type="text" onChange={(event) => setMasterName(event.target.value)} />
                        <Link onClick={event => (!roomName) ? event.preventDefault() : null} to={`/gamemaster?roomName=${roomName}&masterName=${masterName}`}>
                            <Button variant="primary" type="submit">Create game</Button>
                        </Link>
                    </Form>
                </Col>
            </Row>

            <Row className="justify-content-md-center">
                <Col>
                    <h1>{t("Join Game")}</h1>
                    <Form>
                        <Form.Control className="joinInput" placeholder="Game room name" type="text" onChange={(event) => setJoinRoomName(event.target.value)} />
                        <Form.Control placeholder="Player name" type="text" onChange={(event) => setPlayerName(event.target.value)} />
                        <Link onClick={event => (!joinRoomName) ? event.preventDefault() : null} to={`/gameplayer?joinRoomName=${joinRoomName}&playerName=${playerName}`}>
                            <Button variant="primary" type="submit">Join game</Button>
                        </Link>
                    </Form>
                </Col>
            </Row>
            <Dashboard />
        </Container>

    );
};

export default JoinGame;