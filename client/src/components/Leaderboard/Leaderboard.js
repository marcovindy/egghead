import React, { useState, useEffect} from 'react';
import { Container, Table } from 'react-bootstrap';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/scores/' , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'applicaton/json'
            }
        })
        .then(response => response.json())
        .then( (scores) => {
            setLeaderboard(scores);
        });
    }, []);
    
    return (
        <Container>
            <div className="wrapper">
                <h1>Leaderboard</h1>
                <h3>Top 20</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Player name</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((score, index) => 
                            <tr className="leaderboard-container" key={index}>
                                <td>{score.username}</td>
                                <td>{score.score}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <a href="/">Join a new game</a>
            </div>
        </Container>
    );
};

export default Leaderboard;