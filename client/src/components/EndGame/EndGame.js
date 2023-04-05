import React from 'react';
import { useHistory, Link  } from "react-router-dom";
import { Form, Container, Button, Table } from 'react-bootstrap';
import './EndGame.css';

const EndGame = ({ players, player }) => {
    let history = useHistory ();

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
            if(response.status === 200) {
                console.log('Score has been saved');
                history.push('/leaderboard');
            };
        });
    };

    return(
        <Container>
            <div>
                <h2>The game has ended!</h2>
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

                {/* <div className="save-score-container">
                    <h3>Save score to leaderboard</h3>
                    <Form onSubmit={handleSubmit} method="POST">
                        <input disabled={true} readOnly defaultValue={player.username} className="form-control"/>
                        <input disabled={true} readOnly defaultValue={player.score} className="form-control"/>
                        <Button variant="primary" type="submit">Save score</Button>
                    </Form>
                </div> */}
                <p>Don't leave, if you want to play again!</p>
                <Link to="/customgame">Leave room</Link>
            </div>
        </Container>
    );
};

export default EndGame;