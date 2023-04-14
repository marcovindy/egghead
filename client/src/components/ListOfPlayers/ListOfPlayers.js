import React from 'react';
import { useState, useEffect } from 'react';
import { Form, Container, Button, Table } from 'react-bootstrap';

const ListOfPlayers = ({ playersInRoom }) => {
  return (
    <div className="players-container">
      {playersInRoom.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Player name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {playersInRoom.sort((a, b) => b.score - a.score).map((playerInfo, index) => (
              <tr key={index}>
                <td>{playerInfo.username}</td>
                <td>{playerInfo.score}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No players in the room yet...</p>
      )}
    </div>
  );
};

export default ListOfPlayers;