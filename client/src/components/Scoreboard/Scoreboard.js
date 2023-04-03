import React from 'react';

const Scoreboard = (scores) => {
    return (
      <div>
        {scores.map(player => (
          <div key={player.name}>
            <span>{player.name}: {player.score}</span>
          </div>
        ))}
      </div>
    );
  };

export default Scoreboard;
