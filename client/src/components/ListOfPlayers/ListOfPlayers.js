import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';

import Badge from '../Badge/Badge';
import { TrophyFill } from 'react-bootstrap-icons';
import t from "../../i18nProvider/translate";


const ListOfPlayers = ({ playersInRoom }) => {

  const [playerLevels, setPlayerLevels] = useState({});
  const IS_PROD = process.env.NODE_ENV === "production";
  const API_URL = IS_PROD ? "https://testing-egg.herokuapp.com" : "http://localhost:5000";

  const fetchPlayerLevels = async () => {
    const fetchedLevels = {};
    for (const player of playersInRoom) {
      const res = await axios.get(`${API_URL}/auth/user/byusername/${player.username}`);
      if (res && res.data && res.data.level) {
        fetchedLevels[player.username] = res.data.level;
      } else {
        fetchedLevels[player.username] = 0;
      }
    }
    setPlayerLevels(fetchedLevels);
  };

  useEffect(() => {
    fetchPlayerLevels();
  }, [playersInRoom]);

  return (
    <div className="players-container">
      {playersInRoom.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>{t('Position')}</th>
              <th>LVL</th>
              <th>{t('Player name')}</th>
              <th>{t('Score')}</th>
            </tr>
          </thead>
          <tbody>
            {playersInRoom.sort((a, b) => b.score - a.score).map((playerInfo, index) => (
              <tr key={index}>
                <td>{index + 1 === 1 ? (<TrophyFill size={20} color='gold' />) : index + 1 === 2 ? (<TrophyFill size={20} color='silver' />) : index + 1 === 3 ? (<TrophyFill size={20} color='#cd7f32' />) : index + 1}</td>
                <td className='d-flex justify-content-center'><Badge level={playerLevels[playerInfo.username]} /></td>
                <td>{playerInfo.username}</td>
                <td>{playerInfo.score}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>{t('No players in the room yet')}...</p>
      )}
    </div>
  );
};

export default ListOfPlayers;
