import React, { useState } from 'react';
import AchievementCard from './AchievementCard/AchievementCard';
import { Trophy } from 'react-bootstrap-icons';
import './Achievements.css';

const Achievements = ({preview}) => {
  const achievements = [
    {
      title: 'First Achievement',
      description: 'You have unlocked your first achievement!',
      unlocked: true,
    },
    {
      title: 'Second Achievement',
      description: 'You have unlocked your second achievement!',
      unlocked: true,
    },
    {
      title: 'Third Achievement',
      description: 'You have unlocked your third achievement!',
      unlocked: false,
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(-1);


  return (
    <div>

      {preview ? (
        <div className='achievement'>
          {achievements.map((achievement, index) => (
            <div className="achievement-preview"
              key={achievement.title}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(-1)}
            >
              <Trophy size={35} />
              {hoveredIndex === index && (
                <div className="achievement-preview-tooltip">
                  <p className='small'>{achievement.title}</p>
                  {/* <p>{achievement.description}</p> */}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <>
          <h2>Achievements</h2>
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.title}
              title={achievement.title}
              description={achievement.description}
              unlocked={achievement.unlocked}
            />

          ))}
        </>
      )}
    </div>

  );
};

export default Achievements;
