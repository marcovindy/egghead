import React from 'react';

const Scoreboard = (playersInRoom) => {
  return (

    <div className="players-container">
      {playersInRoom.length > 0 ? (
        playersInRoom.map((playerInfo, index) => (
          <div key={index}>

            <p className="p-players">

              Playername: {playerInfo.username}

            </p>
            <p className="p-players">
              Score: {playerInfo.score}
            </p>
          </div>
        ))
      ) : (
        <p>No players in the room yet...</p>
      )}
    </div>
  );
};

export default Scoreboard;
