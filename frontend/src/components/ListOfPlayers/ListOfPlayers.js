import React from 'react';
import { useState, useEffect } from 'react';
import { Form, Container, Button, Table } from 'react-bootstrap';

const ListOfPlayers = ({ players, player }) => {
  return (
    <div className="players-list">
      <h3>Players in room: {players.length}</h3>
      <ul>
        {players.map((playerInfo, index) => (
          <li key={index}>
            {playerInfo.name}: {playerInfo.score}
            {player.id === playerInfo.id && <span> (you)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListOfPlayers;