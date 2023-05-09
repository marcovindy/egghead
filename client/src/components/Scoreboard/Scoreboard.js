import React from 'react';
import t from "../../i18nProvider/translate";

const Scoreboard = (playersInRoom) => {
  return (

    <div className="players-container">
      {playersInRoom.length > 0 ? (
        playersInRoom.map((playerInfo, index) => (
          <div key={index}>

            <p className="p-players">

              {t('Playername')}:{playerInfo.username}

            </p>
            <p className="p-players">
            {t('Score')}: {playerInfo.score}
            </p>
          </div>
        ))
      ) : (
        <p>{t('No players in the room yet...')}</p>
      )}
    </div>
  );
};

export default Scoreboard;
