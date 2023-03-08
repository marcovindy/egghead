import React from 'react';
import { useHistory  } from "react-router-dom";
import { Form, Container, Button, Table } from 'react-bootstrap';
import './PlayerBoard.css';

const PlayerBoard = ({ players, player }) => {
  
    return(
        <Container>
            <div>
                <div className="score-container">
                <h3>Game scores</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Player name</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player, index) =>
                                <tr key={index}>
                                    <td>{player.username}</td>
                                    <td>{player.score}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>

             
                <p>Don't leave, if you want to play again!</p>
                <a href="/">Leave room</a>
            </div>
        </Container>
    );
};

export default PlayerBoard;