import React, { useState, useEffect} from 'react';
import { Container, Table } from 'react-bootstrap';
import t from "../../i18nProvider/translate";

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
                <h1>{t('Leaderboard')}</h1>
                <h3>Top 20</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>{t('Player name')}</th>
                            <th>{t('Score')}</th>
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
            </div>
        </Container>
    );
};

export default Leaderboard;