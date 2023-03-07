import React from 'react';
import { useState, useEffect } from 'react';
import { Form, Container, Button, Table } from 'react-bootstrap';

const ListOfPlayers = (players, player) => {



    return (
        <Container>
            <div className="wrapper">
                <h1>HRacu</h1>
                <h3>xxx</h3>
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
        </Container>
    );
};

export default ListOfPlayers;