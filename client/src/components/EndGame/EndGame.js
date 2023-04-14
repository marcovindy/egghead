import React from 'react';
import { useHistory, Link } from "react-router-dom";
import { Form, Container, Button, Table } from 'react-bootstrap';
import './EndGame.css';
import ListOfPlayers from '../ListOfPlayers/ListOfPlayers';

const EndGame = ({ players, player }) => {
    let history = useHistory();

    const handleSubmit = e => {
        e.preventDefault();

        fetch('http://localhost:5000/scores/save', {
            method: 'POST',
            body: JSON.stringify({
                username: player.username,
                score: player.score
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'applicaton/json'
            }
        }).then((response) => {
            if (response.status === 200) {
                console.log('Score has been saved');
                history.push('/leaderboard');
            };
        });
    };

    return (
        <Container>
            <div>
                <h2>The game has ended!</h2>
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