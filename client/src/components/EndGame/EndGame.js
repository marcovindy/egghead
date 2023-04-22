import React, { useEffect, useState } from 'react';
import { useHistory, Link } from "react-router-dom";
import { Container, Button, Table, Modal, Alert } from 'react-bootstrap';

import './EndGame.css';
import ListOfPlayers from '../ListOfPlayers/ListOfPlayers';

const EndGame = ({ socket, players, playerName, position, rounds, earnings }) => {
    let history = useHistory();

    useEffect(() => {
        console.log('players:', players);
    }, [])

    // Find the player object matching the current playerName
    const currentPlayer = players.find(player => player.username === playerName);

    // Get the player's score
    const playerScore = currentPlayer ? currentPlayer.score : 0;



    const [showModal, setShowModal] = useState(true);

    const handleCloseModal = () => {
        setShowModal(false);
    };
    return (
        <Container>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Congratulations!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="success">
                        You got <strong>{earnings}</strong> experience points!
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <div>You got: {earnings}</div>
            <div>
                <h2>The game has ended!</h2>
                <h3>Your position: {position}</h3>
                <h4>Your score: {playerScore}</h4>
                <div className="score-container">
                    <h3>Game scores</h3>
                    <ListOfPlayers playersInRoom={players} />
                </div>
                <Link to="/customgame"><Button>Leave room</Button></Link>
            </div>
        </Container>
    );
};

export default EndGame;
